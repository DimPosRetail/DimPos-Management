import { RowSelectCell } from "@/components/table/row-select";
import {
  createFormattedCell,
  createFormattedHeader,
  createFormattedImageCell,
} from "@/components/table/table-formatter";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import type { TPurchasableProduct } from "@/schema/purchasable-product.schema";
import type { ColumnDef } from "@tanstack/react-table";

export const baseColumns: ColumnDef<TPurchasableProduct>[] = [
  {
    accessorKey: "index",
    header: () => (
      <div className="text-center font-semibold text-sm text-muted-foreground">
        STT
      </div>
    ),
    cell: (info) => {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center text-sm font-medium">
          {row.index + currentPage * currentSize + 1}
        </div>
      );
    },
    size: 60,
  },
  {
    accessorKey: "sku",
    header: () => (
      <div className="text-center font-semibold text-sm text-muted-foreground">
        SKU
      </div>
    ),
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      return (
        <div className="text-center text-sm font-medium text-primary truncate max-w-[100px]">
          {sku}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="font-semibold text-sm text-muted-foreground">
        Tên sản phẩm
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
          {name}
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-center font-semibold text-sm text-muted-foreground">
        Giá nhập
      </div>
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className="text-center text-sm font-medium text-green-600">
          {price.toLocaleString("vi-VN")}₫
        </div>
      );
    },
    size: 130,
  },
];

export const columns = (step: number): ColumnDef<TPurchasableProduct>[] => [
  {
    id: "select",
    header: () => null,
    cell: ({ row }) =>
      step === 2 ? null : (
        <RowSelectCell row={row} className="scale-150 mx-2 ml-4" />
      ),
    size: 60,
  },
  {
    accessorKey: "productImages",
    header: ({ column }) => createFormattedHeader("Ảnh", column),
    cell: ({ row }) => {
      const images = row.original.productImages;
      const imageUrl = images?.[0]?.imageUrl;

      return createFormattedImageCell({
        imageUrl: imageUrl,
        size: 16,
        className: "flex items-center justify-center",
      });
    },
    size: 80,
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã sản phẩm", column, { align: "left" }),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return createFormattedCell(code, {
        align: "left",
        truncate: true,
        tooltip: code,
        className: "truncate max-w-[240px] font-medium",
      });
    },
    size: 100,
  },
  {
    accessorKey: "sku",
    header: ({ column }) =>
      createFormattedHeader("SKU", column, { align: "left" }),
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      return createFormattedCell(sku, {
        align: "left",
        truncate: true,
        tooltip: sku,
        className: "truncate max-w-[240px] font-medium",
      });
    },
    size: 100,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên sản phẩm", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return createFormattedCell(
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-base font-semibold truncate max-w-[240px]">
              {name}
            </span>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>,
        {
          align: "left",
          truncate: true,
          tooltip: name,
        }
      );
    },
    size: 240,
  },

  {
    accessorKey: "price",
    header: ({ column }) =>
      createFormattedHeader("Giá nhập", column, { align: "center" }),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return createFormattedCell(
        <div className="text-right">
          <span className="inline-flex items-center justify-end font-semibold text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
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
    size: 120,
  },
  {
    id: "quantity",
    header: () => {
      if (step === 1) return null;
      return <div className="text-center font-semibold">Số lượng</div>;
    },
    cell: ({ row, table }) => {
      if (step === 1) return null;
      // const isSelected = row.getIsSelected();
      const { onQuantityChange, quantityValues } = table.options.meta || {};

      const product = row.original;

      const currentQuantity =
        quantityValues?.find((q) => q.productVariantId === product.id)
          ?.quantity || 1;

      return (
        <div className="flex justify-center">
          <Input
            type="number"
            min="1"
            step="1"
            className="w-20 text-center"
            value={currentQuantity}
            onChange={(e) => {
              const rawValue = e.target.valueAsNumber;
              if (isNaN(rawValue)) return;

              // Ensure it's a positive double not only integer
              const newQuantity = Math.max(1, rawValue);
              onQuantityChange?.(product.id, newQuantity);
            }}
            // disabled={ !isSelected }
            onKeyDown={(e) => {
              // Prevent typing decimals, 'e', '+', '-'
              if (["e", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </div>
      );
    },
    size: 100,
  },
];
