import { DataTable } from "@/components/table/data-table";
import { useProduct } from "@/hooks/use-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-table/column";

const ProductTable = () =>
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
            {
                id: "code",
                value: "",
            },
        ]
    } );

    const { getProducts } = useProduct()
    const { data, isLoading, isError, error } = getProducts( {
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
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên sản phẩm" : f.id === "code" ? "Tìm kiếm theo mã sản phẩm" : "",
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

export default ProductTable