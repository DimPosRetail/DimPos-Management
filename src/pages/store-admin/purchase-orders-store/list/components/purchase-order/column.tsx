import { SortableHeader } from "@/components/table/sortable-header";
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
import { PATH_STORE_DASHBOARD } from "@/routes/path";
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
    header: ({ column }) => createFormattedHeader("STT", column),
    cell: (info) => {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return createFormattedCell(
        <span>{row.index + currentPage * currentSize + 1}</span>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => createFormattedHeader("Ngày tạo", column),
    cell: (info) => {
      const date = info.getValue() as string;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {date ? formatDate(date) : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "completedAt",
    header: ({ column }) => createFormattedHeader("Ngày hoàn thành", column),
    cell: (info) => {
      const date = info.getValue() as string | null;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {date ? formatDate(date) : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => createFormattedHeader("Trạng thái", column),
    cell: (info) => {
      const status = info.getValue() as TStorePurchaseOrderStatusEnum;
      const statusAttribute = getStorePurchaseOrderStatusLabel2(status);
      const label = statusAttribute.label;
      const className = statusAttribute.className;
      return createFormattedCell(
        <span
          className={`inline-flex items-center justify-end font-semibold text-sm px-2 py-1 rounded-md ${className}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "estimatedTotalValue",
    header: ({ column }) => (
      <SortableHeader column={column}>Giá trị đơn hàng</SortableHeader>
    ),
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
  // {
  //   id: "note",
  //   header: ({ column }) => createFormattedHeader("Ghi chú", column),
  //   cell: ({ row }) => {
  //     const noteFromBrand = row.original.noteFromBrand;
  //     const noteFromStore = row.original.noteFromStore;
  //     const finalNote = noteFromBrand || noteFromStore || "";

  //     return (
  //       <div className="flex justify-center">
  //         <TooltipProvider>
  //           <Tooltip>
  //             <TooltipTrigger asChild>
  //               <div className="max-w-[200px] truncate text-center cursor-default">
  //                 {finalNote}
  //               </div>
  //             </TooltipTrigger>
  //             <TooltipContent side="top">
  //               <div className="max-w-xs whitespace-pre-wrap">{finalNote}</div>
  //             </TooltipContent>
  //           </Tooltip>
  //         </TooltipProvider>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    header: ({ column }) => createFormattedHeader("Thao tác", column),
    cell: ({ row }) => {
      const po = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={PATH_STORE_DASHBOARD.purchaseRequest.detail(po.id)}>
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
