import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/use-product";
import { handleApiError } from "@/lib/error";
import { AddProductVariantSchema, type TAddProductVariantRequest } from "@/schema/product-variant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    productId: string;
    children: ReactNode;
}

const AddProductVariantDialog = ( {
    productId,
    children,
}: Props ) =>
{
    const [ open, setOpen ] = useState( false );

    const { addVariantIntoProductMutation } = useProduct();

    const form = useForm<TAddProductVariantRequest>( {
        resolver: zodResolver( AddProductVariantSchema ),
        defaultValues: {
            code: "",
            name: "",
            description: null,
            sku: "",
            price: undefined,
            size: "",
            displayOrder: undefined,
        },
    } );
    const onSubmit = async ( data: TAddProductVariantRequest ) =>
    {
        // Call the mutation to add the variant to the product
        // await addVariantIntoProductMutation.mutateAsync( { id: productId, data } );
        console.log( "Adding variant:", data );
        try
        {
            await addVariantIntoProductMutation.mutateAsync( { id: productId, data } );
            setOpen( false ); // Close the dialog after successful submission
            toast.success( "Thêm biến thể sản phẩm thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    };
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
                    <DialogDescription>
                        Điền thông tin cho biến thể. Biến thể sẽ được thêm vào sản phẩm.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form id="add-variant-form" onSubmit={ form.handleSubmit( onSubmit ) } noValidate className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={ form.control }
                                name="code"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã biến thể *</FormLabel>
                                        <FormControl>
                                            <Input disabled={ addVariantIntoProductMutation.isPending } placeholder="Mã định danh" { ...field } />
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
                                            <Input disabled={ addVariantIntoProductMutation.isPending } placeholder="Mã SKU" { ...field } />
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
                                        <Input disabled={ addVariantIntoProductMutation.isPending } placeholder="Vd: Size L, Màu đỏ" { ...field } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="price"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Giá biến thể *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={ addVariantIntoProductMutation.isPending }
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
                                            disabled={ addVariantIntoProductMutation.isPending }
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
                                            <Input disabled={ addVariantIntoProductMutation.isPending } placeholder="Vd: L, XL" { ...field } value={ field.value ?? "" } />
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
                                                disabled={ addVariantIntoProductMutation.isPending }
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="submit" form="add-variant-form" disabled={ addVariantIntoProductMutation.isPending }>
                                Thêm biến thể
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddProductVariantDialog