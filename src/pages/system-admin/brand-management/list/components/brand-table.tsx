import { DataTable } from "@/components/table/data-table";
import { useBrand } from "@/hooks/use-brand";
import { handleApiError } from "@/lib/error";
import { useQueryParams } from "@/hooks/use-query-params";
import { columns } from "./brand-column";
import type { TBrandResponse } from "@/schema/brand-management.schema";

const BrandTable = () =>
{
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
      { id: "name", value: "" },
      { id: "code", value: null }
    ],
  } );

  const { getBrands } = useBrand();

  const nameFilter = String( filter.find( ( f ) => f.id === "name" )?.value ?? "" );
  const codeFilter = filter.find( f => f.id === "code" )?.value as string || null;

  const { data, isLoading, isError, error } = getBrands( {
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
    name: nameFilter,
    code: codeFilter,
  } );

  if ( isError && error )
  {
    handleApiError( error );
  }

  const fallback = { items: [] as TBrandResponse[], total: 0 };
  const rawData = data?.data?.data;
  const { items, total } =
    Array.isArray( rawData )
      ? { items: rawData, total: rawData.length }
      : rawData ?? fallback;

  const searchValues = filter.map( ( f ) => ( {
    ...f,
    searchPlaceholder:
      f.id === "name" ? "Tìm kiếm theo tên thương hiệu" : f.id === "code" ? "Tìm kiếm theo mã thương hiệu" : "",
  } ) );

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

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
      onSearchChange={ setFilter }
      searchValues={ searchValues }
      sortValues={ [ sortValue ] }
      onSortChange={ ( newSort ) =>
      {
        setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
      } }
    />
  );
};

export default BrandTable;
