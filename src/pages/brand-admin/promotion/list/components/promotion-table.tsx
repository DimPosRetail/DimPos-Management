import { DataTable } from "@/components/table/data-table";
import { usePromotion } from "@/hooks/use-promotion";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./promotion-table/column";

const PromotionTable = () =>
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
        defaultFilter: [
            {
                id: "name",
                value: "",
            },
        ],
        defaultSortBy: "priority",
    } );
    const { getPromotions } = usePromotion();
    const { data, isLoading, isError, error } = getPromotions( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
    } );
    if ( isError && error )
    {
        handleApiError( error );
    }
    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên khuyến mãi" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }
    console.log( "PromotionTable data:", data?.data.data.items, " isLoading:", isLoading );
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
    )
}

export default PromotionTable