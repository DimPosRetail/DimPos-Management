import { DataTable } from '@/components/table/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useMenu } from '@/hooks/use-menu';
import { useQueryParams } from '@/hooks/use-query-params';
import { useStore } from '@/hooks/use-store';
import { handleApiError } from '@/lib/error';
import { UpdateDetailStoreMenuSchema, type TUpdateDetailStoreMenu } from '@/schema/store.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { productColumns } from './columns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    storeMenuId: string;
    isOpen: boolean;
    onOpenChange: ( isOpen: boolean ) => void;
}

const DetailStoreMenuDialog = ( {
    storeMenuId,
    isOpen,
    onOpenChange,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setPage,
        setSort,
        setPageSize,
    } = useQueryParams();
    const { getStoreMenuByMenuId, updateStoreMenuItemMutation } = useStore();
    const { getProductsByBrandMenuId } = useMenu();
    const { data: storeMenu } = getStoreMenuByMenuId( storeMenuId as string );
    const { data: productsData, isError, error, isLoading } = getProductsByBrandMenuId( storeMenu.data.data.brandMenu.id, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
    } );

    const form = useForm<TUpdateDetailStoreMenu>( {
        resolver: zodResolver( UpdateDetailStoreMenuSchema ),
        defaultValues: {
            productVariantIds: storeMenu.data.data.storeMenuItems?.map( item => item.productVariant.id ) || []
        },
    } )


    if ( isError && error )
    {
        handleApiError( error );
    }

    const onSubmit = async ( data: TUpdateDetailStoreMenu ) =>
    {
        console.log( "Submitted data:", data );
        try
        {
            await updateStoreMenuItemMutation.mutateAsync( {
                storeMenuId: storeMenuId as string,
                data,
            } );
            queryClient.invalidateQueries( { queryKey: [ "detailStoreMenu", storeMenuId ] } );
            toast.success( "Cập nhật thực đơn thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }

    const items = productsData?.data.data.items || [];
    const total = productsData?.data.data.total || 0;
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    };

    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const currentProductVariantIds = ( form.getValues( "productVariantIds" ) as string[] );

        const newlySelected = Object.entries( newSelection )
            .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        const newlyDeselected = Object.entries( oldSelection )
            .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        let updatedIds = [ ...currentProductVariantIds ];

        newlySelected.forEach( id =>
        {
            if ( !updatedIds.includes( id ) )
            {
                updatedIds.push( id );
            }
        } );

        updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

        form.setValue( "productVariantIds", updatedIds );

    }

    return (

        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] overflow-x-scroll">
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Chi tiết thực đơn</DialogTitle>
                            <DialogDescription>
                                Thông tin chi tiết về thực đơn tại cửa hàng.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mb-4'>
                            <DataTable
                                columns={ productColumns }
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
                                rowSelection={
                                    items.reduce<Record<string, boolean>>( ( acc, item ) =>
                                    {
                                        acc[ item.id ] = ( form.watch( "productVariantIds" ) as string[] ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () =>
                            {
                                form.reset();
                                onOpenChange( false );
                            } }>Hủy</Button>
                            <Button type="submit" disabled={ updateStoreMenuItemMutation.isPending || ( form.watch( "productVariantIds" ) as string[] ).length === ( storeMenu.data.data.storeMenuItems?.map( ( item ) => item.productVariant.id ) || [] ).length &&
                                JSON.stringify( [ ...( form.watch( "productVariantIds" ) as string[] ) ].sort() ) === JSON.stringify( [ ...( storeMenu.data.data.storeMenuItems?.map( ( item ) => item.productVariant.id ) || [] ) ].sort() ) }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default DetailStoreMenuDialog
