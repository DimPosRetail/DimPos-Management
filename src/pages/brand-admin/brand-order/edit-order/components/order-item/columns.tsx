import type { ColumnDef } from "@tanstack/react-table";
import type { TOrderItem } from "@/schema/order-item.schema";
import { formatCurrency } from "@/lib/utils";


export const columns: ColumnDef<TOrderItem>[] = [
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
          <div
            className="text-foreground text-base truncate cursor-pointer hover:text-primary transition-colors font-normal flex justify-center max-w-[50px]"
          >
            { row.index + currentPage * currentSize + 1 }
          </div>
        </div>
      );
    },
  },

  {
    id: "productName",
    header: () => (
      <div className="font-semibold text-base">Sản phẩm</div>
    ),
    cell: ( { row } ) =>
    {
      const productVariantName = row.original.productVariantNameSnapshot;
      const selectedOptions = row.original.orderItemSelectedOptions?.map( option => option.modifierOptionSnapshot ) || [];
      const extraProduct = row.original.orderItemExtras?.map( extra => extra.productVariantNameSnapshot ) || [];

      return <div className="flex flex-col text-base justify-start">
        { productVariantName }
        { selectedOptions.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-col">
            { selectedOptions.map( ( option, idx ) => (
              <span key={ idx }> • { option }</span>
            ) ) }
          </div>
        ) }
        { extraProduct.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-col">
            { extraProduct.map( ( extra, idx ) => (
              <span key={ idx }> + { extra }</span>
            ) ) }
          </div>
        ) }
      </div>;
    },
  },
  {
    id: "unitPriceSnapshot",
    header: () => (
      <div className="text-start font-semibold text-base">Giá sản phẩm</div>
    ),
    cell: ( { row } ) =>
    {
      const unitPriceSnapshot = row.original.unitPriceSnapshot;
      const unitPriceSnapshotForExtras = row.original.orderItemExtras?.map( extra => extra.unitPriceSnapshot ) || [];
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return <div className="flex flex-col justify-center items-start">
        { formatCurrency( unitPriceSnapshot ) }
        { unitPriceSnapshotForExtras.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-col">
            { unitPriceSnapshotForExtras.map( ( price, idx ) => (
              <span key={ idx }>{ formatCurrency( price ) }</span>
            ) ) }
          </div>
        ) }
      </div>;
    },
  },
  {
    id: "quantity",
    header: () => (
      <div className="text-center font-semibold text-base">Số lượng</div>
    ),
    cell: ( { row } ) =>
    {
      const quantity = row.original.quantity;
      const quantityForExtras = row.original.orderItemExtras?.map( extra => extra.quantity ) || [];
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return <div className="flex flex-col justify-center items-center">
        { quantity }
        { quantityForExtras.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-col">
            { quantityForExtras.map( ( qty, idx ) => (
              <span key={ idx }>{ qty }</span>
            ) ) }
          </div>
        ) }
      </div>;
    },
  },
  {
    id: "totalPriceBeforeItemDiscount",
    header: () => (
      <div className="text-end font-semibold text-base">Tổng</div>
    ),
    cell: ( { row } ) =>
    {
      const totalPriceBeforeItemDiscount = row.original.totalPriceBeforeItemDiscount;
      // Corrected logic: 0 typically means active/visible, 1 means inactive/hidden

      return (
        <div className="flex flex-col text-lg justify-center items-end font-semibold">
          { formatCurrency( totalPriceBeforeItemDiscount ) }
        </div>
      );
    },
  },
];
