import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useProductVariant } from "@/hooks/use-product-variant";
import { handleApiError } from "@/lib/error";
import { UpdateProductVariantSchema, type TUpdateProductVariantRequest } from "@/schema/product-variant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    productId: string;
    productVariantId: string;
    initialData: TUpdateProductVariantRequest;
}

const OverviewProductVariant = ( {
    productId,
    productVariantId,
    initialData
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateProductVariantMutation } = useProductVariant();
    const form = useForm<TUpdateProductVariantRequest>( {
        resolver: zodResolver( UpdateProductVariantSchema ),
        defaultValues: {
            code: initialData.code,
            isActive: initialData.isActive,
            name: initialData.name,
            price: initialData.price,
            size: initialData.size,
            sku: initialData.sku,
            displayOrder: initialData.displayOrder,
        },
    } );

    const onSubmit = async ( data: TUpdateProductVariantRequest ) =>
    {
        const payload = {
            code: data.code,
            name: data.name,
            price: data.price,
            isActive: data.isActive,
            sku: data.sku ?? undefined,
            size: data.size,
            displayOrder: data.displayOrder,
        };

        try
        {
            await updateProductVariantMutation.mutateAsync( {
                id: productVariantId,
                data: payload,
            } );
            queryClient.invalidateQueries( {
                queryKey: [ "product-variant", productVariantId ],
            } );
            queryClient.invalidateQueries( {
                queryKey: [ "product", productId ],
            } );
            toast.success( "Cập nhật biến thể thành công!" );
            // navigate(-1);
        } catch ( error )
        {
            form.reset();
            handleApiError( error );
        }
    };
    return (
        <Form { ...form }>
            <form
                onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                {
                    console.error( "Form validation errors:", errors );
                } ) }
            >
                <div className="container pb-6">
                    <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2 gap-1">
                        <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                            <CardTitle>
                                <div className="flex flex-col items-start gap-2">
                                    Thông Tin Cơ Bản
                                    { initialData.recipeItems?.length === 0 && <span className="text-red-500 text-xs font-normal">
                                        (Chưa có công thức)
                                    </span> }

                                </div>
                            </CardTitle>
                            <div className="flex justify-end items-center space-x-2">
                                <FormField
                                    control={ form.control }
                                    name="isActive"
                                    render={ ( { field } ) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormLabel>Hoạt động</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    disabled={ updateProductVariantMutation.isPending }
                                                    checked={ field.value }
                                                    onCheckedChange={ field.onChange }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    ) }
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        control={ form.control }
                                        name="code"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Mã biến thể *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled
                                                            { ...field }
                                                            placeholder="Nhập mã biến thể"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        } }
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={ form.control }
                                        name="sku"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Mã SKU*</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled
                                                            { ...field }
                                                            placeholder="Nhập SKU biến thể"
                                                            value={ field.value ?? "" }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        } }
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={ form.control }
                                        name="name"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Tên biến thể *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            { ...field }
                                                            placeholder="Nhập tên biến thể"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        } }
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={ form.control }
                                        name="price"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Giá gốc *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            { ...field }
                                                            placeholder="Nhập giá gốc"
                                                            onChange={ ( e ) =>
                                                            {
                                                                field.onChange( Number( e.target.value ) );
                                                            } }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        } }
                                    />
                                </div>

                                <FormField
                                    control={ form.control }
                                    name="size"
                                    render={ ( { field } ) =>
                                    {
                                        return (
                                            <FormItem>
                                                <FormLabel>Kích cỡ *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        { ...field }
                                                        placeholder="Nhập kích cỡ"
                                                        value={ field.value ?? "" }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    } }
                                />
                                <FormField
                                    control={ form.control }
                                    name="displayOrder"
                                    render={ ( { field } ) =>
                                    {
                                        return (
                                            <FormItem>
                                                <FormLabel>Thứ tự hiển thị *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        { ...field }
                                                        placeholder="Nhập thứ tự hiển thị"
                                                        onChange={ ( e ) =>
                                                        {
                                                            field.onChange( Number( e.target.value ) );
                                                        } }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    } }
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                className="py-5 px-10"
                                type="submit"
                                disabled={ updateProductVariantMutation.isPending }
                            >
                                Lưu
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </Form >
    )
}

export default OverviewProductVariant