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
import { formatDate, formatTime } from "@/lib/utils";
import { PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TStoreFinancialShift } from "@/schema/financial-shift-configs";
import {
  getFinancialShiftStatusLabel,
  type TFinancialShiftStatusEnum,
} from "@/types/enums/financial-shift-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TStoreFinancialShift>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => createFormattedHeader("STT", column),
    cell: (info) => {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center">
          {row.index + currentPage * currentSize + 1}
        </div>
      );
    },
  },
  {
    accessorKey: "openingTimestamp",
    header: ({ column }) => createFormattedHeader("Ngày hoạt động", column),
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
    id: "openingTime",
    header: ({ column }) => createFormattedHeader("Thời gian mở", column),
    cell: (info) => {
      const value = info.row.original.openingTimestamp;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {value ? formatTime(value) : "-"}
        </span>
      );
    },
  },
  {
    id: "closingTime",
    header: ({ column }) => createFormattedHeader("Thời gian đóng", column),
    cell: (info) => {
      const value = info.row.original.closingTimestamp;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {value ? formatTime(value) : "-"}
        </span>
      );
    },
  },
  {
    id: "openedByAccount",
    header: ({ column }) => createFormattedHeader("Nhân viên mở ca", column),
    cell: (info) => {
      const openedBy = info.row.original.openedByAccount;
      return createFormattedCell(<span>{openedBy?.code ?? "-"}</span>, {
        align: "center",
        truncate: true,
        tooltip: openedBy?.code ?? "-",
      });
    },
    size: 150,
  },
  {
    id: "closedByAccount",
    header: ({ column }) => createFormattedHeader("Nhân viên đóng ca", column),
    cell: (info) => {
      const closedBy = info.row.original.closedByAccount;
      return createFormattedCell(<span>{closedBy?.code ?? "-"}</span>, {
        align: "center",
        truncate: true,
        tooltip: closedBy?.code ?? "-",
      });
    },
    size: 150,
  },
  // {
  //   accessorKey: "totalNetSalesInShift",
  //   header: () => <div className="text-center font-semibold">Doanh thu</div>,
  //   cell: (info) => (
  //     <div className="text-center font-medium">
  //       {formatCurrency(info.getValue() as number)}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: ({ column }) => createFormattedHeader("Trạng thái", column),
    cell: (info) => {
      const status = info.getValue() as TFinancialShiftStatusEnum;
      const { label, className } = getFinancialShiftStatusLabel(status);

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
    id: "actions",
    header: ({ column }) => createFormattedHeader("Thao tác", column),
    cell: ({ row }) => {
      const shift = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={PATH_STORE_DASHBOARD.financialShift.detail(shift.id)}>
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
  },
];
