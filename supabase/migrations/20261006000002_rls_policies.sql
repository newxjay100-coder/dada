-- ========================================================
-- DASSOBA (다써바) Row Level Security (RLS) Policies
-- Supabase PostgreSQL Migration: 20261006000002_rls_policies.sql
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE member_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: check if authenticated user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Member Grades (Public read, admin write)
CREATE POLICY "Public read member_grades" ON member_grades FOR SELECT USING (true);
CREATE POLICY "Admin manage member_grades" ON member_grades FOR ALL USING (is_admin());

-- 2. Profiles (User read/update own, Admin full)
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR is_admin());
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin());

-- 3. User Addresses (User own, Admin full)
CREATE POLICY "Users manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

-- 4. Categories & Brands (Public read, Admin write)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Public read brands" ON brands FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (is_admin());

-- 5. Products, Variants & Images (Public read active, Admin write)
CREATE POLICY "Public read products" ON products FOR SELECT USING (status != 'hidden' OR is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (status != 'hidden' OR is_admin());
CREATE POLICY "Admin manage product_variants" ON product_variants FOR ALL USING (is_admin());

CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin manage product_images" ON product_images FOR ALL USING (is_admin());

-- 6. Inventory & Transactions (Admin only)
CREATE POLICY "Admin manage inventory" ON inventory FOR ALL USING (is_admin());
CREATE POLICY "Admin manage inventory_transactions" ON inventory_transactions FOR ALL USING (is_admin());

-- 7. Suppliers, Purchase Orders, Materials (Admin only)
CREATE POLICY "Admin manage suppliers" ON suppliers FOR ALL USING (is_admin());
CREATE POLICY "Admin manage purchase_orders" ON purchase_orders FOR ALL USING (is_admin());
CREATE POLICY "Admin manage purchase_order_items" ON purchase_order_items FOR ALL USING (is_admin());
CREATE POLICY "Admin manage materials" ON materials FOR ALL USING (is_admin());
CREATE POLICY "Admin manage material_transactions" ON material_transactions FOR ALL USING (is_admin());

-- 8. Carts & Cart Items (User own or Admin)
CREATE POLICY "Users manage own cart" ON carts FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR is_admin()))
);

-- 9. Wishlists (User own or Admin)
CREATE POLICY "Users manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id OR is_admin());

-- 10. Coupons & User Coupons
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage coupons" ON coupons FOR ALL USING (is_admin());

CREATE POLICY "Users view own user_coupons" ON user_coupons FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users update own user_coupons" ON user_coupons FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin manage user_coupons" ON user_coupons FOR ALL USING (is_admin());

-- 11. Point Transactions (User read own, Admin full)
CREATE POLICY "Users read own point transactions" ON point_transactions FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin manage point transactions" ON point_transactions FOR ALL USING (is_admin());

-- 12. Orders, Order Items, Payments, Shipments
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (is_admin());

CREATE POLICY "Users read own order_items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Users insert own order_items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin manage order_items" ON order_items FOR ALL USING (is_admin());

CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin manage payments" ON payments FOR ALL USING (is_admin());

CREATE POLICY "Users read own shipments" ON shipments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = shipments.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin manage shipments" ON shipments FOR ALL USING (is_admin());

-- 13. Order Cancellations, Returns & Refunds
CREATE POLICY "Users manage own cancellations" ON order_cancellations FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage own returns" ON returns FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users view own refunds" ON refunds FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = refunds.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin manage refunds" ON refunds FOR ALL USING (is_admin());

-- 14. Reviews & Review Images
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_hidden = false OR auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Public read review images" ON review_images FOR SELECT USING (true);
CREATE POLICY "Users insert review images" ON review_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_images.review_id AND (reviews.user_id = auth.uid() OR is_admin()))
);

-- 15. Boards, Posts, Comments
CREATE POLICY "Public read boards" ON boards FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage boards" ON boards FOR ALL USING (is_admin());

CREATE POLICY "Public read posts" ON posts FOR SELECT USING (is_private = false OR auth.uid() = user_id OR is_admin());
CREATE POLICY "Users create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage own posts" ON posts FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage comments" ON comments FOR ALL USING (auth.uid() = user_id OR is_admin());

-- 16. Inquiries (1:1 상담)
CREATE POLICY "Users manage own inquiries" ON inquiries FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage own inquiry messages" ON inquiry_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM inquiries WHERE inquiries.id = inquiry_messages.inquiry_id AND (inquiries.user_id = auth.uid() OR is_admin()))
);

-- 17. Reservations
CREATE POLICY "Users read own reservations" ON reservations FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users create reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin manage reservations" ON reservations FOR ALL USING (is_admin());

-- 18. Events & Popups
CREATE POLICY "Public read events" ON events FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read event_products" ON event_products FOR SELECT USING (true);
CREATE POLICY "Admin manage events" ON events FOR ALL USING (is_admin());
CREATE POLICY "Admin manage event_products" ON event_products FOR ALL USING (is_admin());

CREATE POLICY "Public read popups" ON popups FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage popups" ON popups FOR ALL USING (is_admin());

-- 19. Tax Documents
CREATE POLICY "Users read own tax_documents" ON tax_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = tax_documents.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin manage tax_documents" ON tax_documents FOR ALL USING (is_admin());

-- 20. Notifications
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id OR is_admin());

-- 21. Chatbot
CREATE POLICY "Public chatbot access" ON chatbot_sessions FOR ALL USING (true);
CREATE POLICY "Public chatbot messages" ON chatbot_messages FOR ALL USING (true);
