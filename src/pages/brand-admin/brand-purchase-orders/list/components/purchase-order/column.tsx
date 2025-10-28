// src/pages/internal-purchase-orders/list/components/column.tsx

import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TStorePurchaseOrder } from "@/schema/internal-purchase-orders.schema";
import {
  getStorePurchaseOrderStatusLabel2,
  type TStorePurchaseOrderStatusEnum,
} from "@/types/enums/store-purchase-order-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TStorePurchaseOrder>[] = [
  {
    accessorKey: "index",
    header: ({ column }) =>
      createFormattedHeader("STT", column, { align: "center" }),
    cell: (info) => {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return createFormattedCell(
        <div>{row.index + currentPage * currentSize + 1}</div>,
        { align: "center" }
      );
    },
  },
  {
    accessorFn: (row) => row.store?.name ?? "-",
    id: "storeName",
    header: ({ column }) =>
      createFormattedHeader("Cửa hàng", column, {
        align: "left",
        sortable: true,
      }),
    cell: (info) => {
      const storeName = info.getValue() as string;
      return createFormattedCell(<div>{storeName}</div>, {
        align: "left",
        truncate: true,
        tooltip: storeName,
      });
    },
    size: 200,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) =>
      createFormattedHeader("Ngày tạo", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const date = info.getValue() as string;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {date
            ? formatDate(date) == formatDate(new Date().toString())
              ? "Hôm nay"
              : formatDate(date)
            : "-"}
        </span>,
        {
          align: "center",
        }
      );
    },
    size: 150,
  },
  {
    accessorKey: "estimatedTotalValue",
    header: ({ column }) =>
      createFormattedHeader("Tạm tính", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const value = info.getValue() as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            {formatPrice(value)}
          </span>
        </div>,
        {
          align: "center",
          truncate: true,
          tooltip: `Giá bán: ${formatPrice(value)}₫`,
        }
      );
    },
    size: 180,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const status = info.getValue() as TStorePurchaseOrderStatusEnum;
      const statusAttribute = getStorePurchaseOrderStatusLabel2(status);
      const label = statusAttribute.label;
      const className = statusAttribute.className;
      return createFormattedCell(
        <div className="text-right">
          <span
            className={`inline-flex items-center justify-end font-semibold text-sm px-2 py-1 rounded-md ${className}`}
          >
            {label}
          </span>
        </div>,
        {
          align: "center",
          truncate: true,
          tooltip: label,
        }
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Thao tác", column, { align: "center" }),
    cell: ({ row }) => {
      const po = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={PATH_BRAND_DASHBOARD.internalPurchaseOrders.detail(po.id)}
                >
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">Xem chi tiết</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80,
  },
];
