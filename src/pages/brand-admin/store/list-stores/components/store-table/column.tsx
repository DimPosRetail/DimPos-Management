import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TStore } from "@/schema/store.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<TStore>[] = [
  {
    accessorKey: "index",
    header: ({ column }) =>
      createFormattedHeader("STT", column, { align: "center" }),
    cell: (info) => {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return (
        <div className="">
          <div className="text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm font-normal flex justify-center max-w-[50px]">
            {row.index + currentPage * currentSize + 1}
          </div>
        </div>
      );
    },
    size: 60,
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã cửa hàng", column, { align: "left" }),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return createFormattedCell(
        // <span className="font-mono font-medium text-gray-800">{code}</span>,
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-medium text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 cursor-pointer"
          >
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 rounded-md transition-colors"
            onClick={() => copyToClipboard(code, "Mã cửa hàng")}
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
    },
    size: 120,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên cửa hàng", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      // const shortName = row.original.shortName;
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {name}
        </span>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: name,
          className: "px-2",
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "phone",
    header: ({ column }) =>
      createFormattedHeader("Số điện thoại", column, { align: "center" }),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {phone}
        </span>,
        {
          align: "center",
          truncate: true,
          tooltip: phone,
        }
      );
    },
    size: 130,
  },
  // {
  //   accessorKey: "email",
  //   header: () => <div className="font-semibold text-base">Email</div>,
  //   cell: ({ row }) => {
  //     const email = row.getValue("email") as string;
  //     return <div className="font-normal text-gray-700">{email}</div>;
  //   },
  //   size: 130,
  // },
  {
    accessorKey: "managerName",
    header: ({ column }) =>
      createFormattedHeader("Người quản lý", column, { align: "left" }),
    cell: ({ row }) => {
      const managerName = row.getValue("managerName") as string;
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {managerName || "Chưa phân công"}
        </span>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: managerName,
        }
      );
    },
    size: 150,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Thao tác", column, { align: "center" }),
    cell: ({ row }) => {
      const store = row.original;
      const navigate = useNavigate();

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="group relative flex items-center cursor-pointer"
                  onClick={() =>
                    navigate(PATH_BRAND_DASHBOARD.store.edit(store.id))
                  }
                >
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                  <TooltipContent>
                    <div className="text-sm">Xem chi tiết</div>
                  </TooltipContent>
                </div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80,
  },
];
