import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProductVariant } from '@/hooks/use-product-variant';
import { handleApiError } from '@/lib/error';
import { RecipeItemSchema, type TRecipeItemResponse } from '@/schema/product-variant.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: TRecipeItemResponse | null;
    productVariantId: string;
}

const EditRecipeItemDialog = ( {
    initialData,
    isOpen,
    onOpenChange,
    productVariantId,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateRecipeItemMutation } = useProductVariant();
    const form = useForm<TRecipeItemResponse>( {
        resolver: zodResolver( RecipeItemSchema ),
        defaultValues: {
            id: "",
            quantity: 1,
            ingredient: {
                id: "",
                name: "",
                measureUnit: "",
            },
        },
    } );
    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset( initialData ||
            {
                id: "",
                quantity: 1,
                ingredient: {
                    id: "",
                    name: "",
                    measureUnit: "",
                },
            } );

        }
    }, [ isOpen, initialData, form ] );
    const onSubmit = async ( data: TRecipeItemResponse ) =>
    {
        if ( !initialData )
        {
            toast.error( "Không có dữ liệu ban đầu để cập nhật" );
            return;
        }
        // Handle form submission logic here
        console.log( 'Submitted data:', data );
        const updatedData = {
            quantity: data.quantity,
        }
        try
        {
            await updateRecipeItemMutation.mutateAsync( {
                productVariantId,
                recipeItemId: initialData.id,
                data: updatedData,
            } );
            toast.success( "Cập nhật số lượng thành công" );
            queryClient.invalidateQueries( {
                queryKey: [ 'recipeItems', productVariantId ],
            } );
            onOpenChange( false );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] overflow-x-scroll rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa số lượng thành phần</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa số lượng thành phần cho công thức.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                    {
                        console.error( "Form validation errors:", errors );
                    } ) } noValidate>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                                control={ form.control }
                                name="ingredient.code"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã Thành phần *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ true }
                                                placeholder="Nhập mã thành phần"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="ingredient.sku"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã SKU *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ true }
                                                placeholder="Mã SKU"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-4'>
                            <FormField
                                control={ form.control }
                                name="ingredient.name"
                                render={ ( { field } ) => (
                                    <FormItem className='col-span-1 md:col-span-4'>
                                        <FormLabel>Tên Thành phần *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ true }
                                                placeholder="Nhập tên thành phần"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="ingredient.measureUnit"
                                render={ ( { field } ) => (
                                    <FormItem className='col-span-1'>
                                        <FormLabel>Đơn vị tính *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ true }
                                                placeholder="Nhập đơn vị tính"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>

                        <FormField
                            control={ form.control }
                            name="quantity"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Số lượng *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            disabled={ updateRecipeItemMutation.isPending }
                                            placeholder="Nhập số lượng"
                                            { ...field }
                                            onChange={ ( e ) =>
                                            {
                                                const value = e.target.value;
                                                // Allow empty string and valid decimal patterns
                                                if ( value === '' || /^\d*\.?\d*$/.test( value ) )
                                                {
                                                    field.onChange( value === '' ? undefined : parseFloat( value ) || 0 );
                                                }
                                            } }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                            <Button type="submit" disabled={ updateRecipeItemMutation.isPending }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditRecipeItemDialog