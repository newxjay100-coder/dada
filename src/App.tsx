import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Global Context Providers
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

// Layout & Global Widgets
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { FloatingChatbot } from '@/components/widgets/FloatingChatbot';
import { KakaoFloatingButton } from '@/components/widgets/KakaoFloatingButton';
import { MouseShadowFollower } from '@/components/common/MouseShadowFollower';
import { BackgroundMusicPlayer } from '@/components/common/BackgroundMusicPlayer';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Storefront Core Pages
import { HomePage } from '@/pages/HomePage';
import { ProductListPage } from '@/pages/ProductListPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotIdPage } from '@/pages/auth/ForgotIdPage';

// MyPage Sub-pages
import { MyPageLayout } from '@/pages/mypage/MyPageLayout';
import { MyPageDashboard } from '@/pages/mypage/MyPageDashboard';
import { MyOrdersPage } from '@/pages/mypage/MyOrdersPage';
import { MyClaimsPage } from '@/pages/mypage/MyClaimsPage';
import { MyWishlistPage } from '@/pages/mypage/MyWishlistPage';
import { MyCouponsPage } from '@/pages/mypage/MyCouponsPage';
import { MyPointsPage } from '@/pages/mypage/MyPointsPage';
import { MyReviewsPage } from '@/pages/mypage/MyReviewsPage';
import { MyInquiriesPage } from '@/pages/mypage/MyInquiriesPage';
import { MyAddressesPage } from '@/pages/mypage/MyAddressesPage';
import { MyProfileEditPage } from '@/pages/mypage/MyProfileEditPage';

// Special Curations & Editorial
import { OnePlusOnePage } from '@/pages/special/OnePlusOnePage';
import { BrandListPage } from '@/pages/special/BrandListPage';
import { EventListPage, MagazineListPage } from '@/pages/special/EventListPage';
import { ReviewsPage } from '@/pages/special/ReviewsPage';

import { CustomerCenterPage } from '@/pages/customer/CustomerCenterPage';
import { NoticePage, FaqPage } from '@/pages/customer/NoticePage';
import { TermsPage } from '@/pages/customer/TermsPage';
import { QnaBoardPage } from '@/pages/boards/QnaBoardPage';
import { FreeBoardPage } from '@/pages/boards/FreeBoardPage';
import { ReservationBoardPage } from '@/pages/boards/ReservationBoardPage';

// Admin ERP Backoffice Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminMembersPage } from '@/pages/admin/AdminMembersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminPurchaseOrdersPage } from '@/pages/admin/AdminPurchaseOrdersPage';
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage';
import { AdminMaterialsPage } from '@/pages/admin/AdminMaterialsPage';
import { AdminTaxDocumentsPage } from '@/pages/admin/AdminTaxDocumentsPage';
import { AdminDeliveryPage } from '@/pages/admin/AdminDeliveryPage';
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage';
import { AdminSupabaseCenterPage } from '@/pages/admin/AdminSupabaseCenterPage';
import { AdminImagesPage } from '@/pages/admin/AdminImagesPage';

/**
 * ScrollToTop helper: scrolls smoothly to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

/**
 * Customer Storefront Layout with Global Navigation, Footer, Bottom Nav & Floating CTAs
 */
const StoreLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#07070e] text-[#e2e2ee] font-sans selection:bg-[#00f0ff] selection:text-black">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <FloatingChatbot />
      <KakaoFloatingButton />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <MouseShadowFollower />
              <BackgroundMusicPlayer />
              <Routes>
                {/* 1. Customer Storefront Routes */}
                <Route element={<StoreLayout />}>
                  {/* Home */}
                  <Route path="/" element={<HomePage />} />

                  {/* Product Browsing & Search */}
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/category/:categorySlug" element={<ProductListPage />} />
                  <Route path="/search" element={<ProductListPage />} />
                  <Route path="/new" element={<ProductListPage />} />
                  <Route path="/best" element={<ProductListPage />} />
                  <Route path="/special/outlet" element={<ProductListPage />} />
                  <Route path="/special/editorial" element={<ProductListPage />} />

                  {/* Product Detail (Supports both singular /product/:id and /products/:id) */}
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/products/:productId" element={<ProductDetailPage />} />

                  {/* Order & Checkout Lifecycle */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />

                  {/* Authentication (Both /login, /register and /auth/* routes supported) */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/forgot-id" element={<ForgotIdPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotIdPage />} />
                  <Route path="/forgot-id" element={<ForgotIdPage />} />
                  <Route path="/forgot-password" element={<ForgotIdPage />} />

                  {/* Customer MyPage (10+ sub-functions) */}
                  <Route path="/mypage" element={<MyPageLayout />}>
                    <Route index element={<MyPageDashboard />} />
                    <Route path="orders" element={<MyOrdersPage />} />
                    <Route path="claims" element={<MyClaimsPage />} />
                    <Route path="wishlist" element={<MyWishlistPage />} />
                    <Route path="coupons" element={<MyCouponsPage />} />
                    <Route path="points" element={<MyPointsPage />} />
                    <Route path="reviews" element={<MyReviewsPage />} />
                    <Route path="inquiries" element={<MyInquiriesPage />} />
                    <Route path="addresses" element={<MyAddressesPage />} />
                    <Route path="profile" element={<MyProfileEditPage />} />
                  </Route>

                  {/* Special Features & Curation */}
                  <Route path="/1plus1" element={<OnePlusOnePage />} />
                  <Route path="/special/1plus1" element={<OnePlusOnePage />} />
                  <Route path="/brands" element={<BrandListPage />} />
                  <Route path="/events" element={<EventListPage />} />
                  <Route path="/magazine" element={<MagazineListPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />

                  {/* Community & Customer Center */}
                  <Route path="/customer" element={<CustomerCenterPage />} />
                  <Route path="/customer/notices" element={<NoticePage />} />
                  <Route path="/customer/faq" element={<FaqPage />} />
                  <Route path="/boards/notice" element={<NoticePage />} />
                  <Route path="/boards/faq" element={<FaqPage />} />
                  <Route path="/boards/qna" element={<QnaBoardPage />} />
                  <Route path="/boards/free" element={<FreeBoardPage />} />
                  <Route path="/boards/reservations" element={<ReservationBoardPage />} />
                  <Route path="/boards/reservation" element={<ReservationBoardPage />} />

                  {/* Policy & Terms */}
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<TermsPage />} />
                </Route>

                {/* 2. Admin ERP Backoffice Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="supabase" element={<AdminSupabaseCenterPage />} />
                  <Route path="images" element={<AdminImagesPage />} />
                  <Route path="members" element={<AdminMembersPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="purchase-orders" element={<AdminPurchaseOrdersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="materials" element={<AdminMaterialsPage />} />
                  <Route path="tax-documents" element={<AdminTaxDocumentsPage />} />
                  <Route path="delivery" element={<AdminDeliveryPage />} />
                  <Route path="events" element={<AdminEventsPage />} />
                </Route>

                {/* 3. Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
