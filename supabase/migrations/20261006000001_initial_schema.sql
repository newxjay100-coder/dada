-- ========================================================
-- DASSOBA (다써바) Ecommerce Database Schema
-- Supabase PostgreSQL Migration: 20261006000001_initial_schema.sql
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Member Grades
CREATE TABLE IF NOT EXISTS member_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_code VARCHAR(50) UNIQUE NOT NULL,
  grade_name VARCHAR(100) NOT NULL,
  min_spent NUMERIC(12, 2) DEFAULT 0,
  discount_rate NUMERIC(5, 2) DEFAULT 0, -- e.g. 5.0 for 5%
  point_rate NUMERIC(5, 2) DEFAULT 1.0, -- e.g. 1.0 for 1%
  benefits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  login_id VARCHAR(100) UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  birthday DATE,
  gender VARCHAR(20), -- 'M', 'F', 'O'
  member_grade VARCHAR(50) DEFAULT 'BRONZE' REFERENCES member_grades(grade_code) ON UPDATE CASCADE,
  role VARCHAR(30) DEFAULT 'customer', -- 'customer', 'admin', 'staff'
  points_balance INTEGER DEFAULT 0,
  status VARCHAR(30) DEFAULT 'active', -- 'active', 'blocked', 'dormant'
  marketing_consent BOOLEAN DEFAULT FALSE,
  terms_consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. User Addresses
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address_name VARCHAR(100) DEFAULT '기본배송지',
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  delivery_memo VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Categories (Hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  depth INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brands
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  english_name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  details_html TEXT,
  cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  regular_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_rate INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN regular_price > 0 AND sale_price < regular_price 
      THEN ROUND(((regular_price - sale_price) / regular_price) * 100)::INTEGER
      ELSE 0
    END
  ) STORED,
  tax_type VARCHAR(20) DEFAULT 'taxable', -- 'taxable', 'tax_free'
  status VARCHAR(30) DEFAULT 'active', -- 'active', 'hidden', 'sold_out'
  primary_image TEXT,
  is_one_plus_one BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_best BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3, 2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Product Variants (Color / Size)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_sku VARCHAR(120) UNIQUE NOT NULL,
  color VARCHAR(50) NOT NULL,
  color_code VARCHAR(20) DEFAULT '#000000',
  size VARCHAR(50) NOT NULL,
  additional_price NUMERIC(12, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  status VARCHAR(30) DEFAULT 'active', -- 'active', 'sold_out', 'hidden'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Product Images Gallery
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Inventory Master
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID UNIQUE NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  current_stock INTEGER DEFAULT 0,
  safety_stock INTEGER DEFAULT 5,
  low_stock_threshold INTEGER DEFAULT 10,
  location VARCHAR(100) DEFAULT 'MAIN-WH-A1',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Inventory Transactions Ledger
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'incoming', 'sale_out', 'return_in', 'adjustment', 'disposal', 'po_in'
  quantity INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reason TEXT,
  reference_id VARCHAR(100),
  reference_type VARCHAR(50), -- 'order', 'purchase_order', 'return', 'manual'
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  business_number VARCHAR(50),
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  bank_name VARCHAR(50),
  account_number VARCHAR(100),
  memo TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Purchase Orders (PO / 발주)
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'ordered', 'partial_received', 'completed', 'cancelled'
  total_cost NUMERIC(14, 2) DEFAULT 0,
  requested_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  received_date DATE,
  memo TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  unit_cost NUMERIC(12, 2) NOT NULL,
  total_cost NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Materials (원부자재)
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_code VARCHAR(50) UNIQUE NOT NULL,
  material_name VARCHAR(150) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  stock NUMERIC(12, 2) DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'EA', -- 'YD', 'KG', 'EA', 'ROLL'
  cost NUMERIC(12, 2) DEFAULT 0,
  location VARCHAR(100) DEFAULT 'MAT-STORAGE-01',
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Material Transactions
CREATE TABLE IF NOT EXISTS material_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'adjust'
  quantity NUMERIC(12, 2) NOT NULL,
  unit_cost NUMERIC(12, 2) DEFAULT 0,
  reference VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_owner_unique UNIQUE (user_id)
);

-- 17. Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_selected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_item_unique UNIQUE (cart_id, variant_id)
);

-- 18. Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT wishlist_unique UNIQUE (user_id, product_id)
);

