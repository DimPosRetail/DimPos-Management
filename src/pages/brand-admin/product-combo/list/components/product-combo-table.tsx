import { DataTable } from "@/components/table/data-table";
import { useComboProduct } from "@/hooks/use-combo-product";
import { useQueryParams } from "@/hooks/use-query-params"
import { handleApiError } from "@/lib/error";
import { columns } from "./product-combo/columns";

const ProductComboTable = () =>
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
        defaultSortBy: "displayOrder",
        defaultIsAsc: false,
    } );
    const { getComboProductsQuery } = useComboProduct();
    const { data, isLoading, isError, error } = getComboProductsQuery( {
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
            onPageChange={ setPage }
            onPageSizeChange={ setPageSize }
        />
    )
}

export default ProductComboTable