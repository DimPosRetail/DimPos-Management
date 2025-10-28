import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { columns } from "./order-table/colums";
import { getFilterValue, useQueryParams } from "@/hooks/use-query-params";
import { useOrder } from "@/hooks/use-order";
import {
  getOrderStatusLabel2,
  OrderStatusEnum,
  type TOrderStatusEnum,
} from "@/types/enums/order-status.enum";
import {
  getOrderTypeLabel,
  OrderTypeEnum,
  type TOrderTypeEnum,
} from "@/types/enums/order-type.enum";

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
        id: "startDate",
        value: null,
      },
      {
        id: "endDate",
        value: null,
      },
    ],
  });

  const { getOrders } = useOrder();
  const { data, isLoading, isError, error } = getOrders({
    size: pageSize,
    page: currentPage,
    sortBy: sortBy,
    isAsc: isAsc,
    status:
      getFilterValue({
        id: "status",
        columnFilters: filter,
      }) === "All"
        ? null
        : getFilterValue({
            id: "status",
            columnFilters: filter,
          }),
    type:
      getFilterValue({
        id: "type",
        columnFilters: filter,
      }) === "All"
        ? null
        : getFilterValue({
            id: "type",
            columnFilters: filter,
          }),
    fromDate: getFilterValue({
      id: "startDate",
      columnFilters: filter,
    }),
    toDate: getFilterValue({
      id: "endDate",
      columnFilters: filter,
    }),
  });

  if (isError && error) {
    handleApiError(error);
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

  const searchValues = filter.map((f) => ({
    ...f,
    value:
      f.value ??
      (f.id === "startDate" || f.id === "endDate"
        ? null
        : f.id === "status" || f.id === "type"
        ? "All"
        : ""),
    searchPlaceholder:
      f.id === "status"
        ? "Trạng thái đơn hàng"
        : f.id === "type"
        ? "Loại đơn hàng"
        : f.id === "startDate"
        ? "Từ ngày"
        : f.id === "endDate"
        ? "Đến ngày"
        : "",
    isStartDate: f.id === "startDate",
    isEndDate: f.id === "endDate",
    isSelect: f.id === "status" || f.id === "type",
    options:
      f.id === "status"
        ? [
            { label: "Tất cả", value: "All" },
            ...Object.keys(OrderStatusEnum).map((label, value) => ({
              label: getOrderStatusLabel2(value as TOrderStatusEnum).label,
              value: label,
            })),
          ]
        : f.id === "type"
        ? [
            { label: "Tất cả", value: "All" },
            ...Object.keys(OrderTypeEnum).map((label, value) => ({
              label: getOrderTypeLabel(value as TOrderTypeEnum),
              value: label,
            })),
          ]
        : [],
  }));

  return (
    <DataTable
      columns={columns}
      data={items}
      totalItems={total}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      isLoading={isLoading}
      sortValues={[sortValue]}
      onSortChange={(newSort) => {
        setSort(newSort[0].id, !newSort[0].desc);
      }}
      onSearchChange={setFilter}
      searchValues={searchValues}
    />
  );
};

export default OrderTable;
