import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { TStaff } from "@/schema/staff.schema";
import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<number, { label: string; className: string }> = {
  0: { label: "Đang hoạt động", className: "text-emerald-600 bg-emerald-50 border border-emerald-200" },
  1: { label: "Ngừng hoạt động", className: "text-red-500 bg-red-50 border border-red-200" },
};

type Props = {
  onEdit: (staffId: string) => void;
};

export const staffColumns = ({ onEdit }: Props): ColumnDef<TStaff>[] => [
  {
    accessorKey: "index",
    header: ({ column }) => createFormattedHeader("STT", column),
    cell: ({ row, table }) => {
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return createFormattedCell(
        <span>{row.index + 1 + currentPage * currentSize}</span>,
        {
          align: "center",
        }
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã nhân viên", column, { align: "left" }),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return createFormattedCell(
        <div className="flex items-center gap-2">
          <Badge className="font-medium text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 cursor-pointer">
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 rounded-md transition-colors"
            onClick={() => copyToClipboard(code, "Mã thành phần")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "200px",
          truncate: true,
          tooltip: code,
          align: "left",
        }
      );
      //   (
      //     <div className="font-medium text-blueberry-100">
      //       {row.getValue("code")}
      //     </div>
      //   );
    },
    size: 250,
  },
  {
    accessorKey: "username",
    header: ({ column }) =>
      createFormattedHeader("Tên đăng nhập", column, { align: "left" }),
    cell: ({ row }) => createFormattedCell(row.getValue("username"), { align: "left" }),
    size: 200,
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      createFormattedHeader("Email", column, { align: "left" }),
    cell: ({ row }) => createFormattedCell(row.getValue("email"), { align: "left" }),
    size: 200,
  },
  {
    accessorKey: "status",
    header: ({ column }) => createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      const { label, className } = STATUS_MAP[status] || {
        label: "Không xác định",
        className: "text-gray-400",
      };
      return createFormattedCell(label, { align: "center", className: `font-medium rounded ${className}` });
    },
    size: 150,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => onEdit(staff.id)}>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                </button>
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
