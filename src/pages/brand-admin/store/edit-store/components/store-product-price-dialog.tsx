import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStore } from '@/hooks/use-store';
import { handleApiError } from '@/lib/error';
import { UpdateStoreProductPriceSchema, type TUpdateStoreProductPrice } from '@/schema/store.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
    isOpen: boolean;
    onOpenChange: ( isOpen: boolean ) => void;
    storeId: string;
    storeProductId: string;
    currencyCode?: string;
    overridePrice?: number;
}

const StoreProductPriceDialog = ( {
    isOpen,
    onOpenChange,
    storeId,
    storeProductId,
    currencyCode,
    overridePrice,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateStoreProductPriceMutation } = useStore();
    const form = useForm<TUpdateStoreProductPrice>( {
        resolver: zodResolver( UpdateStoreProductPriceSchema ),
        defaultValues: {
            currencyCode: currencyCode,
            overridePrice: overridePrice,
        },
    } )
    const onSubmit = async ( data: TUpdateStoreProductPrice ) =>
    {
        try
        {
            await updateStoreProductPriceMutation.mutateAsync( {
                storeProductId: storeProductId,
                data,
            } );
            queryClient.invalidateQueries( {
                queryKey: [ "storeProducts", storeId ],
            } );
            toast.success( "Cập nhật giá sản phẩm thành công!" );
            onOpenChange( false );
        }
        catch ( error )
        {
            handleApiError( error );
        }
    };
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] overflow-x-scroll">
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Chi tiết giá sản phẩm</DialogTitle>
                            <DialogDescription>
                                Quản lý giá sản phẩm trong cửa hàng của bạn.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                            <FormField
                                control={ form.control }
                                name="overridePrice"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Giá bán *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ updateStoreProductPriceMutation.isPending }
                                                placeholder="Giá bán"
                                                { ...field }
                                                value={ field.value ?? '' }
                                                onChange={ ( e ) =>
                                                    field.onChange( Number( e.target.value ) )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="currencyCode"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã tiền tệ *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ updateStoreProductPriceMutation.isPending }
                                                placeholder="Mã tiền tệ"
                                                { ...field }
                                                value={ field.value ?? '' }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () =>
                            {
                                form.reset();
                                onOpenChange( false );
                            } }>Hủy</Button>
                            <Button type="submit" disabled={ updateStoreProductPriceMutation.isPending }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default StoreProductPriceDialog