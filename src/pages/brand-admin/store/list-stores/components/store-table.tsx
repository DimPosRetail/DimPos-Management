import { DataTable } from "@/components/table/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { columns } from "./store-table/column";

type Props = {};

const StoreTable = ( _: Props ) =>
{
  const { getStores } = useStore();
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
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
      {
        id: "code",
        value: "",
      },
    ]
  } );

  const { data, isLoading, isError, error, } = getStores( {
    size: pageSize,
    page: currentPage,
    sortBy: sortBy,
    isAsc: isAsc,
    name: filter.find( f => f.id === "name" )?.value as string || "",
    code: filter.find( f => f.id === "code" )?.value as string || "",
  } );
  if ( isError && error )
  {
    handleApiError( error );
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;
  const searchValues = filter.map( f => ( {
    ...f,
    searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên cửa hàng" : f.id === "code" ? "Tìm kiếm theo mã cửa hàng" : "",
  } ) )
  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  }

  return (
    <DataTable
      data={ items }
      totalItems={ total }
      columns={ columns }
      currentPage={ currentPage }
      pageSize={ pageSize }
      isLoading={ isLoading }
      onPageChange={ setPage }
      onPageSizeChange={ setPageSize }
      onSearchChange={ setFilter }
      searchValues={ searchValues }
      onSortChange={ ( newSort ) =>
      {
        setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
      } }
      sortValues={ [ sortValue ] }
    />
  );
};

export default StoreTable;
