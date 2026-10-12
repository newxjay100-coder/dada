// Payment Provider Adapter Architecture

export type PaymentMethod = 'credit_card' | 'easy_pay' | 'transfer' | 'vbank';

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  orderName: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: PaymentMethod;
  easyPayProvider?: 'kakaopay' | 'tosspay' | 'naverpay';
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
}

export interface PaymentAdapter {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  cancelPayment(paymentKey: string, reason: string): Promise<boolean>;
}

// Development / Mock Payment Adapter (Production-ready flow emulation)
export class MockPaymentAdapter implements PaymentAdapter {
  name = 'DASSOBA Dev Test PG';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Emulate PG network latency and security handshake
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return successful payment receipt
    const timestamp = new Date().toISOString();
    const paymentKey = `PAY_DEV_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      success: true,
      paymentKey,
      orderId: request.orderId,
      amount: request.amount,
      method: request.paymentMethod,
      paidAt: timestamp,
      receiptUrl: `https://receipt.dassoba.kr/view/${paymentKey}`,
    };
  }

  async cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`[Dev PG] Payment cancelled: ${paymentKey}, Reason: ${reason}`);
    return true;
  }
}

// Active Adapter Factory (Easily switchable to TossPayments / PortOne / KG Inicis)
let currentAdapter: PaymentAdapter = new MockPaymentAdapter();

export function setPaymentAdapter(adapter: PaymentAdapter) {
  currentAdapter = adapter;
}

export function getPaymentAdapter(): PaymentAdapter {
  return currentAdapter;
}
