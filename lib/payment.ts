// Mock payment service implementation
// In a real application, you would integrate with a payment provider like Stripe, PayPal, etc.

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  description: string;
  workType: 'coursework' | 'report';
  topic: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
  amount: number;
}

export class PaymentService {
  // Mock pricing for different work types
  static readonly PRICING = {
    coursework: 500, // 500 rubles for coursework
    report: 300,     // 300 rubles for report
  };

  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // In a real implementation, you would:
    // 1. Verify user has sufficient balance or valid payment method
    // 2. Process the payment through a payment gateway
    // 3. Record the transaction
    
    console.log(`Processing payment for ${request.workType} on topic: ${request.topic}`);
    console.log(`Amount: ${request.amount} ${request.currency}`);
    
    // Mock payment processing - always succeeds for demo purposes
    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: request.amount,
    };
  }

  static calculatePrice(workType: 'coursework' | 'report', pages?: number): number {
    const basePrice = this.PRICING[workType];
    const pageCount = pages || (workType === 'coursework' ? 10 : 8); // default pages
    // Price increases with page count (optional)
    return basePrice; // For now, fixed price
  }
}