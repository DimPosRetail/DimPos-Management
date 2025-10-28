import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";

export const columns: ColumnDef<TStorePurchaseOrderItem>[] = [
  {
    accessorKey: "index",
    header: () => (
      <div className="text-center font-semibold text-sm ">STT</div>
    ),
    cell: (info) => {
      const { pageIndex, pageSize } = info.table.getState().pagination;
      return (
        <div className="text-center text-sm">
          {info.row.index + pageIndex * pageSize + 1}
        </div>
      );
    },
  },
  {
    accessorKey: "productVariantNameSnapshot",
    header: () => (
      <div className="text-left font-semibold text-base">Sản phẩm</div>
    ),
    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <div className="text-left text-sm whitespace-nowrap truncate ">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "requestedQuantity",
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng yêu cầu</div>
    ),
    cell: (info) => {
      const qty = info.getValue() as number;
      return <div className="text-center text-sm">{qty}</div>;
    },
  },
  {
    accessorKey: "approvedQuantityByBrand",
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng được duyệt</div>
    ),
    cell: (info) => {
      const qty = info.getValue() as number | null;
      return (
        <div className="text-center text-sm text-muted-foreground">
          {qty === null ? "Chưa duyệt" : qty}
        </div>
      );
    },
  },
  {
    accessorKey: "productVariantPriceSnapshot",
    header: () => (
      <div className="text-center font-semibold text-base">Đơn giá</div>
    ),
    cell: (info) => {
      const price = info.getValue() as number;
      return (
        <div className="text-center text-sm whitespace-nowrap text-blue-700 font-medium">
          {formatCurrency(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPriceOfOrderItems",
    header: () => (
      <div className="text-center font-semibold text-base">
        Thành tiền dự kiến
      </div>
    ),
    cell: (info) => {
      const total = info.getValue() as number;
      return (
        <div className="text-center text-sm font-semibold text-green-700 whitespace-nowrap">
          {formatCurrency(total)}
        </div>
      );
    },
  },
];
