import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/entities/payment.entity';
import { Money } from '../../../domain/value-objects/money.vo';
import { PaymentMetadata } from '../../../domain/value-objects/payment-metadata.vo';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { PaymentPersistenceEntity } from '../entities/payment-persistence.entity';

export interface IMapper<DomainEntity, PersistenceEntity> {
  toDomain(entity: PersistenceEntity): DomainEntity;
  toDomainMany(entities: PersistenceEntity[]): DomainEntity[];
  toPersistence(domain: DomainEntity): PersistenceEntity;
  toPersistenceMany(domains: DomainEntity[]): PersistenceEntity[];
}

@Injectable()
export class PaymentMapper implements IMapper<Payment, PaymentPersistenceEntity> {
  toDomain(entity: PaymentPersistenceEntity): Payment {
    return Payment.load({
      id: entity.id,
      amount: Money.create(Number(entity.amount), entity.currency),
      status: entity.status as PaymentStatus,
      customerId: entity.customerId,
      description: entity.description || undefined,
      metadata: entity.metadata ? PaymentMetadata.create(entity.metadata) : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toDomainMany(entities: PaymentPersistenceEntity[]): Payment[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  toPersistence(domain: Payment): PaymentPersistenceEntity {
    const entity = new PaymentPersistenceEntity();
    entity.id = domain.id as string;
    entity.amount = domain.amount.amount;
    entity.currency = domain.amount.currency;
    entity.status = domain.status;
    entity.customerId = domain.customerId;
    entity.description = domain.description || null;
    entity.metadata = domain.metadata?.['props'] || null;
    entity.createdAt = domain.createdAt as Date;
    entity.updatedAt = domain.updatedAt as Date;
    return entity;
  }

  toPersistenceMany(domains: Payment[]): PaymentPersistenceEntity[] {
    return domains.map((domain) => this.toPersistence(domain));
  }
}
