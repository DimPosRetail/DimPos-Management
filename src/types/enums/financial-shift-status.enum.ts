export type TFinancialShiftStatusEnum = 0 | 1;

export const getFinancialShiftStatusLabel = (status: TFinancialShiftStatusEnum): { label: string; className: string; } => {
  switch (status) {
    case 0:
      return {
        label: "Ca đang sử dụng",
        className: "text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200",
      };
    case 1:
      return {
        label: "Ca đã đóng",
        className: "text-neutral-100 bg-neutral-10 border border-neutral-50",
      };
    default:
      return {
        label: "Không xác định",
        className: "text-red-700 font-semibold bg-red-100 border border-red-200",
      };
  }
};
