// import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
// import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";

export const columns: ColumnDef<TStorePurchaseOrderItem>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "index",
    header: () => (
      <div className="flex items-center justify-center max-w-[50px]">STT</div>
    ),
    cell: ( info ) =>
    {
      const table = info.table;
      const row = info.row;
      const currentPage = table.getState().pagination.pageIndex;
      const currentSize = table.getState().pagination.pageSize;
      return (
        <div className="">
          <div className="text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm font-normal flex justify-center max-w-[50px]">
            { row.index + currentPage * currentSize + 1 }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productVariantNameSnapshot",
    header: () => (
      <div className="font-semibold text-base">Sản phẩm</div>
    ),
    cell: ( info ) =>
    {
      const productVariantName = info.getValue() as string;
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return <div className="flex justify-start">{ productVariantName }</div>;
    },
  },
  {
    accessorKey: "requestedQuantity",
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng yêu cầu</div>
    ),
    cell: ( info ) =>
    {
      const quantity = info.getValue() as number;
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return <div className="flex justify-center">{ quantity }</div>;
    },
  },
  {
    accessorKey: "approvedQuantityByBrand",
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng chấp nhận</div>
    ),
    cell: ( info ) =>
    {
      const quantity = info.getValue() as number;
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return <div className="flex justify-center">{ quantity || <span className="text-muted-foreground">Chưa duyệt</span> }</div>;
    },
  },
  {
    accessorKey: "productVariantPriceSnapshot",
    header: () => (
      <div className="text-center font-semibold text-base">Đơn giá</div>
    ),
    cell: ( info ) =>
    {
      const productVariantPriceSnapshot = info.getValue() as number;
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return (
        <div className="flex justify-center">
          { formatCurrency( productVariantPriceSnapshot ) }
        </div>
      );
    },
  },
  {
    accessorKey: "totalPriceOfOrderItems",
    header: () => (
      <div className="text-center font-semibold text-base">
        Thành tiền dự kiến
      </div>
    ),
    cell: ( info ) =>
    {
      const totalPriceOfOrderItems = info.getValue() as number;
      return (
        <div className="flex justify-center">
          { formatCurrency( totalPriceOfOrderItems ) }
        </div>
      );
    },
  },
  // {
  //   id: "quantity",
  //   header: ({}) => {
  //     return <div className="text-center font-semibold">Số lượng đáp ứng</div>;
  //   },
  //   cell: ({ row, table }) => {
  //     // const isSelected = row.getIsSelected();
  //     const { poQuantityValues, onPoQuantityChange, poStatus} = table.options.meta || {};
  //     const item = row.original;

  //     const current =
  //       poQuantityValues?.find((q) => q.id === item.id)
  //         ?.approvedQuantityByBrand ?? item.approvedQuantityByBrand;
  //     const original = item.approvedQuantityByBrand;
  //     const isDisabled =
  //       poStatus === StorePurchaseOrderStatusEnum.RejectedByBrand ||
  //       poStatus === StorePurchaseOrderStatusEnum.DoneByStore ||
  //       poStatus === StorePurchaseOrderStatusEnum.CancelledByStore ||
  //       poStatus === StorePurchaseOrderStatusEnum.CancelledByBrand;
  //     useEffect(() => {
  //       row.toggleSelected(current !== original);
  //     }, [current]);
  //     return (
  //       <div className="flex justify-center">
  //         <Input
  //           type="number"
  //           // Prevent non-integer values and values less than 1
  //           min="1"
  //           step="1" // Only allow whole number increments
  //           className="w-20 text-center"
  //           disabled={isDisabled}
  //           value={current ?? ""}
  //           onChange={(e) => {
  //             const value = e.target.valueAsNumber;
  //             if (!isNaN(value)) {
  //               onPoQuantityChange?.(item.id, Math.max(1, Math.floor(value)));
  //             }
  //           }}
  //           onKeyDown={(e) => {
  //             // Prevent typing decimals, 'e', '+', '-'
  //             if ([".", "e", "+", "-"].includes(e.key)) {
  //               e.preventDefault();
  //             }
  //             if (e.key === "Enter") {
  //               e.preventDefault();
  //             }
  //           }}
  //         />
  //       </div>
  //     );
  //   },
  //   size: 100,
  // },
  // {
  //   accessorKey: "approvedQuantityByBrand",
  //   header: "SL duyệt",
  //   cell: ({ row }) => {
  //     const originalValue = row.original.approvedQuantityByBrand;
  //     const [inputValue, setInputValue] = useState(originalValue);

  //     useEffect(() => {
  //       const isChanged = inputValue !== originalValue;
  //       row.toggleSelected(isChanged); // ✅ tick nếu thay đổi
  //     }, [inputValue]);

  //     return (
  //       <Input
  //         type="number"
  //         className="w-24"
  //         min={1}
  //         value={inputValue}
  //         onChange={(e) => {
  //           const val = Number(e.target.value);
  //           setInputValue(val);
  //         }}
  //       />
  //     );
  //   },
  // },
];
