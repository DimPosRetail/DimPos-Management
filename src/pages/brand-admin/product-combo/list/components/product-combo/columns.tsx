import {
  createFormattedCell,
  createFormattedHeader,
  createFormattedImageCell,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  copyToClipboard,
} from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TComboProduct } from "@/schema/combo-product.schema";
import type { TProductResponse } from "@/schema/product.schema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TComboProduct>[] = [
  {
    accessorKey: "productImages",
    header: () => createFormattedHeader("Ảnh"),
    cell: (info) => {
      const productImages =
        info.getValue() as TProductResponse["productImages"];
      const mainImage = productImages?.find((img) => img.isMainImage);

      return createFormattedImageCell({
        imageUrl: mainImage?.imageUrl,
        size: 16,
      });
    },
    size: 80,
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã sản phẩm", column, { align: "left" }),
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
            onClick={() => copyToClipboard(code, "Mã sản phẩm")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: code,
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "sku",
    header: () => <div className="font-semibold text-base">SKU</div>,
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
          maxWidth: "300px",
          truncate: true,
          tooltip: sku,
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên combo", column, { align: "left" }),
    cell: (info) => {
      const name = info.getValue() as string;
      return createFormattedCell(
        <div className="max-w-[200px]">
          <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
            {name}
          </div>
        </div>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: name,
        }
      );
    },
  },
  {
    accessorKey: "displayOrder",
    header: ({ column }) =>
      createFormattedHeader("Thứ tự", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const displayOrder = info.getValue() as number;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {displayOrder}
        </span>,
        {
          align: "center",
          maxWidth: "100px",
        }
      );
    },
    size: 100,
  },
  {
    accessorKey: "isActive",
    header: ({column}) => createFormattedHeader("Trạng thái", column, {align: "center"}),
    cell: (info) => {
      const isActive = info.getValue() as boolean;

      return createSimpleStatusBadge({ isActive: isActive });
    },
  },
  {
    id: "actions",
    header: ({column}) => createFormattedHeader("Thao tác", column),
    cell: ({ row }) => {
      const combo = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.combo.edit(combo.id)}>
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
