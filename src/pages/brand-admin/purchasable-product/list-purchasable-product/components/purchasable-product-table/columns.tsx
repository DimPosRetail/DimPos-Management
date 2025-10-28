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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TPurchasableProduct } from "@/schema/purchasable-product.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<TPurchasableProduct>[] = [
  {
    accessorKey: "productImages",
    header: ({ column }) =>
      createFormattedHeader("Ảnh", column, { align: "center" }),
    cell: (info) => {
      const productImages =
        info.getValue() as TPurchasableProduct["productImages"];
      const mainImage = productImages?.find((img) => img.isMainImage);

      return createFormattedImageCell({
        imageUrl: mainImage?.imageUrl,
        size: 16,
      });
    },
    size: 80,
  },
  {
    accessorKey: "sku",
    header: ({ column }) =>
      createFormattedHeader("SKU", column, { align: "left", sortable: true }),
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
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
            onClick={() => copyToClipboard(sku, "Mã SKU")}
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
      createFormattedHeader("Tên sản phẩm", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      // const shortName = row.original.shortName;
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
      createFormattedHeader("Giá nhập", column, { align: "center" }),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
            {formatPrice(price)}
          </span>
        </div>,
        {
          align: "center",
          maxWidth: "130px",
          truncate: true,
          tooltip: `Giá bán: ${formatPrice(price)}₫`,
        }
      );
    },
    size: 130,
  },
  {
    accessorKey: "displayOrder",
    header: ({ column }) =>
      createFormattedHeader("Độ ưu tiên", column, {
        align: "center",
      }),
    cell: ({ row }) => {
      const displayOrder = row.getValue("displayOrder") as number;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {displayOrder}
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
      }),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return createSimpleStatusBadge({ isActive });
    },
    size: 150,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ({ row }) => {
      const purchasableProduct = row.original;
      const navigate = useNavigate();

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="group relative flex items-center cursor-pointer"
                  onClick={() =>
                    navigate(
                      PATH_BRAND_DASHBOARD.purchasableProduct.edit(
                        purchasableProduct.id
                      )
                    )
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
