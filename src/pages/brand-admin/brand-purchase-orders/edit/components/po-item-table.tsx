import { DataTable } from "@/components/table/data-table";
// import { useQueryParams } from "@/hooks/use-query-params";
import { columns } from "./po-item/columns";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";

type Props = {
  initialData: TStorePurchaseOrderItem[];
};

const POItemTable = ({ initialData }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={initialData}
      totalItems={initialData.length}
      currentPage={1}
      pageSize={initialData.length}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
      isPagingProp={false}
    />
  );
};

export default POItemTable;
