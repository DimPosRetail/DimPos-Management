import { DataTable } from "@/components/table/data-table";
import { useMenu } from "@/hooks/use-menu";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./store-menu-table/column";

const StoreMenuTable = () =>
{
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams( {
        defaultSortBy: "createdDate",
    } );
    const { getStoreMenu } = useMenu();
    const { data, isLoading, isError, error } = getStoreMenu( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
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
    }
    return (
        <DataTable
            columns={ columns }
            data={ items }
            totalItems={ total }
            currentPage={ currentPage }
            pageSize={ pageSize }
            isLoading={ isLoading }
            onPageChange={ setPage }
            onPageSizeChange={ setPageSize }
            sortValues={ [ sortValue ] }
            onSortChange={ ( newSort ) =>
            {
                setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
            } }
        />
    )
}

export default StoreMenuTable