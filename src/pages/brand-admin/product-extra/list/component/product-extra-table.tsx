import { DataTable } from "@/components/table/data-table";
import { useExtraProduct } from "@/hooks/use-extra-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { columns } from "./product-extra-table/column";

const ProductExtraTable = () =>
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
        defaultSortBy: "displayOrder",
        defaultIsAsc: false,
        defaultFilter: [
            {
                id: "name",
                value: "",
            },
            {
                id: "sku",
                value: "",
            },
        ]
    } );

    const { getExtraProductsQuery } = useExtraProduct();
    const { data, isLoading, isError, error } = getExtraProductsQuery( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
        sku: filter.find( f => f.id === "sku" )?.value as string || "",
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên sản phẩm phụ" : f.id === "sku" ? "Tìm kiếm theo mã SKU" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    };
    return (
        <DataTable
            columns={ columns }
            data={ items }
            isLoading={ isLoading }
            totalItems={ total }
            pageSize={ pageSize }
            currentPage={ currentPage }
            sortValues={ [ sortValue ] }
            onSortChange={ ( newSort ) =>
            {
                setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
            } }
            onSearchChange={ setFilter }
            searchValues={ searchValues }
            onPageChange={ setPage }
            onPageSizeChange={ setPageSize }
        />
    )
}

export default ProductExtraTable