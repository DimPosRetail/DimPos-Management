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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TProductVariantResponse>[] = [
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã biến thể", column, {
        sortable: true,
        align: "left",
      }),
    cell: (info) => {
      const code = info.getValue() as string;
      return createFormattedCell(
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-medium text-xs px-2 py-1 bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer"
          >
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => copyToClipboard(code, "Mã biến thể")}
          >
            <Copy className="h-3.5 w-3.5 text-slate-500 hover:text-slate-700" />
          </Button>
        </div>,
        {
          align: "left",
          maxWidth: "280px",
          truncate: true,
          tooltip: `Mã biến thể: ${code}`,
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "sku",
    header: ({ column }) =>
      createFormattedHeader("SKU", column, {
        align: "left",
        sortable: true,
      }),
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
          align: "left",
          maxWidth: "280px",
          truncate: true,
          tooltip: `SKU: ${sku}`,
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "name",
    header: () =>
      createFormattedHeader("Tên biến thể", undefined, { align: "left" }),
    cell: (info) => {
      const name = info.getValue() as string;
      return createFormattedCell(
        <div className="font-medium text-sm text-slate-900 leading-5 hover:text-primary transition-colors duration-200 cursor-pointer">
          <span className="line-clamp-2">{name}</span>
        </div>,
        {
          align: "left",
          maxWidth: "320px",
          truncate: true,
          tooltip: name,
        }
      );
    },
    size: 320,
  },
  {
    accessorKey: "price",
    header: ({ column }) =>
      createFormattedHeader("Giá bán", column, {
        align: "right",
        sortable: true,
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
    size: 180,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const status = info.getValue() as boolean;
      return createFormattedCell(
        <div className="flex justify-center">
          {createSimpleStatusBadge({ isActive: status })}
        </div>,
        {
          align: "center",
          maxWidth: "120px",
        }
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-sm text-slate-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={PATH_BRAND_DASHBOARD.product.editVariant(variant.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md transition-colors group"
                  >
                    <Eye className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-medium">Xem chi tiết</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 100,
  },
];
