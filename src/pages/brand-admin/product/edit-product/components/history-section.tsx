import { DataTable } from '@/components/table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductVariant } from '@/hooks/use-product-variant';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { brandPriceHistoryColumns } from './column';

type Props = {
    productVariantId: string;
}

const HistorySection = ( {
    productVariantId
}: Props ) =>
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
        defaultSortBy: 'changedAt',
        defaultIsAsc: false,
    } );

    const { getBrandPriceHistory } = useProductVariant();
    const { data, isLoading, isError, error } = getBrandPriceHistory( productVariantId, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

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
        <Card className='shadow-none border-none bg-white gap-1'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Lịch sử thay đổi giá sản phẩm
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    isShort
                    columns={ brandPriceHistoryColumns }
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
            </CardContent>
        </Card>
    )
}

export default HistorySection