// Database TypeScript Definitions for DASSOBA (다써바)

export type MemberGradeCode = 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP' | 'VVIP';
export type UserRole = 'customer' | 'admin' | 'staff';
export type UserStatus = 'active' | 'blocked' | 'dormant';
export type ProductStatus = 'active' | 'hidden' | 'sold_out';
export type VariantStatus = 'active' | 'sold_out' | 'hidden';

export interface MemberGrade {
  id: string;
  grade_code: MemberGradeCode;
  grade_name: string;
  min_spent: number;
  discount_rate: number;
  point_rate: number;
  benefits: string[];
  created_at?: string;
}

export interface Profile {
  id: string;
  login_id: string;
  email: string;
  name: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  member_grade: MemberGradeCode;
  role: UserRole;
  points_balance: number;
  status: UserStatus;
  marketing_consent: boolean;
  terms_consent: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  address_name: string;
  recipient_name: string;
  recipient_phone: string;
  postal_code: string;
  address_line1: string;
  address_line2?: string;
  is_default: boolean;
  delivery_memo?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  parent_id?: string | null;
  slug: string;
  name: string;
  depth: number;
  display_order: number;
  is_active: boolean;
  subcategories?: Category[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  english_name: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_sku: string;
  color: string;
  color_code: string;
  size: string;
  additional_price: number;
  stock_quantity: number;
  status: VariantStatus;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand_id?: string;
  brand?: Brand;
  category_id?: string;
  category?: Category;
  description: string;
  details_html?: string;
  cost_price: number;
  regular_price: number;
  sale_price: number;
  discount_rate: number;
  tax_type: 'taxable' | 'tax_free';
  status: ProductStatus;
  primary_image: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  is_one_plus_one: boolean;
  is_new: boolean;
  is_best: boolean;
  view_count: number;
  sale_count: number;
  rating_avg: number;
  review_count: number;
  created_at: string;
  updated_at?: string;
}

export type OrderStatus =
  | 'payment_pending'
  | 'paid'
  | 'preparing'
  | 'po_ordered'
  | 'shipping_ready'
  | 'shipping'
  | 'delivered'
  | 'confirmed'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_info: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  is_one_plus_one: boolean;
  status: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  order_name: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  recipient_name: string;
  recipient_phone: string;
  postal_code: string;
  address_line1: string;
  address_line2?: string;
  delivery_memo?: string;
  total_product_amount: number;
  delivery_fee: number;
  discount_amount: number;
  coupon_discount: number;
  points_used: number;
  final_payment_amount: number;
  payment_method: 'tosspay' | 'credit_card' | 'easy_pay' | 'transfer' | 'vbank' | 'mobile';
  payment_key?: string;
  payment_provider?: string;
  order_status: OrderStatus;
  payment_status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_key: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  paid_at: string;
  receipt_url?: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  shipment_status: 'ready' | 'shipping' | 'delivered';
  shipped_at?: string;
  delivered_at?: string;
  memo?: string;
}

export interface OrderCancellation {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  detail?: string;
  status: 'requested' | 'approved' | 'rejected';
  refund_amount: number;
  requested_at: string;
  completed_at?: string;
  admin_memo?: string;
}

export interface ReturnClaim {
  id: string;
  order_id: string;
  order_item_id?: string;
  user_id: string;
  claim_type: 'return' | 'exchange';
  reason: string;
  detail?: string;
  photos?: string[];
  status: 'requested' | 'collecting' | 'inspecting' | 'completed' | 'rejected';
  requested_at: string;
  completed_at?: string;
  admin_memo?: string;
}

