import type { IBaseRepository } from '@/modules/shared/domain/types/domain-repository.type';
import type { Payment } from '../entities/payment.entity';

// Token for dependency injection
export const PAYMENT_REPOSITORY_TOKEN = Symbol('PAYMENT_REPOSITORY_TOKEN');

// Type alias for convenience
export type IPaymentRepository = IBaseRepository<Payment, any>;
