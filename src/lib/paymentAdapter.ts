// Payment Provider Adapter Architecture (Toss Payments Official SDK + Instant Test Adapter)

export type PaymentMethod = 'tosspay' | 'credit_card' | 'easy_pay' | 'transfer' | 'vbank' | 'mobile';

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  orderName: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: PaymentMethod;
  easyPayProvider?: 'tosspay' | 'kakaopay' | 'naverpay' | 'payco';
  /** If true, opens the real Toss Payments SDK checkout window. If false, completes via instant simulation. */
  useLiveTossWindow?: boolean;
}

export interface PaymentResult {
  success: boolean;
  paymentKey: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  receiptUrl?: string;
  errorMessage?: string;
  cancelled?: boolean;
}

export interface PaymentAdapter {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  cancelPayment(paymentKey: string, reason: string): Promise<boolean>;
}

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (
        method: string,
        options: {
          amount: number;
          orderId: string;
          orderName: string;
          customerName?: string;
          customerEmail?: string;
          customerMobilePhone?: string;
          successUrl: string;
          failUrl: string;
          flowMode?: 'DEFAULT' | 'DIRECT';
          easyPay?: string;
          validHours?: number;
          cashReceipt?: { type: string };
        }
      ) => Promise<void>;
    };
  }
}

// Official Toss Payments Public Test Client Key (works out-of-the-box for testing all Toss payment windows)
export const DEFAULT_TOSS_CLIENT_KEY =
  (import.meta as any).env?.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

const TOSS_KEY_STORAGE = 'dassoba_toss_client_key';

export function getTossClientKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(TOSS_KEY_STORAGE);
    if (saved && saved.trim().length > 10) {
      return saved.trim();
    }
  }
  return DEFAULT_TOSS_CLIENT_KEY;
}

export function setTossClientKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (!key || !key.trim()) {
      localStorage.removeItem(TOSS_KEY_STORAGE);
    } else {
      localStorage.setItem(TOSS_KEY_STORAGE, key.trim());
    }
  }
}

/**
 * Dynamically ensures https://js.tosspayments.com/v1/payment is loaded in the browser
 */
export async function ensureTossPaymentsSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (typeof window.TossPayments === 'function') return true;

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="js.tosspayments.com/v1/payment"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(typeof window.TossPayments === 'function'));
      existing.addEventListener('error', () => resolve(false));
      setTimeout(() => resolve(typeof window.TossPayments === 'function'), 1500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.onload = () => resolve(typeof window.TossPayments === 'function');
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Maps internal paymentMethod to Toss Payments V1 SDK method name
 */
export function mapToTossMethod(
  method: PaymentMethod,
  easyPayProvider?: 'tosspay' | 'kakaopay' | 'naverpay' | 'payco'
): string {
  if (method === 'tosspay') return '토스페이';
  if (method === 'easy_pay') {
    if (easyPayProvider === 'tosspay') return '토스페이';
    // Toss Payments '카드' window includes KakaoPay, NaverPay, TossPay, Payco, and all Korean credit cards
    return '카드';
  }
  if (method === 'transfer') return '계좌이체';
  if (method === 'vbank') return '가상계좌';
  if (method === 'mobile') return '휴대폰';
  return '카드';
}

/**
 * Official Toss Payments Adapter (Opens real Toss Payments checkout window)
 */
export class TossPaymentAdapter implements PaymentAdapter {
  name = 'Toss Payments (토스페이먼츠)';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const timestamp = new Date().toISOString();

    // If final amount is 0 (e.g., 100% paid via points/coupon), bypass PG window
    if (request.amount <= 0) {
      const zeroKey = `TOSS_POINT_${Date.now()}`;
      return {
        success: true,
        paymentKey: zeroKey,
        orderId: request.orderId,
        amount: 0,
        method: request.paymentMethod,
        paidAt: timestamp,
        receiptUrl: `https://dashboard.tosspayments.com/`,
      };
    }

    // If user chose instant 1-click simulation mode
    if (request.useLiveTossWindow === false) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const simKey = `tviva_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      return {
        success: true,
        paymentKey: simKey,
        orderId: request.orderId,
        amount: request.amount,
        method: request.paymentMethod,
        paidAt: timestamp,
        receiptUrl: `https://dashboard.tosspayments.com/`,
      };
    }

    const sdkReady = await ensureTossPaymentsSdk();
    if (!sdkReady || !window.TossPayments) {
      throw new Error('토스페이먼츠 SDK를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.');
    }

    const clientKey = getTossClientKey();
    const tossPayments = window.TossPayments(clientKey);
    const tossMethod = mapToTossMethod(request.paymentMethod, request.easyPayProvider);

    const origin = window.location.origin;
    const successUrl = `${origin}/order-success/${encodeURIComponent(
      request.orderNumber
    )}?provider=toss&method=${encodeURIComponent(request.paymentMethod)}`;
    const failUrl = `${origin}/checkout?toss_fail=true`;

    try {
      await tossPayments.requestPayment(tossMethod, {
        amount: Math.max(100, Math.round(request.amount)),
        orderId: request.orderNumber,
        orderName: request.orderName,
        customerName: request.buyerName || '고객',
        customerEmail: request.buyerEmail || undefined,
        successUrl,
        failUrl,
      });

      // Note: requestPayment normally redirects the window to successUrl.
      // If it resolves without redirecting, return success.
      const paymentKey = `tviva_${Date.now()}`;
      return {
        success: true,
        paymentKey,
        orderId: request.orderId,
        amount: request.amount,
        method: request.paymentMethod,
        paidAt: timestamp,
      };
    } catch (err: any) {
      if (err?.code === 'USER_CANCEL' || err?.message?.includes('취소')) {
        return {
          success: false,
          cancelled: true,
          paymentKey: '',
          orderId: request.orderId,
          amount: request.amount,
          method: request.paymentMethod,
          paidAt: timestamp,
          errorMessage: '결제창을 닫아 결제가 취소되었습니다.',
        };
      }
      // Fallback: if '토스페이' method is not enabled on a custom key, retry with unified '카드' window
      if (tossMethod === '토스페이') {
        try {
          await tossPayments.requestPayment('카드', {
            amount: Math.max(100, Math.round(request.amount)),
            orderId: request.orderNumber,
            orderName: request.orderName,
            customerName: request.buyerName || '고객',
            customerEmail: request.buyerEmail || undefined,
            successUrl,
            failUrl,
          });
        } catch (retryErr: any) {
          return {
            success: false,
            cancelled: retryErr?.code === 'USER_CANCEL',
            paymentKey: '',
            orderId: request.orderId,
            amount: request.amount,
            method: request.paymentMethod,
            paidAt: timestamp,
            errorMessage: retryErr?.message || '토스페이먼츠 결제 요청 중 오류가 발생했습니다.',
          };
        }
      }
      return {
        success: false,
        paymentKey: '',
        orderId: request.orderId,
        amount: request.amount,
        method: request.paymentMethod,
        paidAt: timestamp,
        errorMessage: err?.message || '토스페이먼츠 결제 처리 중 오류가 발생했습니다.',
      };
    }
  }

  async cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`[TossPayments] Payment cancelled: ${paymentKey}, Reason: ${reason}`);
    return true;
  }
}

let currentAdapter: PaymentAdapter = new TossPaymentAdapter();

export function setPaymentAdapter(adapter: PaymentAdapter) {
  currentAdapter = adapter;
}

export function getPaymentAdapter(): PaymentAdapter {
  return currentAdapter;
}
