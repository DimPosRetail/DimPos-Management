import { SortableHeader } from "@/components/table/sortable-header";
import {
  createFormattedCell,
  createFormattedHeader
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
import { PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TInventoryStock } from "@/schema/inventory.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const inventoryStockColumns: ColumnDef<TInventoryStock>[] = [
  //   {
  //     id: "index",
  //     header: () => (
  //       <div className="flex font-semibold text-base justify-center max-w-[50px]">
  //         STT
  //       </div>
  //     ),
  //     cell: (info) => {
  //       const table = info.table;
  //       const row = info.row;
  //       const currentPage = table.getState().pagination.pageIndex;
  //       const currentSize = table.getState().pagination.pageSize;
  //       return (
  //         <div className="">
  //           <div className="flex items-center gap-2 text-base justify-center  max-w-[50px]">
  //             {row.index + currentPage * currentSize + 1}
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  {
    id: "ingredientCode",
    header: ({ column }) =>
      createFormattedHeader("Mã thành phần", column, { align: "left" }),
    cell: ({ row }) => {
      const code = row.original.ingredient.code;
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
            onClick={() => copyToClipboard(code, "Mã thành phần")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "250px",
          truncate: true,
          tooltip: code,
          align: "left",
        }
      );
    },
    size: 250,
  },
  {
    id: "ingredientName",
    header: ({ column }) =>
      createFormattedHeader("Tên thành phần", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.original.ingredient.name;
      return createFormattedCell(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium max-w-40 text-foreground cursor-pointer hover:text-primary transition-colors text-sm">
                {name}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{name}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
        {
          maxWidth: "350px",
          truncate: true,
          tooltip: name,
          align: "left",
        }
      );
    },
    size: 350,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) =>
      createFormattedHeader("Tồn kho", column, { align: "center" }),
    cell: (info) => {
      const quantity = info.getValue() as number;
      return createFormattedCell(
        <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm text-center">
          {quantity}
        </div>,
        {
          align: "center",
          truncate: true,
          tooltip: `Tồn kho: ${quantity}`,
        }
      );
    },
    size: 120,
  },
  {
    id: "ingredientMeasureUnit",
    header: ({ column }) =>
      createFormattedHeader("Đơn vị", column, { align: "center" }),
    cell: ({ row }) => {
      const measureUnit = row.original.ingredient.measureUnit;
      return createFormattedCell(
        <div className="flex justify-center">
          <Badge
            variant="secondary"
            className="w-16 justify-center items-center"
          >
            {measureUnit}
          </Badge>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "lastModifiedDate",
    header: ({ column }) =>
      createFormattedHeader("Cập nhật lần cuối", column, { align: "center" }),
    cell: (info) => {
      const lastModifiedDate = info.getValue() as Date;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {format(lastModifiedDate, "dd/MM/yyyy, HH:mm", { locale: vi })}
        </span>
      );
    },
  },
  {
    accessorKey: "reOrderLevel",
    header: ({ column }) => (
      <SortableHeader column={column}>Trạng thái</SortableHeader>
    ),
    cell: (info) => {
      const { reOrderLevel, quantity } = info.row.original;

      return (
        <div className="flex justify-center">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium ${
              quantity < reOrderLevel && quantity > 0
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : quantity == 0
                ? "bg-red-20 text-red-700 border border-red-80"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {quantity < reOrderLevel && quantity > 0
              ? "Sắp hết"
              : quantity == 0
              ? "Hết hàng"
              : "Còn hàng"}
          </div>
        </div>
      );
      // createSimpleStatusBadge({
      //   isActive: quantity <= reOrderLevel,
      //   activeText: "Sắp hết",
      //   inactiveText: "Còn hàng",
      //   activeClassName: "bg-red-50 text-red-700 border-red-200",
      //   inactiveClassName:
      //     "bg-emerald-50 text-emerald-600 border border-emerald-200",
      // });
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao Tác</div>
    ),
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_STORE_DASHBOARD.inventory.edit(stock.id)}>
                <TooltipTrigger>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                  <TooltipContent>
                    <div className="text-base">Xem chi tiết</div>
                  </TooltipContent>
                </TooltipTrigger>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80,
  },
];
