import { DataTable } from "@/components/table/data-table";
import { useInternalProduct } from "@/hooks/use-internal-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./purchasable-product-table/columns";

const PurchasableProductTable = () =>
{
  const { getInternalProducts } = useInternalProduct();
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
    filter,
    setFilter,
  } = useQueryParams( {
    defaultSortBy: "name",
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
      {
        id: "sku",
        value: "",
      },
    ],
  } );
  const { data, isLoading, isError, error } = getInternalProducts( {
    size: pageSize,
    page: currentPage,
    name: filter.find( ( f ) => f.id === "name" )?.value as string || "",
    sku: filter.find( ( f ) => f.id === "sku" )?.value as string || null,
    sortBy: sortBy,
    isAsc: isAsc,
  } );
  if ( isError && error )
  {
    handleApiError( error );
  }
  const searchValues = filter.map( ( f ) => ( {
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên"
        : f.id === "sku"
          ? "Tìm kiếm theo mã SKU"
          : "",
  } ) );
  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };
  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;
  return (
    <DataTable
      isShort={ false }
      data={ items }
      totalItems={ total }
      columns={ columns }
      currentPage={ currentPage }
      pageSize={ pageSize }
      isLoading={ isLoading }
      onPageChange={ setPage }
      searchValues={ searchValues }
      onSearchChange={ setFilter }
      onPageSizeChange={ setPageSize }
      sortValues={ [ sortValue ] }
      onSortChange={ ( newSort ) =>
      {
        setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
      } }
    />
  );
};

export default PurchasableProductTable;
