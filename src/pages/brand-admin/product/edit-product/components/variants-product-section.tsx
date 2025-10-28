import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TProductVariantResponse } from '@/schema/product-variant.schema';
import { EyeOff, Plus } from 'lucide-react';
import AddProductVariantDialog from './add-product-variant-dialog';
import VariantProductForm from './variant-product-form';
import { useProduct } from '@/hooks/use-product';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/error';
import ConfirmDialog from '@/components/dialog/confirm-dialog';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { handleChangeModalState } from '@/redux/modal/modal-slice';

type Props = {
    isProductActive: boolean;
    productId: string;
    initialData: TProductVariantResponse[];
}

const VariantsProductSection = ( { isProductActive, productId, initialData }: Props ) =>
{
    const { isOpen } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { inactivateVariantsMutation } = useProduct();
    const handleInactivateVariants = async () =>
    {
        try
        {
            await inactivateVariantsMutation.mutateAsync( productId );
            queryClient.invalidateQueries( {
                queryKey: [ "product", productId ],
            } );
            toast.success( "Đã vô hiệu hóa các biến thể sản phẩm." );
        } catch ( error )
        {
            handleApiError( error );
        }

    }

    return (
        <Card className='shadow-none border-none bg-white lg:col-span-2 2xl:col-span-6 mb-6'>
            <ConfirmDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Xác nhận vô hiệu hóa biến thể"
                description="Bạn có chắc chắn muốn vô hiệu hóa các biến thể sản phẩm này không?"
                actionLabel="Xác nhận"
                onAction={ handleInactivateVariants }
            />
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Biến Thể Sản Phẩm
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={ !isProductActive }
                            type="button"
                            onClick={ () => { dispatch( handleChangeModalState( true ) ); } }
                        >
                            <EyeOff className="w-4 h-4 mr-2" />
                            Vô hiệu hóa các biến Thể
                        </Button>
                        <AddProductVariantDialog
                            productId={ productId }
                        >
                            <Button
                                type="button"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm Biến Thể
                            </Button>
                        </AddProductVariantDialog>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                { initialData.length > 0 ? (
                    <div className="space-y-4">
                        { initialData.map( ( field, index ) => (
                            <VariantProductForm
                                key={ index }
                                productId={ productId }
                                initialData={ field as any }
                            />
                        ) ) }
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Chưa có biến thể nào. Click "Thêm Biến Thể" để tạo mới.</p>
                    </div>
                ) }
            </CardContent>
        </Card>
    )
}

export default VariantsProductSection