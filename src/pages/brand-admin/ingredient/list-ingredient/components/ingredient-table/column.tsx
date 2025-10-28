import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import {
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TIngredientResponse } from "@/schema/ingredients.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TIngredientResponse>[] = [
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã nguyên liệu", column, { align: "left" }),
    cell: (info) => {
      const code = info.getValue() as string;
      return createFormattedCell(
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
            onClick={() => copyToClipboard(code, "Mã nguyên liệu")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "280px",
          truncate: true,
          tooltip: code,
          align: "left",
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "sku",
    header: ({ column }) =>
      createFormattedHeader("SKU", column, { align: "left" }),
    cell: (info) => {
      const sku = info.getValue() as string;
      return createFormattedCell(
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-medium text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 cursor-pointer"
          >
            {sku}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 rounded-md transition-colors"
            onClick={() => copyToClipboard(sku, "SKU")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "280px",
          truncate: true,
          tooltip: sku,
          align: "left",
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên thành phần", column, { align: "left" }),
    cell: (info) => {
      const name = info.getValue() as string;
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
    accessorKey: "measureUnit",
    header: ({ column }) =>
      createFormattedHeader("Đơn vị tính", column, { align: "center" }),
    cell: (info) => {
      const measureUnit = info.getValue() as string;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {measureUnit}
        </span>
      );
    },
    size: 120,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const isActive = info.getValue() as boolean;

      return createSimpleStatusBadge({ isActive });
    },
  },
  {
    id: "actions",
    header: ({ column }) => createFormattedHeader("Thao tác", column),
    cell: ({ row }) => {
      const ingredient = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Ensure the path exists in your path object */}
                <Link to={PATH_BRAND_DASHBOARD.ingredient.edit(ingredient.id)}>
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
    size: 80, // Fixed width for consistent layout
  },
];
