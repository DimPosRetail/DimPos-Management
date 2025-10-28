export const OrderStatusEnum = {
  PendingPayment: 0,
  Confirmed: 1,
  ReadyForPickup: 2,
  Completed: 3,
  Cancelled: 4,
} as const;
export type TOrderStatusEnum = typeof OrderStatusEnum[keyof typeof OrderStatusEnum];
// export function getOrderStatusLabel(status: TOrderStatusEnum): {
//   label: string;
//   colorClassName: string;
//   backgroundColorName: string;
// } {
//   switch (status) {
//     case OrderStatusEnum.PendingPayment:
//       return {
//         label: 'Đang trả',
//         colorClassName: "text-cempedak-100",
//         backgroundColorName: "bg-cempedak-10",
//       };
//     case OrderStatusEnum.Confirmed:
//       return {
//         label: 'Đã xác nhận',
//         colorClassName: "text-blueberry-100",
//         backgroundColorName: "bg-blueberry-10",
//       };
//     case OrderStatusEnum.ReadyForPickup:
//       return {
//         label: 'Đã chuẩn bị',
//         colorClassName: "text-teal-100",
//         backgroundColorName: "bg-teal-10",
//       };
//     case OrderStatusEnum.Completed:
//       return {
//         label: 'Hoàn thành',
//         colorClassName: "text-emerald-100",
//         backgroundColorName: "bg-emerald-10",
//       };
//     case OrderStatusEnum.Cancelled:
//       return {
//         label: 'Hủy',
//         colorClassName: "text-rambutant-100",
//         backgroundColorName: "bg-rambutant-10",
//       };
//     default:
//       return {
//         label: 'Không xác định',
//         colorClassName: "text-neutral-100",
//         backgroundColorName: "bg-neutral-10",
//       };
//   }
// }

export function getOrderStatusLabel2(status: TOrderStatusEnum): {
  label: string;
  className: string;
} {
  switch (status) {
    case OrderStatusEnum.PendingPayment:
      return {
        label: 'Đang trả',
        className: "text-cempedak-100 bg-cempedak-10 border border-cempedak-100",
      };
    case OrderStatusEnum.Confirmed:
      return {
        label: 'Đã xác nhận',
        className: "text-blueberry-100 bg-blueberry-10 border border-blueberry-100",
      };
    case OrderStatusEnum.ReadyForPickup:
      return {
        label: 'Đã chuẩn bị',
        className: "text-teal-100 bg-teal-10 border border-teal-100",
      };
    case OrderStatusEnum.Completed:
      return {
        label: 'Hoàn thành',
        className: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      };
    case OrderStatusEnum.Cancelled:
      return {
        label: 'Hủy',
        className: "text-rambutant-100 bg-rambutant-10 border border-rambutant-100",
      };
    default:
      return {
        label: 'Không xác định',
        className: "text-neutral-100 bg-neutral-10 border border-neutral-100",
      };
  }
}