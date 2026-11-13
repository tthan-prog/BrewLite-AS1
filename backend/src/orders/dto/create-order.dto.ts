import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const ORDER_SIZES = ['S', 'M', 'L'] as const;
/** Mức đường/đá (%) cho phép chọn trên giao diện. */
export const SUGAR_ICE_LEVELS = [0, 30, 50, 70, 100] as const;

export class OrderToppingDto {
  @IsInt()
  @Min(1)
  toppingId!: number;

  @IsInt()
  @Min(1)
  @Max(20)
  quantity!: number;
}

export class OrderItemDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;

  @IsIn(ORDER_SIZES)
  size!: string;

  @IsOptional()
  @IsIn(SUGAR_ICE_LEVELS)
  sugar?: number;

  @IsOptional()
  @IsIn(SUGAR_ICE_LEVELS)
  ice?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => OrderToppingDto)
  toppings?: OrderToppingDto[];
}

export class CreateOrderDto {
  /** Bị bỏ qua khi gọi qua HTTP: controller luôn lấy userId từ JWT. */
  @IsOptional()
  @IsInt()
  userId!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(32)
  promoCode?: string;
}
