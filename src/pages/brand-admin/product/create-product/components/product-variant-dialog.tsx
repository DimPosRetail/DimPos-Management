import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { CreateProductVariantSchema, type TCreateProductVariantRequest } from '../../../../../schema/product-variant.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type ProductVariantDialogProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: TCreateProductVariantRequest;
    onSave: ( data: TCreateProductVariantRequest ) => void;
    isSubmitting?: boolean;
}

const ProductVariantDialog = ( {
    children,
    isOpen,
    onOpenChange,
    initialData,
    onSave,
    isSubmitting = false,
}: ProductVariantDialogProps ) =>
{
    const form = useForm<TCreateProductVariantRequest>( {
        resolver: zodResolver( CreateProductVariantSchema ),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            sku: "",
            brandPrice: undefined,
            size: "",
            displayOrder: undefined,
        },
    } );

    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset( initialData || {
                code: "",
                name: "",
                description: null,
                sku: "",
                brandPrice: undefined,
                size: "",
                displayOrder: undefined,
            } );
        }
    }, [ isOpen, initialData, form ] );

    const handleFormSubmit = ( data: TCreateProductVariantRequest ) =>
    {
        onSave( data );
        onOpenChange( false );
    };
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogTrigger asChild>{ children }</DialogTrigger>
            <DialogContent className="sm:max-w-[625px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>{ initialData ? 'Chỉnh sửa' : 'Thêm' } biến thể sản phẩm</DialogTitle>
                    <DialogDescription>
                        Điền thông tin cho biến thể. Biến thể sẽ được thêm vào sản phẩm.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form id="add-variant-form" className="space-y-4 py-4" onSubmit={ form.handleSubmit( handleFormSubmit ) }>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={ form.control }
                                name="code"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã biến thể *</FormLabel>
                                        <FormControl>
                                            <Input disabled={ isSubmitting } placeholder="Mã định danh" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="sku"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã SKU *</FormLabel>
                                        <FormControl>
                                            <Input disabled={ isSubmitting } placeholder="Mã SKU" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>
                        <FormField
                            control={ form.control }
                            name="name"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Tên biến thể *</FormLabel>
                                    <FormControl>
                                        <Input disabled={ isSubmitting } placeholder="Vd: Size L, Màu đỏ" { ...field } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="brandPrice"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Giá biến thể *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={ isSubmitting }
                                            placeholder="Nhập giá biến thể"
                                            { ...field }
                                            onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="description"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={ isSubmitting }
                                            placeholder="Mô tả chi tiết cho biến thể"
                                            { ...field }
                                            value={ field.value ?? "" }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={ form.control }
                                name="size"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Kích thước</FormLabel>
                                        <FormControl>
                                            <Input disabled={ isSubmitting } placeholder="Vd: L, XL" { ...field } value={ field.value ?? "" } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="displayOrder"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Thứ tự hiển thị</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ isSubmitting }
                                                placeholder="Nhập thứ tự hiển thị"
                                                { ...field }
                                                onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                    <Button type="button" form="add-variant-form" disabled={ isSubmitting } onClick={ form.handleSubmit( handleFormSubmit ) }>
                        { initialData ? 'Lưu thay đổi' : 'Thêm biến thể' }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProductVariantDialog