import {
  Product,
  Order,
  Review,
  Profile,
  PointTransaction,
  UserCoupon,
  Post,
  Supplier,
  Material,
  PurchaseOrder,
  Shipment,
  TaxDocument,
  EventItem,
  PopupItem,
  Inquiry,
  OrderStatus,
} from '@/types/database.types';
import { INITIAL_PRODUCTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from './seedProducts';
import {
  INITIAL_COUPONS,
  INITIAL_EVENTS,
  INITIAL_POPUPS,
  INITIAL_REVIEWS,
  INITIAL_POSTS,
  INITIAL_PROFILES,
  INITIAL_ORDERS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_USER_COUPONS,
  INITIAL_SUPPLIERS,
  INITIAL_MATERIALS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_TAX_DOCUMENTS,
} from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'dassoba_v5_verified_apparel_products',
  ORDERS: 'dassoba_v5_verified_apparel_orders',
  REVIEWS: 'dassoba_v5_verified_apparel_reviews',
  PROFILES: 'dassoba_profiles',
  POINTS: 'dassoba_point_transactions',
  USER_COUPONS: 'dassoba_user_coupons',
  POSTS: 'dassoba_v5_verified_apparel_posts',
  INQUIRIES: 'dassoba_inquiries',
  EVENTS: 'dassoba_v5_verified_apparel_events',
  POPUPS: 'dassoba_v5_verified_apparel_popups',
  SUPPLIERS: 'dassoba_suppliers',
  MATERIALS: 'dassoba_materials',
  PURCHASE_ORDERS: 'dassoba_purchase_orders',
  DELIVERIES: 'dassoba_deliveries',
  TAX_DOCUMENTS: 'dassoba_tax_documents',
  CURRENT_USER: 'dassoba_current_user',
  CART: 'dassoba_cart',
  WISHLIST: 'dassoba_wishlist',
  CREDENTIALS: 'dassoba_auth_credentials',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage quota exceeded or error:', e);
  }
}

