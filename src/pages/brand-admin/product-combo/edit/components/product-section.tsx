import { DataTable } from '@/components/table/data-table';
import type { TComboProductItem } from '@/schema/combo-product.schema'
import { columns } from './columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleArrowOutUpRight } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useQueryClient } from '@tanstack/react-query';
import { useComboProduct } from '@/hooks/use-combo-product';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/error';
import ConfirmDialog from '@/components/dialog/confirm-dialog';
import { handleChangeModalState } from '@/redux/modal/modal-slice';
import EditComboProductItemDialog from './edit-combo-product-item-dialog';
import AddComboProductItemDialog from './add-combo-product-item-dialog';

type Props = {
    comboProductId: string;
    initialData: TComboProductItem[];
}

const ProductSection = ( {
    comboProductId,
    initialData
}: Props ) =>
{
    const { isOpen } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { deleteComboProductItemMutation } = useComboProduct();

    const [ comboProductItem, setComboProductItem ] = useState<TComboProductItem | null>( null );
    const [ comboProductItemId, setComboProductItemId ] = useState<string | null>( null );

    const handleConfirmSubmit = async () =>
    {
        if ( initialData.length === 2 )
        {
            toast.error( "Số lượng sản phẩm trong combo phải ít nhất là 2 sản phẩm" );
            return;
        }
        if ( comboProductItemId )
        {
            try
            {
                await deleteComboProductItemMutation.mutateAsync( { productId: comboProductId, comboProductItemId } );
                queryClient.invalidateQueries( { queryKey: [ "combo-product", comboProductId ] } );
                setComboProductItemId( null );
                toast.success( "Xóa thành phần thành công" );
            } catch ( error )
            {
                handleApiError( error );
            }
        }
    }

    return (
        <Card className='shadow-none border-none bg-white gap-1'>
            <ConfirmDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Xác nhận xóa sản phẩm"
                description="Bạn có chắc chắn muốn xóa sản phẩm trong combo này không?"
                actionLabel="Xác nhận"
                onAction={ handleConfirmSubmit }
            />
            <EditComboProductItemDialog
                initialData={ comboProductItem }
                isOpen={ !!comboProductItem }
                onOpenChange={ ( open ) => setComboProductItem( open ? comboProductItem : null ) }
                comboProductId={ comboProductId }
            />
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Danh sách các sản phẩm trong combo
                </CardTitle>
                <AddComboProductItemDialog
                    productComboId={ comboProductId }
                    existedProductVariantIds={ initialData.map( item => item.productVariant.id ) }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Thêm sản phẩm
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </AddComboProductItemDialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={ columns(
                        ( data: TComboProductItem ) => { setComboProductItem( data ) },
                        ( comboProductItemId: string ) =>
                        {
                            setComboProductItemId( comboProductItemId );
                            dispatch( handleChangeModalState( true ) );
                        }
                    ) }
                    data={ initialData }
                    isLoading={ false }
                    totalItems={ initialData.length }
                    pageSize={ 10 }
                    currentPage={ 1 }
                    onPageChange={ () => { } }
                    onPageSizeChange={ () => { } }
                    isPagingProp={ false }
                />
            </CardContent>
        </Card>
    )
}

export default ProductSection