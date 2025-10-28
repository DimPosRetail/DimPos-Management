import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import type { TStoreFinancialShiftConfig } from "@/schema/financial-shift-configs";

type Props = {
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
};

export const financialShiftColumns = ({ onEdit }: Props): ColumnDef<TStoreFinancialShiftConfig>[] => [
  {
    accessorKey: "index",
    header: () => <div className="text-center font-semibold">STT</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div className="text-center">{row.index + 1 + pageIndex * pageSize}</div>;
    },
    size: 50,
  },
  {
    accessorKey: "openingTime",
    header: () => <div className="font-semibold text-center">Giờ mở cửa</div>,
    cell: ({ row }) => {
      const time = new Date(`1970-01-01T${row.original.openingTime}`);
      return <div className="text-center text-blue-700 font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false })}</div>;
    },
    size: 120,
  },
  {
    accessorKey: "closingTime",
    header: () => <div className="font-semibold text-center">Giờ đóng cửa</div>,
    cell: ({ row }) => {
      const time = new Date(`1970-01-01T${row.original.closingTime}`);
      return <div className="text-center text-blue-700 font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false })}</div>;
    },
    size: 120,
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center font-semibold">Trạng thái</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="text-center">
          {isActive ? (
            <span className="text-green-600 font-medium">Mặc định</span>
          ) : (
            <span className="text-red-500 italic">Đã tắt</span> 
          )}
        </div>
      );
    },
    size: 160,
  },
  {
    accessorKey: "createdDate",
    header: () => <div className="text-center font-semibold">Ngày tạo</div>,
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      return (
        <div className="text-center text-sm text-gray-500">
          {date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
    size: 180,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Thao tác</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => onEdit(row.original.id)}>
                <Eye className="w-4 h-4 hover:text-primary cursor-pointer" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">Xem chi tiết</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    size: 80,
  },
];
