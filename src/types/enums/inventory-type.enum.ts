export const InventoryTransactionTypeEnum = {
    ReceiptFromInternalPo : 0,
    ConsumptionSale : 1,
    ManualAdjustment : 2,
} as const;
export type TInventoryTransactionTypeEnum = typeof InventoryTransactionTypeEnum[keyof typeof InventoryTransactionTypeEnum];
export function getInventoryTransactionTypeLabel(status: TInventoryTransactionTypeEnum): {
  label: string;
  className: string;
} {
  switch (status) {
    case InventoryTransactionTypeEnum.ReceiptFromInternalPo:
      return {
        label: 'Đơn hàng nội bộ',
        className: "text-purple-100 bg-purple-10 border border-purple-100",
      };
    case InventoryTransactionTypeEnum.ConsumptionSale:
      return {
        label: 'Tiêu thụ/Bán hàng',
        className: "text-blueberry-100 bg-blueberry-10 border border-blueberry-100",
      };
    case InventoryTransactionTypeEnum.ManualAdjustment:
      return {
        label: 'Cập nhập thủ công',
        className: "text-rambutant-100 bg-rambutant-10 border border-rambutant-100  ",
      };
    default:
      return {
        label: 'Không xác định',
        className: "text-neutral-100 bg-neutral-10 border border-neutral-100",
      };
  }
}