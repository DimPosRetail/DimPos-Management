import { DataTable } from "@/components/table/data-table";
// import { useQueryParams } from "@/hooks/use-query-params";
import { columns } from "./order-item/columns";
import type { TOrderItem } from "@/schema/order-item.schema";

type Props = {
  initialData: TOrderItem[];
};

const OrderItemTable = ( { initialData }: Props ) =>
{
  //   const {
  //     currentPage,
  //     pageSize,
  //     sortBy,
  //     isAsc,
  //     setSort,
  //     setPage,
  //     setPageSize,
  //     filter,
  //     setFilter,
  //   } = useQueryParams();

  //   const searchValues = filter.map((f) => ({
  //     ...f,
  //     searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên chiến dịch" : "",
  //   }));
  //   const sortValue = {
  //     id: sortBy,
  //     desc: !isAsc,
  //   };
  return (
    <DataTable
      columns={ columns }
      data={ initialData }
      totalItems={ initialData.length }
      currentPage={ 1 }
      pageSize={ initialData.length }
      onPageChange={ () => { } }
      onPageSizeChange={ () => { } }
      isPagingProp={ false }
      isShort={ true }
    />
  );
};

export default OrderItemTable;
