import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  MockProductStore,
  MockOrderStore,
  MockReviewStore,
  MockPointStore,
  MockCouponStore,
  MockProfileStore,
  MockPostStore,
} from '@/mock/mockStorage';
import {
  Product,
  Order,
  Review,
  Profile,
  PointTransaction,
  UserCoupon,
  Post,
  OrderStatus,
} from '@/types/database.types';

export const api = {
  isLive: isSupabaseConfigured,

  // Products
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*), brand:brands(*), category:categories(*)')
          .eq('status', 'active');
        if (!error && data && data.length > 0) return data as Product[];
      } catch (e) {
        console.warn('Supabase query failed, falling back to local store:', e);
      }
    }
    return MockProductStore.getAll();
  },

  async getProductById(id: string): Promise<Product | undefined> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*), brand:brands(*), category:categories(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data as Product;
      } catch (e) {
        console.warn('Supabase getProductById failed:', e);
      }
    }
    return MockProductStore.getById(id);
  },

  async saveProduct(product: Product): Promise<Product> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .upsert(product)
          .select()
          .single();
        if (!error && data) return data as Product;
      } catch (e) {
        console.warn('Supabase saveProduct failed:', e);
      }
    }
    return MockProductStore.save(product);
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('orders').select('*, items:order_items(*)');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) return data as Order[];
      } catch (e) {
        console.warn('Supabase getOrders failed:', e);
      }
    }
    return userId ? MockOrderStore.getByUserId(userId) : MockOrderStore.getAll();
  },

  async createOrder(order: Order): Promise<Order> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('orders').insert(order).select().single();
        if (!error && data) {
          if (order.items && order.items.length > 0) {
            await supabase.from('order_items').insert(
              order.items.map((it) => ({
                ...it,
                order_id: data.id,
              }))
            );
          }
          return data as Order;
        }
      } catch (e) {
        console.warn('Supabase createOrder failed:', e);
      }
    }
    return MockOrderStore.create(order);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ order_status: status })
          .eq('id', orderId)
          .select()
          .single();
        if (!error && data) return data as Order;
      } catch (e) {
        console.warn('Supabase updateOrderStatus failed:', e);
      }
    }
    return MockOrderStore.updateStatus(orderId, status);
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    if (isSupabaseConfigured) {
      try {
        let q = supabase.from('reviews').select('*').eq('is_hidden', false);
        if (productId) q = q.eq('product_id', productId);
        const { data, error } = await q.order('created_at', { ascending: false });
        if (!error && data) return data as Review[];
      } catch (e) {
        console.warn('Supabase getReviews failed:', e);
      }
    }
    return productId ? MockReviewStore.getByProductId(productId) : MockReviewStore.getAll();
  },

  async createReview(review: Review): Promise<Review> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('reviews').insert(review).select().single();
        if (!error && data) return data as Review;
      } catch (e) {
        console.warn('Supabase createReview failed:', e);
      }
    }
    return MockReviewStore.create(review);
  },

  // Points
  async getPointTransactions(userId: string): Promise<PointTransaction[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('point_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as PointTransaction[];
      } catch (e) {
        console.warn('Supabase getPointTransactions failed:', e);
      }
    }
    return MockPointStore.getByUserId(userId);
  },

  async addPointTransaction(
    tx: Omit<PointTransaction, 'id' | 'balance_after' | 'created_at'>
  ): Promise<PointTransaction> {
    return MockPointStore.addTransaction(tx);
  },

  // User Coupons
  async getUserCoupons(userId: string): Promise<UserCoupon[]> {
    return MockCouponStore.getUserCoupons(userId);
  },

  // Posts
  async getPosts(boardSlug?: string): Promise<Post[]> {
    return boardSlug ? MockPostStore.getByBoard(boardSlug) : MockPostStore.getAll();
  },

  async createPost(post: Omit<Post, 'id' | 'view_count' | 'created_at'>): Promise<Post> {
    return MockPostStore.create(post);
  },
};
