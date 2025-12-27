import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { PaymentPersistenceEntity } from '../entities/payment-persistence.entity';
import { PaymentMapper } from '../mappers/payment.mapper';
import { Payment } from '../../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../../domain/repositories/payment-repository.interface';
import { BadRequestException } from '@nestjs/common';
import type { IPaginatedResult } from '@/modules/shared/domain/types/domain-repository.type';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentPersistenceEntity)
    private readonly repository: Repository<PaymentPersistenceEntity>,
    private readonly mapper: PaymentMapper,
  ) {}

  async save(entity: Payment): Promise<Payment> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.repository.save(persistence);
    return this.mapper.toDomain(saved);
  }

  async saveMany(entities: Payment[]): Promise<Payment[]> {
    const persistenceEntities = this.mapper.toPersistenceMany(entities);
    const saved = await this.repository.save(persistenceEntities);
    return this.mapper.toDomainMany(saved);
  }

  async findOne(criteria: { id?: string }): Promise<Payment | null> {
    if (!criteria.id) {
      return null;
    }
    const entity = await this.repository.findOne({
      where: { id: criteria.id } as FindOptionsWhere<PaymentPersistenceEntity>,
    });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async find(_criteria?: { offset?: number; limit?: number }): Promise<Payment[]> {
    const entities = await this.repository.find({
      withDeleted: true,
    });
    return this.mapper.toDomainMany(entities);
  }

  async findWithPagination(
    criteria: { page?: number; limit?: number } = {},
  ): Promise<IPaginatedResult<Payment>> {
    const { page = 1, limit = 10 } = criteria;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive numbers');
    }

    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: this.mapper.toDomainMany(entities),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const result = await this.repository.softDelete({ id: In(ids) } as FindOptionsWhere<PaymentPersistenceEntity>);
    return result.affected || 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<PaymentPersistenceEntity>,
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
