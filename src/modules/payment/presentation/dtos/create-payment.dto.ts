import { IsNumber, IsString, IsISO4217CurrencyCode, IsOptional, IsObject, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsISO4217CurrencyCode()
  currency: string;

  @IsString()
  customerId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
