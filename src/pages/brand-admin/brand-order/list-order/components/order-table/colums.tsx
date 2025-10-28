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
import { formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TBrandOrder } from "@/schema/order.schema";
import {
  getOrderStatusLabel2,
  type TOrderStatusEnum
} from "@/types/enums/order-status.enum";
import {
  getOrderTypeLabel,
  type TOrderTypeEnum,
} from "@/types/enums/order-type.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TBrandOrder>[] = [
  {
    accessorKey: "index",
    header: () => (
      <div className="flex font-semibold text-base justify-center max-w-[50px]">
        STT
      </div>
    ),
    cell: ({ row, table }) => {
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return (
        <div className="flex items-center gap-2 text-base justify-center  max-w-[50px]">
          {row.index + 1 + currentPage * currentSize}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      createFormattedHeader("Loại đơn hàng", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const orderType = info.getValue() as TOrderTypeEnum;
      const label = getOrderTypeLabel(orderType);
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {label}
        </span>,
        {
          align: "center",
          truncate: true,
          tooltip: label,
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) =>
      createFormattedHeader("Thời gian tạo", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const orderType = info.getValue() as Date;
      // const label = getOrderTypeLabel(orderType);
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {format(orderType, "dd/MM/yyyy, HH:mm", { locale: vi })}
        </span>,
        {
          align: "center",
          maxWidth: "300px",
          truncate: true,
          tooltip: format(orderType, "dd/MM/yyyy, HH:mm", { locale: vi }),
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) =>
      createFormattedHeader("Tổng đơn hàng", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const totalAmount = info.getValue() as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            {formatPrice(totalAmount)}
          </span>
        </div>,
        {
          align: "center",
          truncate: true,
          tooltip: `Giá bán: ${formatPrice(totalAmount)}₫`,
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
      const orderStatus = info.getValue() as TOrderStatusEnum;
      const orderAttribute = getOrderStatusLabel2(orderStatus);
      const label = orderAttribute.label;
      const className = orderAttribute.className;

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
    size: 180,
    //   (
    //     <div className="flex justify-center">
    //       <div
    //         className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-normal ${className}`}
    //       >
    //         {label}
    //       </div>
    //     </div>
    //   );
    // },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao Tác</div>
    ),
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.order.edit(order.id)}>
                <TooltipTrigger>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                  <TooltipContent>
                    <div className="text-sm">Xem chi tiết</div>
                  </TooltipContent>
                </TooltipTrigger>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80, // Fixed width for consistent layout
  },
];