export interface RefundRecord {
  id: string;
  order_id: string;
  amount: number;
  point_refund: number;
  coupon_restored: boolean;
  status: 'requested' | 'completed' | 'failed';
  processed_at: string;
  admin_memo?: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage' | 'free_shipping';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  target_grade?: MemberGradeCode;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  coupon?: Coupon;
  is_used: boolean;
  used_at?: string;
  order_id?: string | null;
  issued_at: string;
  expires_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  transaction_type:
    | 'signup'
    | 'purchase'
    | 'text_review'
    | 'photo_review'
    | 'event'
    | 'admin_adjustment'
    | 'usage'
    | 'expiration'
    | 'refund_reversal';
  amount: number;
  balance_after: number;
  description: string;
  reference_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  user_grade?: MemberGradeCode;
  product_id: string;
  product_name?: string;
  order_item_id?: string;
  rating: number;
  content: string;
  fit_feedback?: string;
  size_feedback?: string;
  is_photo: boolean;
  is_verified: boolean;
  is_hidden: boolean;
  points_awarded: number;
  admin_reply?: string;
  admin_replied_at?: string;
  images?: string[];
  created_at: string;
}

export interface Post {
  id: string;
  board_id: string;
  board_slug?: string;
  user_id?: string;
  author_name: string;
  title: string;
  content: string;
  is_private: boolean;
  view_count: number;
  status: 'pending' | 'answered' | 'closed';
  created_at: string;
  comments_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id?: string;
  author_name: string;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  category: 'product' | 'shipping' | 'exchange_return' | 'refund' | 'points_coupon' | 'general';
  title: string;
  content: string;
  status: 'submitted' | 'in_progress' | 'answered';
  admin_reply?: string;
  created_at: string;
  updated_at?: string;
}

export interface Reservation {
  id: string;
  reservation_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  memo?: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  banner_image_url: string;
  mobile_banner_url?: string;
  link_url?: string;
  event_type: 'campaign' | 'one_plus_one' | 'seasonal' | 'brand';
  start_date: string;
  end_date: string;
  is_active: boolean;
  display_order: number;
}

export interface PopupItem {
  id: string;
  title: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  start_datetime: string;
  end_datetime: string;
  priority: number;
  is_active: boolean;
}

export interface Supplier {
  id: string;
  supplier_code: string;
  name: string;
  business_number?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  memo?: string;
  is_active: boolean;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id?: string;
  supplier_name?: string;
  status: 'draft' | 'ordered' | 'partial_received' | 'completed' | 'cancelled';
  total_cost: number;
  requested_date: string;
  expected_date?: string;
  received_date?: string;
  memo?: string;
  items_count?: number;
  created_at: string;
}

export interface Material {
  id: string;
  material_code: string;
  material_name: string;
  supplier_id?: string;
  supplier_name?: string;
  stock: number;
  unit: string;
  cost: number;
  location: string;
  memo?: string;
}

export interface TaxDocument {
  id: string;
  order_id: string;
  document_type: 'tax_invoice' | 'cash_receipt';
  company_name: string;
  business_registration_number: string;
  representative_name: string;
  supply_amount: number;
  tax_amount: number;
  total_amount: number;
  issue_status: 'requested' | 'issued' | 'cancelled';
  issue_date?: string;
  created_at: string;
}

// 43. Header Features & User Experience Tables
export interface CartItemRecord {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  is_selected: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WishlistRecord {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
}

export interface SearchLog {
  id: string;
  user_id?: string | null;
  query: string;
  results_count?: number;
  source?: 'header' | 'modal' | 'mobile';
  created_at?: string;
}

export interface PopularKeyword {
  id: string;
  keyword: string;
  search_count: number;
  updated_at?: string;
}

export interface RoleAuditLog {
  id: string;
  user_id: string;
  previous_role: string;
  new_role: string;
  changed_at?: string;
}

export interface AuthLog {
  id: string;
  user_id: string;
  email: string;
  event_type: 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'ROLE_SWITCH';
  details?: string;
  created_at?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  view_count: number;
  created_at?: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  created_at?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  file_name: string;
  url: string;
  bucket: 'products' | 'banners' | 'avatars' | 'editorial';
  linked_type?: 'product' | 'event' | 'profile' | 'general';
  linked_id?: string;
  file_size?: number;
  storage_source: 'supabase_storage' | 'supabase_db' | 'cloud_cdn';
  created_at: string;
}


