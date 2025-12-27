import { IQuery } from '@nestjs/cqrs';

export class ListPaymentsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
