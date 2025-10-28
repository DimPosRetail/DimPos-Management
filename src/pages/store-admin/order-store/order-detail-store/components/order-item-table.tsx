import { DataTable } from "@/components/table/data-table";
import { columns } from "./order-item/columns";
import type { TStoreOrderItem } from "@/schema/order.schema"; // Dùng type đúng với store

type Props = {
  initialData: TStoreOrderItem[];
};

const StoreOrderItemTable = ({ initialData }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={initialData}
      totalItems={initialData.length}
      currentPage={1}
      isPagingProp={false}
      pageSize={initialData.length}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
    />
  );
};

export default StoreOrderItemTable;
