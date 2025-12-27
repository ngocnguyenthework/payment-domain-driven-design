import type { Id } from '@/modules/shared/domain/types/domain-repository.type';
import type { IPaginatedResult } from '@/modules/shared/domain/types/domain-repository.type';
import { Payment } from '../entities/payment.entity';

// Token for dependency injection
export const PAYMENT_REPOSITORY_TOKEN = Symbol('PAYMENT_REPOSITORY_TOKEN');

// Custom interface for Payment (UUID-based, not using IBaseEntity)
export interface IPaymentRepository {
  save(entity: Payment): Promise<Payment>;
  saveMany(entities: Payment[]): Promise<Payment[]>;

  findOne(criteria: { id?: string }): Promise<Payment | null>;
  find(criteria?: { offset?: number; limit?: number }): Promise<Payment[]>;
  findWithPagination(
    criteria?: { page?: number; limit?: number },
  ): Promise<IPaginatedResult<Payment>>;

  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;

  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}