// Initializer
export function initMockStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    setStorage(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.POINTS)) {
    setStorage(STORAGE_KEYS.POINTS, INITIAL_POINT_TRANSACTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_COUPONS)) {
    setStorage(STORAGE_KEYS.USER_COUPONS, INITIAL_USER_COUPONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    setStorage(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.POPUPS)) {
    setStorage(STORAGE_KEYS.POPUPS, INITIAL_POPUPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    setStorage(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
    setStorage(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS)) {
    setStorage(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DELIVERIES)) {
    setStorage(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TAX_DOCUMENTS)) {
    setStorage(STORAGE_KEYS.TAX_DOCUMENTS, INITIAL_TAX_DOCUMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    setStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[1]); // Default to VIP user
  }
}

// Products API
export const MockProductStore = {
  getAll: (): Product[] => {
    initMockStorage();
    return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  getById: (id: string): Product | undefined => {
    return MockProductStore.getAll().find((p) => p.id === id);
  },
  save: (product: Product): Product => {
    const list = MockProductStore.getAll();
    const index = list.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.unshift(product);
    }
    setStorage(STORAGE_KEYS.PRODUCTS, list);
    return product;
  },
  delete: (id: string): void => {
    const list = MockProductStore.getAll().filter((p) => p.id !== id);
    setStorage(STORAGE_KEYS.PRODUCTS, list);
  },
};

// Orders API
export const MockOrderStore = {
  getAll: (): Order[] => {
    initMockStorage();
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  getById: (id: string): Order | undefined => {
    return MockOrderStore.getAll().find((o) => o.id === id || o.order_number === id);
  },
  getByUserId: (userId: string): Order[] => {
    return MockOrderStore.getAll().filter((o) => o.user_id === userId);
  },
  create: (order: Order): Order => {
    const list = MockOrderStore.getAll();
    list.unshift(order);
    setStorage(STORAGE_KEYS.ORDERS, list);
    return order;
  },
  save: (order: Order): Order => {
    const list = MockOrderStore.getAll();
    const index = list.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      list[index] = order;
    } else {
      list.unshift(order);
    }
    setStorage(STORAGE_KEYS.ORDERS, list);
    return order;
  },
  updateStatus: (orderId: string, status: OrderStatus): Order | undefined => {
    const list = MockOrderStore.getAll();
    const order = list.find((o) => o.id === orderId || o.order_number === orderId);
    if (order) {
      order.order_status = status;
      order.updated_at = new Date().toISOString();
      setStorage(STORAGE_KEYS.ORDERS, list);
    }
    return order;
  },
  delete: (orderId: string): void => {
    const list = MockOrderStore.getAll().filter(
      (o) => o.id !== orderId && o.order_number !== orderId
    );
    setStorage(STORAGE_KEYS.ORDERS, list);
  },
};

// Reviews API
export const MockReviewStore = {
  getAll: (): Review[] => {
    initMockStorage();
    return getStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  getByProductId: (productId: string): Review[] => {
    return MockReviewStore.getAll().filter((r) => r.product_id === productId && !r.is_hidden);
  },
  getByUserId: (userId: string): Review[] => {
    return MockReviewStore.getAll().filter((r) => r.user_id === userId);
  },
  create: (review: Review): Review => {
    const list = MockReviewStore.getAll();
    list.unshift(review);
    setStorage(STORAGE_KEYS.REVIEWS, list);

    // Also update product rating and count
    const product = MockProductStore.getById(review.product_id);
    if (product) {
      const prodReviews = list.filter((r) => r.product_id === review.product_id);
      const avg =
        prodReviews.reduce((sum, r) => sum + r.rating, 0) / (prodReviews.length || 1);
      product.review_count = prodReviews.length;
      product.rating_avg = Number(avg.toFixed(1));
      MockProductStore.save(product);
    }

    return review;
  },
  addReply: (reviewId: string, reply: string): Review | undefined => {
    const list = MockReviewStore.getAll();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.admin_reply = reply;
      item.admin_replied_at = new Date().toISOString();
      setStorage(STORAGE_KEYS.REVIEWS, list);
    }
    return item;
  },
  toggleHide: (reviewId: string): Review | undefined => {
    const list = MockReviewStore.getAll();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.is_hidden = !item.is_hidden;
      setStorage(STORAGE_KEYS.REVIEWS, list);
    }
    return item;
  },
};

// Points API
export const MockPointStore = {
  getByUserId: (userId: string): PointTransaction[] => {
    initMockStorage();
    const list = getStorage<PointTransaction[]>(STORAGE_KEYS.POINTS, INITIAL_POINT_TRANSACTIONS);
    return list.filter((p) => p.user_id === userId);
  },
  getBalance: (userId: string): number => {
    const transactions = MockPointStore.getByUserId(userId);
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  },
  addTransaction: (tx: Omit<PointTransaction, 'id' | 'balance_after' | 'created_at'>): PointTransaction => {
    const list = getStorage<PointTransaction[]>(STORAGE_KEYS.POINTS, INITIAL_POINT_TRANSACTIONS);
    const currentBalance = MockPointStore.getBalance(tx.user_id);
    const newRecord: PointTransaction = {
      ...tx,
      id: `pt-${Date.now()}`,
      balance_after: currentBalance + tx.amount,
      created_at: new Date().toISOString(),
    };
    list.unshift(newRecord);
    setStorage(STORAGE_KEYS.POINTS, list);

    // Update profile balance
    const profiles = getStorage<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const prof = profiles.find((p) => p.id === tx.user_id);
    if (prof) {
      prof.points_balance = newRecord.balance_after;
      setStorage(STORAGE_KEYS.PROFILES, profiles);
    }

    return newRecord;
  },
};

// Coupons API
export const MockCouponStore = {
  getAvailableCoupons: () => INITIAL_COUPONS,
  getUserCoupons: (userId: string): UserCoupon[] => {
    initMockStorage();
    const list = getStorage<UserCoupon[]>(STORAGE_KEYS.USER_COUPONS, INITIAL_USER_COUPONS);
    return list.filter((c) => c.user_id === userId);
  },
  markUsed: (userCouponId: string, orderId: string): void => {
    const list = getStorage<UserCoupon[]>(STORAGE_KEYS.USER_COUPONS, INITIAL_USER_COUPONS);
    const item = list.find((c) => c.id === userCouponId);
    if (item) {
      item.is_used = true;
      item.used_at = new Date().toISOString();
      item.order_id = orderId;
      setStorage(STORAGE_KEYS.USER_COUPONS, list);
    }
  },
  addCouponToUser: (userCoupon: Omit<UserCoupon, 'id'>): UserCoupon => {
    initMockStorage();
    const list = getStorage<UserCoupon[]>(STORAGE_KEYS.USER_COUPONS, INITIAL_USER_COUPONS);
    const item: UserCoupon = {
      ...userCoupon,
      id: `uc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    list.unshift(item);
    setStorage(STORAGE_KEYS.USER_COUPONS, list);
    return item;
  },
};

// Auth & Credentials API
export const MockAuthStore = {
  getCredentials: (): Record<string, string> => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      return item
        ? JSON.parse(item)
        : {
            admin: 'password123',
            'admin@dassoba.kr': 'password123',
            vipuser: 'password123',
            'vip@dassoba.kr': 'password123',
            user: 'password123',
            'user@dassoba.kr': 'password123',
          };
    } catch {
      return {};
    }
  },
  saveCredential: (loginId: string, email: string, password: string): void => {
    const creds = MockAuthStore.getCredentials();
    creds[loginId.toLowerCase()] = password;
    creds[email.toLowerCase()] = password;
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(creds));
  },
  verifyPassword: (loginIdOrEmail: string, password: string): boolean => {
    const creds = MockAuthStore.getCredentials();
    const key = loginIdOrEmail.toLowerCase();
    if (creds[key]) {
      return creds[key] === password;
    }
    // If user is registered in profiles, check password length or default demo password
    return password === 'password123' || password.length >= 4;
  },
  isLoginIdTaken: (loginId: string): boolean => {
    const profiles = MockProfileStore.getAll();
    return profiles.some((p) => p.login_id.toLowerCase() === loginId.trim().toLowerCase());
  },
  isEmailTaken: (email: string): boolean => {
    const profiles = MockProfileStore.getAll();
    return profiles.some((p) => p.email.toLowerCase() === email.trim().toLowerCase());
  },
};

// Profiles / Auth API
export const MockProfileStore = {
  getCurrentUser: (): Profile => {
    initMockStorage();
    return getStorage<Profile>(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[1]);
  },
  setCurrentUser: (profile: Profile): void => {
    setStorage(STORAGE_KEYS.CURRENT_USER, profile);
  },
  getAll: (): Profile[] => {
    initMockStorage();
    return getStorage<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },
  updateProfile: (profile: Profile): Profile => {
    const list = MockProfileStore.getAll();
    const index = list.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      list[index] = profile;
    } else {
      list.push(profile);
    }
    setStorage(STORAGE_KEYS.PROFILES, list);
    const current = MockProfileStore.getCurrentUser();
    if (current && current.id === profile.id) {
      MockProfileStore.setCurrentUser(profile);
    }
    return profile;
  },
  delete: (id: string): void => {
    const list = MockProfileStore.getAll().filter((p) => p.id !== id);
    setStorage(STORAGE_KEYS.PROFILES, list);
  },
};

// Events API
export const MockEventStore = {
  getAll: (): EventItem[] => {
    initMockStorage();
    return getStorage<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },
  save: (event: EventItem): EventItem => {
    const list = MockEventStore.getAll();
    const index = list.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      list[index] = event;
    } else {
      list.unshift(event);
    }
    setStorage(STORAGE_KEYS.EVENTS, list);
    return event;
  },
  delete: (id: string): void => {
    const list = MockEventStore.getAll().filter((e) => e.id !== id);
    setStorage(STORAGE_KEYS.EVENTS, list);
  },
};

// Posts API
export const MockPostStore = {
  getAll: (): Post[] => {
    initMockStorage();
    return getStorage<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  },
  getByBoard: (slug: string): Post[] => {
    return MockPostStore.getAll().filter((p) => p.board_slug === slug);
  },
  create: (post: Omit<Post, 'id' | 'view_count' | 'created_at'>): Post => {
    const list = MockPostStore.getAll();
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      view_count: 0,
      created_at: new Date().toISOString(),
    };
    list.unshift(newPost);
    setStorage(STORAGE_KEYS.POSTS, list);
    return newPost;
  },
};

// Materials API
export const MockMaterialStore = {
  getAll: (): Material[] => {
    initMockStorage();
    return getStorage<Material[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  },
  save: (material: Material): Material => {
    const list = MockMaterialStore.getAll();
    const index = list.findIndex((m) => m.id === material.id);
    if (index >= 0) {
      list[index] = material;
    } else {
      list.unshift(material);
    }
    setStorage(STORAGE_KEYS.MATERIALS, list);
    return material;
  },
  delete: (id: string): void => {
    const list = MockMaterialStore.getAll().filter((m) => m.id !== id);
    setStorage(STORAGE_KEYS.MATERIALS, list);
  },
};

// Purchase Orders API
export const MockPurchaseOrderStore = {
  getAll: (): PurchaseOrder[] => {
    initMockStorage();
    return getStorage<PurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
  },
  save: (po: PurchaseOrder): PurchaseOrder => {
    const list = MockPurchaseOrderStore.getAll();
    const index = list.findIndex((p) => p.id === po.id);
    if (index >= 0) {
      list[index] = po;
    } else {
      list.unshift(po);
    }
    setStorage(STORAGE_KEYS.PURCHASE_ORDERS, list);
    return po;
  },
  updateStatus: (poId: string, status: PurchaseOrder['status']): PurchaseOrder | undefined => {
    const list = MockPurchaseOrderStore.getAll();
    const item = list.find((p) => p.id === poId);
    if (item) {
      item.status = status;
      if (status === 'completed') {
        item.received_date = new Date().toISOString().split('T')[0];
      }
      setStorage(STORAGE_KEYS.PURCHASE_ORDERS, list);
    }
    return item;
  },
  delete: (id: string): void => {
    const list = MockPurchaseOrderStore.getAll().filter((p) => p.id !== id);
    setStorage(STORAGE_KEYS.PURCHASE_ORDERS, list);
  },
};

// Deliveries / Shipments API
export const MockDeliveryStore = {
  getAll: (): Shipment[] => {
    initMockStorage();
    return getStorage<Shipment[]>(STORAGE_KEYS.DELIVERIES, INITIAL_DELIVERIES);
  },
  save: (shipment: Shipment): Shipment => {
    const list = MockDeliveryStore.getAll();
    const index = list.findIndex((s) => s.id === shipment.id);
    if (index >= 0) {
      list[index] = shipment;
    } else {
      list.unshift(shipment);
    }
    setStorage(STORAGE_KEYS.DELIVERIES, list);
    return shipment;
  },
  updateTracking: (
    id: string,
    trackingNumber: string,
    status: Shipment['shipment_status'] = 'shipping'
  ): Shipment | undefined => {
    const list = MockDeliveryStore.getAll();
    const item = list.find((s) => s.id === id);
    if (item) {
      item.tracking_number = trackingNumber;
      item.shipment_status = status;
      if (status === 'shipping' && !item.shipped_at) {
        item.shipped_at = new Date().toISOString();
      } else if (status === 'delivered' && !item.delivered_at) {
        item.delivered_at = new Date().toISOString();
      }
      setStorage(STORAGE_KEYS.DELIVERIES, list);
    }
    return item;
  },
  delete: (id: string): void => {
    const list = MockDeliveryStore.getAll().filter((s) => s.id !== id);
    setStorage(STORAGE_KEYS.DELIVERIES, list);
  },
};

// Tax Documents API
export const MockTaxDocumentStore = {
  getAll: (): TaxDocument[] => {
    initMockStorage();
    return getStorage<TaxDocument[]>(STORAGE_KEYS.TAX_DOCUMENTS, INITIAL_TAX_DOCUMENTS);
  },
  save: (doc: TaxDocument): TaxDocument => {
    const list = MockTaxDocumentStore.getAll();
    const index = list.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      list[index] = doc;
    } else {
      list.unshift(doc);
    }
    setStorage(STORAGE_KEYS.TAX_DOCUMENTS, list);
    return doc;
  },
  updateStatus: (id: string, status: TaxDocument['issue_status']): TaxDocument | undefined => {
    const list = MockTaxDocumentStore.getAll();
    const item = list.find((d) => d.id === id);
    if (item) {
      item.issue_status = status;
      if (status === 'issued') {
        item.issue_date = new Date().toISOString().split('T')[0];
      }
      setStorage(STORAGE_KEYS.TAX_DOCUMENTS, list);
    }
    return item;
  },
  delete: (id: string): void => {
    const list = MockTaxDocumentStore.getAll().filter((d) => d.id !== id);
    setStorage(STORAGE_KEYS.TAX_DOCUMENTS, list);
  },
};

