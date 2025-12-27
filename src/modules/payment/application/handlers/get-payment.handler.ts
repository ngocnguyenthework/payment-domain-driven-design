import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetPaymentQuery } from '../queries/get-payment.query';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PAYMENT_REPOSITORY_TOKEN } from '../../domain/repositories/payment-repository.interface';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly repository: any,
  ) {}

  async execute(query: GetPaymentQuery): Promise<Payment> {
    const payment = await this.repository.findOne({ id: query.id });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${query.id} not found`);
    }

    return payment;
  }
}
