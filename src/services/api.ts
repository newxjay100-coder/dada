import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  MockProductStore,
  MockOrderStore,
  MockReviewStore,
  MockPointStore,
  MockCouponStore,
  MockProfileStore,
  MockPostStore,
  MockEventStore,
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
  EventItem,
} from '@/types/database.types';

export const api = {
  isLive: isSupabaseConfigured,

  // ==========================================
  // 1. PRODUCTS (상품 관리)
  // ==========================================
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*), brand:brands(*), category:categories(*)')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Product[];
      } catch (e) {
        console.warn('Supabase getProducts failed, falling back to local store:', e);
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
    // Save to local storage first for instant responsive UI
    MockProductStore.save(product);

    if (isSupabaseConfigured) {
      try {
        // Strip out relational objects before upserting into products table
        const { variants, brand, category, images, ...tablePayload } = product;

        const { data, error } = await supabase
          .from('products')
          .upsert(tablePayload)
          .select()
          .single();

        if (error) {
          console.warn('Supabase saveProduct error:', error);
        } else if (variants && variants.length > 0) {
          // Upsert variants
          await supabase.from('product_variants').upsert(
            variants.map((v) => ({
              ...v,
              product_id: product.id,
            }))
          );
        }
      } catch (e) {
        console.warn('Supabase saveProduct exception:', e);
      }
    }
    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    MockProductStore.delete(id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('product_variants').delete().eq('product_id', id);
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.warn('Supabase deleteProduct error:', error);
      } catch (e) {
        console.warn('Supabase deleteProduct exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 2. MEMBERS & PROFILES (회원 관리)
  // ==========================================
  async getProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Profile[];
      } catch (e) {
        console.warn('Supabase getProfiles failed, falling back to local store:', e);
      }
    }
    return MockProfileStore.getAll();
  },

  async saveProfile(profile: Profile): Promise<Profile> {
    MockProfileStore.updateProfile(profile);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert(profile);
        if (error) console.warn('Supabase saveProfile error:', error);
      } catch (e) {
        console.warn('Supabase saveProfile exception:', e);
      }
    }
    return profile;
  },

  async deleteProfile(id: string): Promise<boolean> {
    MockProfileStore.delete(id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) console.warn('Supabase deleteProfile error:', error);
      } catch (e) {
        console.warn('Supabase deleteProfile exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 3. EVENTS & HERO BANNERS (기획전 & 배너)
  // ==========================================
  async getEvents(): Promise<EventItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as EventItem[];
      } catch (e) {
        console.warn('Supabase getEvents failed, falling back to local store:', e);
      }
    }
    return MockEventStore.getAll();
  },

  async saveEvent(event: EventItem): Promise<EventItem> {
    MockEventStore.save(event);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('events')
          .upsert(event);
        if (error) console.warn('Supabase saveEvent error:', error);
      } catch (e) {
        console.warn('Supabase saveEvent exception:', e);
      }
    }
    return event;
  },

  async deleteEvent(id: string): Promise<boolean> {
    MockEventStore.delete(id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) console.warn('Supabase deleteEvent error:', error);
      } catch (e) {
        console.warn('Supabase deleteEvent exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 4. ORDERS (주문 & 배송 관리)
  // ==========================================
  async getOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('orders').select('*, items:order_items(*)');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Order[];
      } catch (e) {
        console.warn('Supabase getOrders failed:', e);
      }
    }
    return userId ? MockOrderStore.getByUserId(userId) : MockOrderStore.getAll();
  },

  async createOrder(order: Order): Promise<Order> {
    MockOrderStore.create(order);

    if (isSupabaseConfigured) {
      try {
        const { items, ...orderData } = order;
        const { data, error } = await supabase.from('orders').insert(orderData).select().single();
        if (!error && data && items && items.length > 0) {
          await supabase.from('order_items').insert(
            items.map((it) => ({
              ...it,
              order_id: data.id,
            }))
          );
        }
      } catch (e) {
        console.warn('Supabase createOrder failed:', e);
      }
    }
    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    const updated = MockOrderStore.updateStatus(orderId, status);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status })
          .eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updateOrderStatus failed:', e);
      }
    }
    return updated;
  },

  // ==========================================
  // 5. REVIEWS & COMMUNITY
  // ==========================================
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
    MockReviewStore.create(review);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('reviews').insert(review);
      } catch (e) {
        console.warn('Supabase createReview failed:', e);
      }
    }
    return review;
  },

  // ==========================================
  // 6. POINTS & COUPONS
  // ==========================================
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
    const result = MockPointStore.addTransaction(tx);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('point_transactions').insert(result);
        await supabase
          .from('profiles')
          .update({ points_balance: result.balance_after })
          .eq('id', tx.user_id);
      } catch (e) {
        console.warn('Supabase addPointTransaction error:', e);
      }
    }
    return result;
  },

  async getUserCoupons(userId: string): Promise<UserCoupon[]> {
    return MockCouponStore.getUserCoupons(userId);
  },

  async getPosts(boardSlug?: string): Promise<Post[]> {
    return boardSlug ? MockPostStore.getByBoard(boardSlug) : MockPostStore.getAll();
  },

  async createPost(post: Omit<Post, 'id' | 'view_count' | 'created_at'>): Promise<Post> {
    return MockPostStore.create(post);
  },

  // ==========================================
  // 7. BATCH CLOUD SYNC (Supabase 전체 동기화)
  // ==========================================
  async syncAllToSupabase(): Promise<{
    success: boolean;
    syncedCounts: { products: number; profiles: number; events: number; orders: number };
    errors: string[];
  }> {
    const errors: string[] = [];
    const counts = { products: 0, profiles: 0, events: 0, orders: 0 };

    if (!isSupabaseConfigured) {
      return {
        success: false,
        syncedCounts: counts,
        errors: ['Supabase Anon Key가 설정되지 않았습니다.'],
      };
    }

    // 1. Sync Profiles
    try {
      const profiles = MockProfileStore.getAll();
      if (profiles.length > 0) {
        const { error } = await supabase.from('profiles').upsert(profiles);
        if (error) errors.push(`Profiles sync error: ${error.message}`);
        else counts.profiles = profiles.length;
      }
    } catch (e: any) {
      errors.push(`Profiles exception: ${e.message}`);
    }

    // 2. Sync Products & Variants
    try {
      const products = MockProductStore.getAll();
      for (const p of products) {
        const { variants, brand, category, images, ...tablePayload } = p;
        const { error } = await supabase.from('products').upsert(tablePayload);
        if (!error) {
          counts.products++;
          if (variants && variants.length > 0) {
            await supabase.from('product_variants').upsert(
              variants.map((v) => ({ ...v, product_id: p.id }))
            );
          }
        }
      }
    } catch (e: any) {
      errors.push(`Products exception: ${e.message}`);
    }

    // 3. Sync Events
    try {
      const events = MockEventStore.getAll();
      if (events.length > 0) {
        const { error } = await supabase.from('events').upsert(events);
        if (error) errors.push(`Events sync error: ${error.message}`);
        else counts.events = events.length;
      }
    } catch (e: any) {
      errors.push(`Events exception: ${e.message}`);
    }

    // 4. Sync Orders
    try {
      const orders = MockOrderStore.getAll();
      for (const o of orders) {
        const { items, ...orderData } = o;
        const { error } = await supabase.from('orders').upsert(orderData);
        if (!error) {
          counts.orders++;
          if (items && items.length > 0) {
            await supabase.from('order_items').upsert(
              items.map((it) => ({ ...it, order_id: o.id }))
            );
          }
        }
      }
    } catch (e: any) {
      errors.push(`Orders exception: ${e.message}`);
    }

    return {
      success: errors.length === 0,
      syncedCounts: counts,
      errors,
    };
  },

  async syncAllFromSupabase(): Promise<{
    success: boolean;
    pulledCounts: { products: number; profiles: number; events: number };
    errors: string[];
  }> {
    const errors: string[] = [];
    const counts = { products: 0, profiles: 0, events: 0 };

    if (!isSupabaseConfigured) {
      return {
        success: false,
        pulledCounts: counts,
        errors: ['Supabase Anon Key가 설정되지 않았습니다.'],
      };
    }

    try {
      // Pull products
      const { data: prods } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)');
      if (prods && prods.length > 0) {
        for (const p of prods) {
          MockProductStore.save(p as Product);
        }
        counts.products = prods.length;
      }

      // Pull profiles
      const { data: profs } = await supabase.from('profiles').select('*');
      if (profs && profs.length > 0) {
        for (const p of profs) {
          MockProfileStore.updateProfile(p as Profile);
        }
        counts.profiles = profs.length;
      }

      // Pull events
      const { data: evts } = await supabase.from('events').select('*');
      if (evts && evts.length > 0) {
        for (const e of evts) {
          MockEventStore.save(e as EventItem);
        }
        counts.events = evts.length;
      }
    } catch (e: any) {
      errors.push(`Pull exception: ${e.message}`);
    }

    return {
      success: errors.length === 0,
      pulledCounts: counts,
      errors,
    };
  },
};
