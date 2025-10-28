import {
  createFormattedCell,
  createFormattedHeader,
  createFormattedImageCell,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";

export const columns: ColumnDef<TProductVariantResponse>[] = [
  {
    accessorKey: "productImages",
    header: ({ column }) =>
      createFormattedHeader("Ảnh", column, { align: "center" }),
    cell: (info) => {
      const productImages =
        info.getValue() as TProductVariantResponse["productImages"];
      const mainImage = productImages?.find((img) => img.isMainImage);

      return createFormattedImageCell({
        imageUrl: mainImage?.imageUrl,
        size: 16,
        className: "justify-center",
      });
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã sản phẩm", column, { align: "left" }),
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
            onClick={() => copyToClipboard(code, "Mã danh mục")}
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
    cell: (info) => {
      const name = info.getValue() as string;
      return createFormattedCell(
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-base text-foreground text-base truncate cursor-pointer hover:text-primary transition-colors">
              {name}
            </div>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>,
        { align: "left", maxWidth: "300px", tooltip: name, truncate: true }
      );
    },
    size: 300,
  },
  //   {
  //     accessorKey: "description",
  //     header: () => <div className="font-semibold text-base">Mô tả</div>,
  //     cell: (info) => {
  //       const description = info.getValue() as string;
  //       return (
  //         <div className="max-w-[20em]">
  //           <Tooltip>
  //             <TooltipTrigger asChild>
  //               <div className="font-base text-foreground text-base truncate cursor-pointer hover:text-primary transition-colors">
  //                 {description || "Chưa có mô tả"}
  //               </div>
  //             </TooltipTrigger>
  //             <TooltipContent>{description || "Chưa có mô tả"}</TooltipContent>
  //           </Tooltip>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "size",
  //     header: () => (
  //       <div className="font-semibold text-base text-center">Size</div>
  //     ),
  //     cell: (info) => {
  //       const size = info.getValue() as string;

  //       // Handle case where alternative code might be empty or null
  //       if (!size) {
  //         return (
  //           <div className="flex items-center gap-2 justify-center">
  //             <Badge variant="outline" className="text-muted-foreground">
  //               Không có
  //             </Badge>
  //           </div>
  //         );
  //       }

  //       return (
  //         <div className="flex items-center gap-2 text-base justify-center">
  //           <Badge variant="secondary" className="font-mono text-base">
  //             {size}
  //           </Badge>
  //         </div>
  //       );
  //     },
  //   },
  {
    id: "price",
    header: ({ column }) =>
      createFormattedHeader("Giá", column, { align: "center" }),
    cell: ({ row }) => {
      const price = row.original.price as number;
      // const currenyCode = row.original.currencyCode as string;
      return createFormattedCell(
        <span className="inline-flex items-center justify-end font-semibold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
          {formatPrice(price)}
        </span>,
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
];
