  import { DataTable } from "@/components/table/data-table";
  import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
  import { getFilterValue, useQueryParams } from "@/hooks/use-query-params";
  import { handleApiError } from "@/lib/error";
  import { columns } from "./purchase-order/column";

  const InternalPOListTable = () =>
  {
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
    } = useQueryParams( {
      defaultSortBy: "createdDate",
      defaultIsAsc: false,
      defaultFilter: [
        {
          id: "startDate",
          value: null,
        },
        {
          id: "endDate",
          value: null,
        },
      ],
    } );

    const { getInternalPurchaseOrders } = useInternalPurchaseOrders();
    const { data, isLoading, isError, error } = getInternalPurchaseOrders( {
      page: currentPage,
      size: pageSize,
      sortBy: sortBy,
      isAsc: isAsc,
      fromDate: getFilterValue( {
        id: "startDate",
        columnFilters: filter,
      } ),
      toDate: getFilterValue( {
        id: "endDate",
        columnFilters: filter,
      } ),
    } );

    if ( isError && error )
    {
      handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total ?? 0;
    const searchValues = filter.map( f => ( {
      ...f,
      value: f.value ?? ( ( f.id === "startDate" || f.id === "endDate" ) ? null : f.id === "status" ? "All" : "" ),
      searchPlaceholder: f.id === "status" ? "Trạng thái đơn hàng" : f.id === "startDate" ? "Từ ngày" : f.id === "endDate" ? "Đến ngày" : "",
      isStartDate: f.id === "startDate",
      isEndDate: f.id === "endDate",
    } ) );

    return (
      <DataTable
        columns={ columns }
        data={ items }
        totalItems={ total }
        currentPage={ currentPage }
        pageSize={ pageSize }
        onPageChange={ setPage }
        onPageSizeChange={ setPageSize }
        isLoading={ isLoading }
        sortValues={ [ { id: sortBy, desc: !isAsc } ] }
        onSortChange={ ( newSort ) =>
        {
          setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
        } }
        onSearchChange={ setFilter }
        searchValues={ searchValues }
      />
    );
  };

  export default InternalPOListTable;
