import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useComboProduct } from '@/hooks/use-combo-product';
import { handleApiError } from '@/lib/error';
import { UpdateComboProductItemSchema, type TComboProductItem, type TUpdateComboProductItem } from '@/schema/combo-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: TComboProductItem | null;
    comboProductId: string;
}

const EditComboProductItemDialog = ( {
    initialData,
    isOpen,
    onOpenChange,
    comboProductId,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateComboProductItemMutation } = useComboProduct();
    const form = useForm<TUpdateComboProductItem>( {
        resolver: zodResolver( UpdateComboProductItemSchema ),
        defaultValues: {
            quantity: initialData?.quantity || 1,
            displayOrder: initialData?.displayOrder || 1,
        },
    } );

    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset( initialData || {
                quantity: 1,
                displayOrder: 1,
            } );
        }
    }, [ isOpen, initialData, form ] );

    const onSubmit = async ( data: TUpdateComboProductItem ) =>
    {
        if ( !initialData )
        {
            toast.error( "Không có dữ liệu ban đầu để cập nhật" );
            return;
        }
        try
        {
            await updateComboProductItemMutation.mutateAsync( {
                comboProductItemId: initialData.id,
                data: {
                    quantity: data.quantity,
                    displayOrder: data.displayOrder,
                },
            } );
            queryClient.invalidateQueries( { queryKey: [ "combo-product", comboProductId ] } );
            toast.success( "Cập nhật thành công" );
            onOpenChange( false );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] overflow-x-scroll">
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Điều chỉnh sản phẩm trong combo</DialogTitle>
                            <DialogDescription>
                                Chỉnh sửa số lượng và thứ tự hiển thị của sản phẩm trong combo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                            <FormField
                                control={ form.control }
                                name="displayOrder"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Thứ tự hiển thị *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ updateComboProductItemMutation.isPending }
                                                placeholder="Thứ tự hiển thị"
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
                                name="quantity"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Số lượng *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ updateComboProductItemMutation.isPending }
                                                placeholder="Số lượng"
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
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () =>
                            {
                                form.reset();
                                onOpenChange( false );
                            } }>Hủy</Button>
                            <Button type="button" disabled={ updateComboProductItemMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default EditComboProductItemDialog