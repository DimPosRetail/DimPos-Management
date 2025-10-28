import { DataTable } from "@/components/table/data-table";
import { getFilterValue, useQueryParams } from "@/hooks/use-query-params";
import { storeOrderColumns } from "./components/column";
import { useStoreOrder } from "@/hooks/use-order";
import { handleApiError } from "@/lib/error";
import { getOrderStatusLabel2, OrderStatusEnum, type TOrderStatusEnum } from "@/types/enums/order-status.enum";
import { getOrderTypeLabel, OrderTypeEnum, type TOrderTypeEnum } from "@/types/enums/order-type.enum";

const OrderTable = () => {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    filter,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams({
    defaultSortBy: "createdDate",
    defaultIsAsc: false,
    defaultFilter: [
       {
        id: "status",
        value: null,
      },
      {
        id: "type",
        value: null,
      },
      {
        id: "createdDate",
        value: null,
      },
      {
        id: "completedAt",
        value: null,
      },
    ],
  });

  const { getStoreOrders } = useStoreOrder();

  const { data, isLoading, isError, error } = getStoreOrders({
    page: currentPage,
    pageSize: pageSize,
    sortBy: sortBy,
    isAsc: isAsc,
     status: getFilterValue( {
      id: "status",
      columnFilters: filter,
    } ) === "All" ? null : getFilterValue( {
      id: "status",
      columnFilters: filter,
    } ),
    type: getFilterValue( {
      id: "type",
      columnFilters: filter,
    } ) === "All" ? null : getFilterValue( {
      id: "type",
      columnFilters: filter,
    } ),
    createdDate: getFilterValue({
      id: "createdDate",
      columnFilters: filter,
    }),
    completedAt: getFilterValue({
      id: "completedAt",
      columnFilters: filter,
    }),
  });

  if (isError && error) {
    handleApiError(error);
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;
  const searchValues = filter.map(f => ({
    ...f,
        value: f.value ?? ( ( f.id === "createdDate" || f.id === "completedAt" ) ? null : f.id === "status" || f.id === "type" ? "All" : "" ),
    searchPlaceholder: f.id === "status" ? "Trạng thái đơn hàng" : f.id === "type" ? "Loại đơn hàng" : f.id === "createdDate" ? "Từ ngày" : f.id === "completedAt" ? "Đến ngày" : "",
    isStartDate: f.id === "createdDate",
    isEndDate: f.id === "completedAt",
isSelect: f.id === "status" || f.id === "type",
    options: f.id === "status" ? [
      { label: "Tất cả", value: "All" },
      ...Object.keys( OrderStatusEnum ).map( ( label, value ) => ( {
        label: getOrderStatusLabel2( value as TOrderStatusEnum ).label,
        value: label,
      } ) )
    ] : f.id === "type" ? [
      { label: "Tất cả", value: "All" },
      ...Object.keys( OrderTypeEnum ).map( ( label, value ) => ( {
        label: getOrderTypeLabel( value as TOrderTypeEnum ),
        value: label,
      } ) )
    ] : [],
  } ) );

  return (
    <DataTable
      columns={storeOrderColumns()}
      data={items}
      totalItems={total}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      isLoading={isLoading}
      sortValues={[{ id: sortBy, desc: !isAsc }]}
      onSortChange={(newSort) => {
        setSort(newSort[0].id, !newSort[0].desc);
      }}
      searchValues={searchValues}
      onSearchChange={setFilter}
    />
  );
};

export default OrderTable;
