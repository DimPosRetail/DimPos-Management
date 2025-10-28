import { DataTable } from "@/components/table/data-table";
import { useIngredient } from "@/hooks/use-ingredient";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./ingredient-table/column";

const IngredientTable = () =>
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
        defaultSortBy: "isActive",
        defaultIsAsc: false,
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

    const { getIngredients } = useIngredient()
    const { data, isLoading, isError, error } = getIngredients( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
        code: filter.find( f => f.id === "code" )?.value as string || "",
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;
    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên thành phần" : f.id === "code" ? "Tìm kiếm theo mã thành phần" : "",
    } ) )
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

export default IngredientTable