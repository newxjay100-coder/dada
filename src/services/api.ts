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
  MockMaterialStore,
  MockPurchaseOrderStore,
  MockDeliveryStore,
  MockTaxDocumentStore,
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
  Material,
  PurchaseOrder,
  Shipment,
  TaxDocument,
} from '@/types/database.types';
import { uploadStaticImageToStorage } from './imageUploadService';

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
  // 7. DELIVERIES (배송 및 운송장 관리)
  // ==========================================
  async getDeliveries(): Promise<Shipment[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('deliveries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Shipment[];
      } catch (e) {
        console.warn('Supabase getDeliveries failed:', e);
      }
    }
    return MockDeliveryStore.getAll();
  },

  async saveDelivery(delivery: Shipment): Promise<Shipment> {
    MockDeliveryStore.save(delivery);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('deliveries').upsert(delivery);
        if (error) console.warn('Supabase saveDelivery error:', error);
      } catch (e) {
        console.warn('Supabase saveDelivery exception:', e);
      }
    }
    return delivery;
  },

  async updateDeliveryTracking(
    id: string,
    trackingNumber: string,
    status: Shipment['shipment_status'] = 'shipping'
  ): Promise<Shipment | undefined> {
    const updated = MockDeliveryStore.updateTracking(id, trackingNumber, status);
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('deliveries')
          .update({
            tracking_number: trackingNumber,
            shipment_status: status,
            shipped_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase updateDeliveryTracking exception:', e);
      }
    }
    return updated;
  },

  async deleteDelivery(id: string): Promise<boolean> {
    MockDeliveryStore.delete(id);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('deliveries').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteDelivery exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 8. MATERIALS (원부자재 관리)
  // ==========================================
  async getMaterials(): Promise<Material[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Material[];
      } catch (e) {
        console.warn('Supabase getMaterials failed:', e);
      }
    }
    return MockMaterialStore.getAll();
  },

  async saveMaterial(material: Material): Promise<Material> {
    MockMaterialStore.save(material);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('materials').upsert(material);
        if (error) console.warn('Supabase saveMaterial error:', error);
      } catch (e) {
        console.warn('Supabase saveMaterial exception:', e);
      }
    }
    return material;
  },

  async deleteMaterial(id: string): Promise<boolean> {
    MockMaterialStore.delete(id);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('materials').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteMaterial exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 9. PURCHASE ORDERS (발주 관리 PO)
  // ==========================================
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as PurchaseOrder[];
      } catch (e) {
        console.warn('Supabase getPurchaseOrders failed:', e);
      }
    }
    return MockPurchaseOrderStore.getAll();
  },

  async savePurchaseOrder(po: PurchaseOrder): Promise<PurchaseOrder> {
    MockPurchaseOrderStore.save(po);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('purchase_orders').upsert(po);
        if (error) console.warn('Supabase savePurchaseOrder error:', error);
      } catch (e) {
        console.warn('Supabase savePurchaseOrder exception:', e);
      }
    }
    return po;
  },

  async updatePOStatus(
    id: string,
    status: PurchaseOrder['status']
  ): Promise<PurchaseOrder | undefined> {
    const updated = MockPurchaseOrderStore.updateStatus(id, status);
    if (isSupabaseConfigured) {
      try {
        const updatePayload: any = { status };
        if (status === 'completed') {
          updatePayload.received_date = new Date().toISOString().split('T')[0];
        }
        await supabase.from('purchase_orders').update(updatePayload).eq('id', id);
      } catch (e) {
        console.warn('Supabase updatePOStatus exception:', e);
      }
    }
    return updated;
  },

  async deletePurchaseOrder(id: string): Promise<boolean> {
    MockPurchaseOrderStore.delete(id);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('purchase_orders').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deletePurchaseOrder exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 10. TAX DOCUMENTS (세금계산서 & 영수증)
  // ==========================================
  async getTaxDocuments(): Promise<TaxDocument[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tax_documents')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as TaxDocument[];
      } catch (e) {
        console.warn('Supabase getTaxDocuments failed:', e);
      }
    }
    return MockTaxDocumentStore.getAll();
  },

  async saveTaxDocument(doc: TaxDocument): Promise<TaxDocument> {
    MockTaxDocumentStore.save(doc);
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('tax_documents').upsert(doc);
        if (error) console.warn('Supabase saveTaxDocument error:', error);
      } catch (e) {
        console.warn('Supabase saveTaxDocument exception:', e);
      }
    }
    return doc;
  },

  async updateTaxDocumentStatus(
    id: string,
    status: TaxDocument['issue_status']
  ): Promise<TaxDocument | undefined> {
    const updated = MockTaxDocumentStore.updateStatus(id, status);
    if (isSupabaseConfigured) {
      try {
        const payload: any = { issue_status: status };
        if (status === 'issued') {
          payload.issue_date = new Date().toISOString().split('T')[0];
        }
        await supabase.from('tax_documents').update(payload).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateTaxDocumentStatus exception:', e);
      }
    }
    return updated;
  },

  async deleteTaxDocument(id: string): Promise<boolean> {
    MockTaxDocumentStore.delete(id);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tax_documents').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteTaxDocument exception:', e);
      }
    }
    return true;
  },

  // ==========================================
  // 11. ATTACHED PRODUCT & STORAGE UPLOAD
  // ==========================================
  async syncAttachedProductAndStorage(): Promise<{
    success: boolean;
    storageUrl?: string;
    product?: Product;
    error?: string;
  }> {
    try {
      // 1. Upload local image to Supabase Storage 'products' bucket
      const uploadResult = await uploadStaticImageToStorage(
        '/images/products/cyber_street_2077_grand_opening.jpg',
        'cyber_street_2077_grand_opening.jpg',
        'products'
      );

      // 2. Fetch the cyber 2077 product from mock store
      const cyberProduct = MockProductStore.getById('prod-cyber-2077');
      if (cyberProduct) {
        if (uploadResult.url) {
          cyberProduct.primary_image = uploadResult.url;
        }
        await this.saveProduct(cyberProduct);
      }

      // 3. Also update event banner with new storage URL
      const cyberEvent = MockEventStore.getAll().find((e) => e.id === 'ev-cyber-2077');
      if (cyberEvent) {
        if (uploadResult.url) {
          cyberEvent.banner_image_url = uploadResult.url;
        }
        await this.saveEvent(cyberEvent);
      }

      return {
        success: true,
        storageUrl: uploadResult.url,
        product: cyberProduct,
      };
    } catch (e: any) {
      console.warn('syncAttachedProductAndStorage failed:', e);
      return { success: false, error: e.message };
    }
  },

  // ==========================================
  // 12. BATCH CLOUD SYNC (Supabase 전체 동기화)
  // ==========================================
  async syncAllToSupabase(): Promise<{
    success: boolean;
    syncedCounts: {
      products: number;
      profiles: number;
      events: number;
      orders: number;
      deliveries: number;
      materials: number;
      purchaseOrders: number;
      taxDocuments: number;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    const counts = {
      products: 0,
      profiles: 0,
      events: 0,
      orders: 0,
      deliveries: 0,
      materials: 0,
      purchaseOrders: 0,
      taxDocuments: 0,
    };

    if (!isSupabaseConfigured) {
      return {
        success: false,
        syncedCounts: counts,
        errors: ['Supabase Project URL 및 Anon Key가 설정되지 않았습니다.'],
      };
    }

    // 1. Sync Profiles
    try {
      const profiles = MockProfileStore.getAll();
      if (profiles.length > 0) {
        const { error } = await supabase.from('profiles').upsert(profiles);
        if (error) errors.push(`Profiles: ${error.message}`);
        else counts.profiles = profiles.length;
      }
    } catch (e: any) {
      errors.push(`Profiles: ${e.message}`);
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
      errors.push(`Products: ${e.message}`);
    }

    // 3. Sync Events
    try {
      const events = MockEventStore.getAll();
      if (events.length > 0) {
        const { error } = await supabase.from('events').upsert(events);
        if (error) errors.push(`Events: ${error.message}`);
        else counts.events = events.length;
      }
    } catch (e: any) {
      errors.push(`Events: ${e.message}`);
    }

    // 4. Sync Orders & Order Items
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
      errors.push(`Orders: ${e.message}`);
    }

    // 5. Sync Deliveries
    try {
      const deliveries = MockDeliveryStore.getAll();
      if (deliveries.length > 0) {
        const { error } = await supabase.from('deliveries').upsert(deliveries);
        if (error) errors.push(`Deliveries: ${error.message}`);
        else counts.deliveries = deliveries.length;
      }
    } catch (e: any) {
      errors.push(`Deliveries: ${e.message}`);
    }

    // 6. Sync Materials
    try {
      const materials = MockMaterialStore.getAll();
      if (materials.length > 0) {
        const { error } = await supabase.from('materials').upsert(materials);
        if (error) errors.push(`Materials: ${error.message}`);
        else counts.materials = materials.length;
      }
    } catch (e: any) {
      errors.push(`Materials: ${e.message}`);
    }

    // 7. Sync Purchase Orders
    try {
      const poList = MockPurchaseOrderStore.getAll();
      if (poList.length > 0) {
        const { error } = await supabase.from('purchase_orders').upsert(poList);
        if (error) errors.push(`PurchaseOrders: ${error.message}`);
        else counts.purchaseOrders = poList.length;
      }
    } catch (e: any) {
      errors.push(`PurchaseOrders: ${e.message}`);
    }

    // 8. Sync Tax Documents
    try {
      const taxDocs = MockTaxDocumentStore.getAll();
      if (taxDocs.length > 0) {
        const { error } = await supabase.from('tax_documents').upsert(taxDocs);
        if (error) errors.push(`TaxDocuments: ${error.message}`);
        else counts.taxDocuments = taxDocs.length;
      }
    } catch (e: any) {
      errors.push(`TaxDocuments: ${e.message}`);
    }

    return {
      success: errors.length === 0,
      syncedCounts: counts,
      errors,
    };
  },

  async syncAllFromSupabase(): Promise<{
    success: boolean;
    pulledCounts: {
      products: number;
      profiles: number;
      events: number;
      orders: number;
      deliveries: number;
      materials: number;
      purchaseOrders: number;
      taxDocuments: number;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    const counts = {
      products: 0,
      profiles: 0,
      events: 0,
      orders: 0,
      deliveries: 0,
      materials: 0,
      purchaseOrders: 0,
      taxDocuments: 0,
    };

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

      // Pull orders
      const { data: ords } = await supabase.from('orders').select('*, items:order_items(*)');
      if (ords && ords.length > 0) {
        for (const o of ords) {
          MockOrderStore.save(o as Order);
        }
        counts.orders = ords.length;
      }

      // Pull deliveries
      const { data: dels } = await supabase.from('deliveries').select('*');
      if (dels && dels.length > 0) {
        for (const d of dels) {
          MockDeliveryStore.save(d as Shipment);
        }
        counts.deliveries = dels.length;
      }

      // Pull materials
      const { data: mats } = await supabase.from('materials').select('*');
      if (mats && mats.length > 0) {
        for (const m of mats) {
          MockMaterialStore.save(m as Material);
        }
        counts.materials = mats.length;
      }

      // Pull purchase orders
      const { data: pos } = await supabase.from('purchase_orders').select('*');
      if (pos && pos.length > 0) {
        for (const p of pos) {
          MockPurchaseOrderStore.save(p as PurchaseOrder);
        }
        counts.purchaseOrders = pos.length;
      }

      // Pull tax documents
      const { data: taxes } = await supabase.from('tax_documents').select('*');
      if (taxes && taxes.length > 0) {
        for (const t of taxes) {
          MockTaxDocumentStore.save(t as TaxDocument);
        }
        counts.taxDocuments = taxes.length;
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

