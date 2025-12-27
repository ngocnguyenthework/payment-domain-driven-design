import { Injectable } from '@nestjs/common';
import { ResponseMapper } from '@/modules/shared/presentation/base/presentation-mapper.base';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentResponseDto } from '../dtos/payment-response.dto';

@Injectable()
export class PaymentResponseMapper extends ResponseMapper<Payment, PaymentResponseDto> {
  toDto(entity: Payment): PaymentResponseDto {
    return {
      id: entity.id as string,
      amount: entity.amount.amount,
      currency: entity.amount.currency,
      status: entity.status,
      customerId: entity.customerId,
      description: entity.description,
      metadata: entity.metadata?.['props'],
      createdAt: entity.createdAt as Date,
      updatedAt: entity.updatedAt as Date,
    };
  }
}
