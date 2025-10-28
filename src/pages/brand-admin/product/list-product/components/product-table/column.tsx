import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createFormattedCell,
  createFormattedHeader,
  createFormattedImageCell,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TProductResponse } from "@/schema/product.schema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { copyToClipboard } from "@/lib/utils";

export const columns: ColumnDef<TProductResponse>[] = [
  {
    accessorKey: "productImages",
    header: () => createFormattedHeader("Ảnh"),
    // <div className="font-semibold text-base">Ảnh</div>,
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
          // className: "px-2",
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên sản phẩm", column, { align: "left" }),
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
          // className: "px-2",
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "isHasVariants",
    header: ({ column }) =>
      createFormattedHeader("Biến Thể", column, { align: "center" }),
    cell: (info) => {
      const hasVariants = info.getValue() as boolean;
      return createSimpleStatusBadge({
        isActive: hasVariants,
        activeText: "Có biến thể",
        inactiveText: "Không biến thể",
        activeClassName: "bg-cempedak-10 text-cempedak-100 border border-cempedak-100",
        inactiveClassName: "bg-neutral-10 text-neutral-100 border border-neutral-100",
      });
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) =>
      createFormattedHeader("Trạng Thái", column, { align: "center" }),
    cell: (info) => {
      const isActive = info.getValue() as boolean;
      return createSimpleStatusBadge({ isActive: isActive });
    },
  },
  {
    id: "actions",
    header: ({ column }) => createFormattedHeader("Thao Tác", column),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_BRAND_DASHBOARD.product.editProduct(product.id)}>
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
