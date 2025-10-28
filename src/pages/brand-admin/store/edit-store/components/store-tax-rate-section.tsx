import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryParams } from '@/hooks/use-query-params';
import { useStore } from '@/hooks/use-store';
import { handleApiError } from '@/lib/error';
import { storeTaxRateColumns } from './columns';
import AddStoreTaxRateDialog from './add-store-tax-rate-dialog';
import EditStoreTaxRateDialog from './edit-store-tax-rate-dialog';
import { useState } from 'react';
import type { TStoreTaxRate } from '@/schema/store.schema';

type Props = {
    storeId: string;
}

const StoreTaxRateSection = ( {
    storeId
}: Props ) =>
{
    const [ selectedTaxRate, setSelectedTaxRate ] = useState<TStoreTaxRate | null>( null );
    const [ editDialogOpen, setEditDialogOpen ] = useState( false );

    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setPage,
        setPageSize,
    } = useQueryParams( {
        defaultSortBy: "createdDate",
        defaultIsAsc: false,
    } );
    const { getStoreTaxRates } = useStore();
    const { data: taxRatesData, isLoading: taxRatesLoading, isError: isTaxRatesError, error: taxRatesError } =
        getStoreTaxRates(
            storeId,
            {
                page: currentPage,
                size: pageSize,
                sortBy,
                isAsc,
            }
        );
    if ( isTaxRatesError && taxRatesError )
    {
        handleApiError( taxRatesError );
    }
    const items = taxRatesData?.data.data.items ?? [];
    const total = taxRatesData?.data.data.total ?? 0;

    const handleShowEditDialog = ( taxRateId: string ) =>
    {
        const taxRate = items.find( item => item.id === taxRateId );
        if ( taxRate )
        {
            setSelectedTaxRate( taxRate );
            setEditDialogOpen( true );
        }
    }

    return (
        <>
            <Card className='shadow-none border-none bg-white gap-1'>
                <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                    <CardTitle>
                        Danh sách thuế của cửa hàng
                    </CardTitle>
                    <AddStoreTaxRateDialog
                        storeId={ storeId }
                    >
                        <Button className="ml-auto" type="button">
                            + Thêm thuế
                        </Button>
                    </AddStoreTaxRateDialog>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={ storeTaxRateColumns( handleShowEditDialog ) }
                        data={ items }
                        totalItems={ total }
                        currentPage={ currentPage }
                        pageSize={ pageSize }
                        onPageChange={ setPage }
                        onPageSizeChange={ setPageSize }
                        isLoading={ taxRatesLoading }
                    />
                </CardContent>
            </Card>

            { selectedTaxRate && (
                <EditStoreTaxRateDialog
                    storeId={ storeId }
                    taxRate={ selectedTaxRate }
                    open={ editDialogOpen }
                    onOpenChange={ setEditDialogOpen }
                />
            ) }
        </>
    )
}

export default StoreTaxRateSection