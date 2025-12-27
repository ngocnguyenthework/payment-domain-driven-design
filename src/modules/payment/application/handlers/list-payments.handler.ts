import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListPaymentsQuery } from '../queries/list-payments.query';
import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_REPOSITORY_TOKEN } from '../../domain/repositories/payment-repository.interface';

@Injectable()
@QueryHandler(ListPaymentsQuery)
export class ListPaymentsHandler implements IQueryHandler<ListPaymentsQuery> {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly repository: any,
  ) {}

  async execute(query: ListPaymentsQuery) {
    return this.repository.findWithPagination({}, { page: query.page, limit: query.limit });
  }
}
