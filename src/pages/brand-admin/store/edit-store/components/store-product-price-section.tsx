import { DataTable } from '@/components/table/data-table';
import { useQueryParams } from '@/hooks/use-query-params';
import { useStore } from '@/hooks/use-store';
import { handleApiError } from '@/lib/error';
import { useState } from 'react';
import { productPriceColumns } from './columns';
import StoreProductPriceDialog from './store-product-price-dialog';
import StorePriceHistoryDialog from './store-price-history-dialog';

type Props = {
    storeId: string;
}

const StoreProductPriceSection = ( {
    storeId,
}: Props ) =>
{
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setPage,
        setSort,
        setPageSize,
        resetParams,
    } = useQueryParams();
    const { getStoreProductsByStoreId } = useStore();
    const { data: productsPriceData, isError, error, isLoading } = getStoreProductsByStoreId( storeId, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
    } );
    if ( isError && error )
    {
        handleApiError( error );
    }
    const items = productsPriceData?.data.data.items || [];
    const total = productsPriceData?.data.data.total || 0;
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    };
    const [ storeProductId, setStoreProductId ] = useState<string | null>( null );
    const [ productVariantId, setProductVariantId ] = useState<string | null>( null );
    const onShowDetailPrice = ( storeProductId: string ) =>
    {
        setStoreProductId( storeProductId );
    }
    const onShowPriceHistory = ( productVariantId: string ) =>
    {
        resetParams();
        setProductVariantId( productVariantId );
    }
    return (
        <div>
            <DataTable
                columns={ productPriceColumns( onShowDetailPrice, onShowPriceHistory ) }
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
            {
                storeProductId &&
                <StoreProductPriceDialog
                    storeId={ storeId }
                    storeProductId={ storeProductId }
                    onOpenChange={ ( isOpen ) =>
                    {
                        if ( !isOpen )
                        {
                            setStoreProductId( null );
                        }
                    } }
                    isOpen={ !!storeProductId }
                    currencyCode={ items.find( productPrice => productPrice.id === storeProductId )?.currencyCode || "VND" }
                    overridePrice={ items.find( productPrice => productPrice.id === storeProductId )?.overridePrice || 0 }
                />
            }
            {
                productVariantId &&
                <StorePriceHistoryDialog
                    storeId={ storeId }
                    productVariantId={ productVariantId }
                    setOpen={ ( isOpen ) =>
                    {
                        if ( !isOpen )
                        {
                            resetParams();
                            setProductVariantId( null );
                        }
                    } }
                    open={ !!productVariantId }
                />
            }
        </div>
    )
}

export default StoreProductPriceSection