-- 19. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  discount_type VARCHAR(30) NOT NULL, -- 'fixed', 'percentage', 'free_shipping'
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(12, 2) DEFAULT 0,
  max_discount_amount NUMERIC(12, 2),
  target_grade VARCHAR(50),
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. User Coupons
CREATE TABLE IF NOT EXISTS user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  order_id UUID,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 21. Point Transactions Ledger
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'signup', 'purchase', 'text_review', 'photo_review', 'event', 'admin_adjustment', 'usage', 'expiration', 'refund_reversal'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  reference_id VARCHAR(100),
  reference_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_name VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_phone VARCHAR(50) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  delivery_memo VARCHAR(255),
  total_product_amount NUMERIC(12, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  coupon_discount NUMERIC(12, 2) DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  final_payment_amount NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'easy_pay', 'transfer', 'vbank'
  order_status VARCHAR(50) DEFAULT 'paid', 
  -- Statuses: 'payment_pending', 'paid', 'preparing', 'po_ordered', 'shipping_ready', 'shipping', 'delivered', 'confirmed', 'cancelled', 'returned', 'refunded'
  payment_status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 23. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  variant_info VARCHAR(100) NOT NULL, -- e.g. "Black / M"
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  is_one_plus_one BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'ordered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_key VARCHAR(150),
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'completed',
  amount NUMERIC(12, 2) NOT NULL,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  receipt_url TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100) DEFAULT 'CJ대한통운',
  tracking_number VARCHAR(100),
  shipment_status VARCHAR(50) DEFAULT 'ready', -- 'ready', 'shipping', 'delivered'
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. Order Cancellations
CREATE TABLE IF NOT EXISTS order_cancellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason VARCHAR(150) NOT NULL,
  detail TEXT,
  status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'approved', 'rejected'
  refund_amount NUMERIC(12, 2) DEFAULT 0,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  admin_memo TEXT
);

-- 27. Returns & Exchanges
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claim_type VARCHAR(30) DEFAULT 'return', -- 'return', 'exchange'
  reason VARCHAR(150) NOT NULL,
  detail TEXT,
  photos TEXT[],
  status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'collecting', 'inspecting', 'completed', 'rejected'
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  admin_memo TEXT
);

-- 28. Refunds
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  cancellation_id UUID REFERENCES order_cancellations(id) ON DELETE SET NULL,
  return_id UUID REFERENCES returns(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  point_refund INTEGER DEFAULT 0,
  coupon_restored BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'completed',
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  admin_memo TEXT
);

-- 29. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content TEXT NOT NULL,
  fit_feedback VARCHAR(50), -- '정사이즈', '작은편', '큰편'
  size_feedback VARCHAR(50), -- '만족', '적당함', '보통'
  is_photo BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,
  points_awarded INTEGER DEFAULT 500,
  admin_reply TEXT,
  admin_replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 30. Review Images
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. Boards
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- 'qna', 'free', 'reservation', 'notice', 'faq'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- 32. Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  view_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'answered', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. Inquiries (1:1 고객상담)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'product', 'shipping', 'exchange_return', 'refund', 'points_coupon', 'general'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'in_progress', 'answered'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. Inquiry Messages
CREATE TABLE IF NOT EXISTS inquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 36. Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_number VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  reservation_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. Events & Campaigns
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  banner_image_url TEXT NOT NULL,
  mobile_banner_url TEXT,
  link_url TEXT,
  event_type VARCHAR(50) DEFAULT 'campaign', -- 'campaign', 'one_plus_one', 'seasonal', 'brand'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 38. Event Products
CREATE TABLE IF NOT EXISTS event_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  CONSTRAINT event_product_unique UNIQUE (event_id, product_id)
);

-- 39. Popups
CREATE TABLE IF NOT EXISTS popups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 40. Tax Documents
CREATE TABLE IF NOT EXISTS tax_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'tax_invoice', 'cash_receipt'
  company_name VARCHAR(150),
  business_registration_number VARCHAR(50),
  representative_name VARCHAR(100),
  address TEXT,
  supply_amount NUMERIC(12, 2) NOT NULL,
  tax_amount NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  issue_status VARCHAR(50) DEFAULT 'requested', -- 'requested', 'issued', 'cancelled'
  issue_date DATE,
  provider_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 41. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 42. Chatbot Sessions & Messages
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- 'user', 'bot', 'agent'
  message TEXT NOT NULL,
  quick_actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_point_trans_user ON point_transactions(user_id);
