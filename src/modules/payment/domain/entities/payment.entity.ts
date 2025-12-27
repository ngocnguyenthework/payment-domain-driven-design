import { BaseEntity } from '@/modules/shared/domain/base/domain-entity.base';
import { Money } from '../value-objects/money.vo';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMetadata } from '../value-objects/payment-metadata.vo';

export interface PaymentProps {
  id: string | null;
  amount: Money;
  status: PaymentStatus;
  customerId: string;
  description?: string;
  metadata?: PaymentMetadata;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class Payment extends BaseEntity<PaymentProps> {
  get amount(): Money {
    return this.props.amount;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get metadata(): PaymentMetadata | undefined {
    return this.props.metadata;
  }

  // Domain Logic: Complete payment
  public complete(): void {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new Error('Can only complete pending payments');
    }
    this.props.status = PaymentStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  // Domain Logic: Fail payment
  public fail(): void {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new Error('Can only fail pending payments');
    }
    this.props.status = PaymentStatus.FAILED;
    this.props.updatedAt = new Date();
  }

  // Factory Method: Create new payment
  public static create(data: {
    amount: Money;
    customerId: string;
    description?: string;
    metadata?: PaymentMetadata;
  }): Payment {
    const now = new Date();
    return new Payment({
      id: null,
      amount: data.amount,
      status: PaymentStatus.PENDING,
      customerId: data.customerId,
      description: data.description,
      metadata: data.metadata,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Factory Method: Reconstitute from persistence
  public static load(data: PaymentProps): Payment {
    return new Payment(data);
  }

  // Override to satisfy BaseEntity abstract type
  static create(_props: unknown): unknown {
    throw new Error('Use Payment.create() with proper arguments');
  }

  static load(_props: unknown): unknown {
    throw new Error('Use Payment.load() with proper arguments');
  }
}
