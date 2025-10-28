import { DataTable } from "@/components/table/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-variant-table/columns";
import { useProductVariant } from "@/hooks/use-product-variant";

const ProductVariantTable = () =>
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
                id: "code",
                value: "",
            }, {
                id: "sku",
                value: null,
            },
        ],
        defaultSortBy: "code",
    } );

    const { getProductVariants } = useProductVariant()
    const { data, isLoading, isError, error } = getProductVariants( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        code: filter.find( f => f.id === "code" )?.value as string || "",
        sku: filter.find( f => f.id === "sku" )?.value as string || null,
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "code" ? "Tìm kiếm theo mã sản phẩm" : f.id === "sku" ? "Tìm kiếm theo SKU" : "",
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

export default ProductVariantTable