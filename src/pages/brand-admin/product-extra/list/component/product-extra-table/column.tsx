import {
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TProductExtra } from "@/schema/product-extra.schema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TProductExtra>[] = [
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã sản phẩm", column, {
        sortable: true,
        align: "left",
      }),
    cell: (info) => {
      const code = info.getValue() as string;
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
            onClick={() => copyToClipboard(code, "Mã sản phẩm")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "280px",
          truncate: true,
          tooltip: code,
          className: "px-2",
          align: "left",
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "sku",
    header: ({ column }) =>
      createFormattedHeader("SKU", column, {
        sortable: true,
        align: "left",
      }),
    cell: (info) => {
      const sku = info.getValue() as string;
      return createFormattedCell(
        // <span className="font-mono font-medium text-gray-800">{code}</span>,
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
          className: "px-2",
          align: "left",
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên sản phẩm phụ", column, {
        sortable: true,
        align: "left",
      }),
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
    accessorKey: "displayOrder",
    header: ({ column }) =>
      createFormattedHeader("Thứ tự", column, {
        sortable: true,
        align: "center",
      }),
    cell: (info) => {
      const displayOrder = info.getValue() as number;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {displayOrder}
        </span>,
        {
          align: "center",
          truncate: true,
          className: "px-2",
        }
      );
    },
    size: 100,
  },
  {
    accessorKey: "price",
    header: ({ column }) =>
      createFormattedHeader("Giá gốc", column, {
        sortable: true,
        align: "center",
      }),
    cell: (info) => {
      const price = info.getValue() as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            {formatPrice(price)}
          </span>
        </div>,
        {
          align: "center",
          maxWidth: "180px",
          truncate: true,
          tooltip: `Giá bán: ${formatPrice(price)}₫`,
        }
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, {
        sortable: true,
        align: "center",
      }),
    cell: (info) => {
      const isActive = info.getValue() as boolean;

      return createSimpleStatusBadge({ isActive: isActive });
    },
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Thao tác", column, { align: "center" }),
    cell: ({ row }) => {
      const extra = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.extra.edit(extra.id)}>
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
    size: 80, // Fixed width for consistent layout
  },
];
