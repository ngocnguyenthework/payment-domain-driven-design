import { AggregateRoot as NestAggregateRoot } from '@nestjs/cqrs';
import { Money } from '../value-objects/money.vo';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMetadata } from '../value-objects/payment-metadata.vo';

export class Payment extends NestAggregateRoot {
  private _id: string | null;
  private _amount: Money;
  private _status: PaymentStatus;
  private _customerId: string;
  private _description: string | undefined;
  private _metadata: PaymentMetadata | undefined;
  private _createdAt: Date | null;
  private _updatedAt: Date | null;

  get id(): string | null {
    return this._id;
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get customerId(): string {
    return this._customerId;
  }

  get description(): string | undefined {
    return this._description;
  }

  get metadata(): PaymentMetadata | undefined {
    return this._metadata;
  }

  get createdAt(): Date | null {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  private constructor(data: {
    id: string | null;
    amount: Money;
    status: PaymentStatus;
    customerId: string;
    description?: string;
    metadata?: PaymentMetadata;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    super();
    this._id = data.id;
    this._amount = data.amount;
    this._status = data.status;
    this._customerId = data.customerId;
    this._description = data.description;
    this._metadata = data.metadata;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // Domain Logic: Complete payment
  public complete(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Can only complete pending payments');
    }
    this._status = PaymentStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  // Domain Logic: Fail payment
  public fail(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Can only fail pending payments');
    }
    this._status = PaymentStatus.FAILED;
    this._updatedAt = new Date();
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
  public static load(data: {
    id: string;
    amount: Money;
    status: PaymentStatus;
    customerId: string;
    description?: string;
    metadata?: PaymentMetadata;
    createdAt: Date;
    updatedAt: Date;
  }): Payment {
    return new Payment({
      id: data.id,
      amount: data.amount,
      status: data.status,
      customerId: data.customerId,
      description: data.description,
      metadata: data.metadata,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
