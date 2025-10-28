export const StorePurchaseOrderStatusEnum = {
  New: 0,
  BrandConfirmed: 1,
  RejectedByBrand: 2,
  DoneByStore: 3,
  CancelledByStore: 4,
  CancelledByBrand: 5,
  ErrorWhenUpdatingInventory: 6,
} as const;

export type TStorePurchaseOrderStatusEnum =
  (typeof StorePurchaseOrderStatusEnum)[keyof typeof StorePurchaseOrderStatusEnum];
// export function getStorePurchaseOrderStatusLabel(
//   status: TStorePurchaseOrderStatusEnum
// ): {
//   label: string;
//   colorClassName: string;
//   backgroundColorName: string;
// } {
//   switch (status) {
//     case StorePurchaseOrderStatusEnum.New:
//       return {
//         label: "Mới",
//         colorClassName: "text-neutral-100",
//         backgroundColorName: "bg-neutral-10",
//       };
//     case StorePurchaseOrderStatusEnum.BrandConfirmed:
//       return {
//         label: "Đã xác nhận",
//         colorClassName: "text-blueberry-100",
//         backgroundColorName: "bg-blueberry-10",
//       };
//     case StorePurchaseOrderStatusEnum.RejectedByBrand:
//       return {
//         label: "Bị từ chối",
//         colorClassName: "text-rambutant-100",
//         backgroundColorName: "bg-rambutant-10",
//       };
//     case StorePurchaseOrderStatusEnum.DoneByStore:
//       return {
//         label: "Đã nhận",
//         colorClassName: "text-emerald-100",
//         backgroundColorName: "bg-emerald-10",
//       };
//     case StorePurchaseOrderStatusEnum.CancelledByStore:
//       return {
//         label: "Hủy bởi cửa hàng",
//         colorClassName: "text-cempedak-100",
//         backgroundColorName: "bg-cempedak-10",
//       };
//     case StorePurchaseOrderStatusEnum.CancelledByBrand:
//       return {
//         label: "Hủy sau xác nhận",
//         colorClassName: "text-orange-100",
//         backgroundColorName: "bg-orange-10",
//       };
//     case StorePurchaseOrderStatusEnum.ErrorWhenUpdatingInventory:
//       return {
//         label: "Lỗi khi cập nhật tồn kho",
//         colorClassName: "text-red-100",
//         backgroundColorName: "bg-red-10",
//       };
//     default:
//       return {
//         label: "Không xác định",
//         colorClassName: "text-neutral-100",
//         backgroundColorName: "bg-neutral-10",
//       };
//   }
// }

export function getStorePurchaseOrderStatusLabel2(
  status: TStorePurchaseOrderStatusEnum
): {
  label: string;
  className: string;
} {
  switch (status) {
    case StorePurchaseOrderStatusEnum.New:
      return {
        label: "Mới",
        className: "text-neutral-100 bg-neutral-10 border border-neutral-100",
      };
    case StorePurchaseOrderStatusEnum.BrandConfirmed:
      return {
        label: "Đã xác nhận",
        className: "text-blueberry-100 bg-blueberry-10 border border-blueberry-100",
      };
    case StorePurchaseOrderStatusEnum.RejectedByBrand:
      return {
        label: "Bị từ chối",
        className: "text-rambutant-100 bg-rambutant-10 border border-rambutant-100",
      };
    case StorePurchaseOrderStatusEnum.DoneByStore:
      return {
        label: "Đã nhận",
        className: "text-emerald-600 bg-emerald-50 border border-emerald-200",
      };
    case StorePurchaseOrderStatusEnum.CancelledByStore:
      return {
        label: "Hủy bởi cửa hàng",
        className: "text-cempedak-100 bg-cempedak-10 border border-cempedak-100",
      };
    case StorePurchaseOrderStatusEnum.CancelledByBrand:
      return {
        label: "Hủy sau xác nhận",
        className: "text-orange-100 bg-orange-10 border border-orange-100",
      };
    case StorePurchaseOrderStatusEnum.ErrorWhenUpdatingInventory:
      return {
        label: "Lỗi khi cập nhật tồn kho",
        className: "text-red-100 bg-red-10 border border-red-100",
      };
    default:
      return {
        label: "Không xác định",
        className: "text-neutral-100 bg-neutral-10 border border-neutral-100",
      };
  }
}