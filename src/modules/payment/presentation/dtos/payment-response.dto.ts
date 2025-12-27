export class PaymentResponseDto {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerId: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
