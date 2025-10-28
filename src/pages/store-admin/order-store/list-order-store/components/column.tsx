import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TStoreOrderResponse } from "@/schema/order.schema";
import {
  getOrderStatusLabel2,
  type TOrderStatusEnum,
} from "@/types/enums/order-status.enum";
import {
  getOrderTypeLabel,
  type TOrderTypeEnum,
} from "@/types/enums/order-type.enum";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
export const storeOrderColumns = (): ColumnDef<TStoreOrderResponse>[] => [
  {
    accessorKey: "index",
    header: ({ column }) =>
      createFormattedHeader("STT", column, { align: "center" }),
    cell: ({ row, table }) => {
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return createFormattedCell(
        <div>{row.index + 1 + currentPage * currentSize}</div>,
        {
          align: "center",
          tooltip: `STT: ${row.index + 1 + currentPage * currentSize}`,
        }
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      createFormattedHeader("Loại đơn hàng", column, { align: "center" }),
    cell: (info) => {
      const type = info.getValue() as TOrderTypeEnum;
      const label = getOrderTypeLabel(type);
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {label}
        </span>,
        {
          align: "center",
          tooltip: `Loại đơn hàng: ${label}`,
        }
      );
    },
    size: 120,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) =>
      createFormattedHeader("Ngày tạo", column, { align: "center" }),
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {format(date, "dd/MM/yyyy HH:mm", { locale: vi })}
        </span>,
        {
          align: "center",
        }
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) =>
      createFormattedHeader("Tổng tiền", column, { align: "center" }),
    cell: (info) => {
      const total = info.getValue() as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            {formatPrice(total)}
          </span>
        </div>,
        {
          align: "center",
          truncate: true,
          tooltip: `Giá bán: ${formatPrice(total)}`,
        }
      );
    },
    size: 180,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: (info) => {
      const status = info.getValue() as TOrderStatusEnum;
      const { label, className } = getOrderStatusLabel2(status);
      return createFormattedCell(
        <div className="text-right">
          <span className={`inline-flex items-center justify-end font-semibold text-sm px-2 py-1 rounded-md ${className}`}>
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
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_STORE_DASHBOARD.order.detail(order.id)}>
                <TooltipTrigger>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">Xem chi tiết</div>
                </TooltipContent>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80,
  },
];
