import { DataTable } from "@/components/table/data-table";
import { useProduct } from "@/hooks/use-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./modifier-group-table/column";

const ModifierGroupTable = () =>
{
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams();

  const { getModifierGroups } = useProduct();
  const { data, isLoading, isError, error } = getModifierGroups( {
    size: pageSize,
    page: currentPage,
    sortBy,
    isAsc,
  } );

  if ( isError && error )
  {
    handleApiError( error );
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };

  return (
    <>
      <DataTable
        columns={ columns() }
        data={ items }
        totalItems={ total }
        currentPage={ currentPage }
        pageSize={ pageSize }
        onPageChange={ setPage }
        onPageSizeChange={ setPageSize }
        isLoading={ isLoading }
        sortValues={ [ sortValue ] }
        onSortChange={ ( newSort ) =>
        {
          setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
        } }
      />
    </>
  );
};

export default ModifierGroupTable;
