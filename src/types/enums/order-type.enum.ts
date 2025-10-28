export const OrderTypeEnum = {
    DineIn : 0,
    TakeAway : 1,
    PreOrderPickup : 2,
} as const;
export type TOrderTypeEnum = typeof OrderTypeEnum[keyof typeof OrderTypeEnum];
export function getOrderTypeLabel(status: TOrderTypeEnum): string {
  switch (status) {
    case OrderTypeEnum.DineIn:
      return 'Ăn tại chỗ';
    case OrderTypeEnum.TakeAway:
      return 'Mang đi';
    case OrderTypeEnum.PreOrderPickup:
      return 'Đặt trước';
    default:
      return 'Không xác định';
  }
}