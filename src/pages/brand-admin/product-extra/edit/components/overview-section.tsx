import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useExtraProduct } from "@/hooks/use-extra-product";
import { handleApiError } from "@/lib/error";
import { ProductExtraSchema, type TProductExtra, type TUpdateProductExtra } from "@/schema/product-extra.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    initialData: TProductExtra;
}

const OverviewSection = ( {
    initialData,
}: Props ) =>
{

    const { updateExtraProductMutation } = useExtraProduct();

    const form = useForm<TProductExtra>( {
        resolver: zodResolver( ProductExtraSchema ),
        defaultValues: {
            ...initialData,
            description: initialData?.description ?? "",
        },
    } );

    const onSubmit = async ( data: TProductExtra ) =>
    {
        try
        {
            const updatedData: TUpdateProductExtra = {
                name: data.name,
                description: data.description,
                price: data.price,
                displayOrder: data.displayOrder,
                isActive: data.isActive,
            }
            await updateExtraProductMutation.mutateAsync( {
                extraProductId: initialData.id,
                data: updatedData,
            } );
            toast.success( "Cập nhật sản phẩm phụ thành công!" );
        } catch ( error )
        {
            form.reset();
            handleApiError( error );
        }
    };

    return (
        <Form { ...form }>
            <form className="relative" onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2">
                    <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                        <CardTitle>Thông Tin Cơ Bản</CardTitle>
                        <div className="flex justify-end items-center space-x-2">
                            <FormField
                                control={ form.control }
                                name="isActive"
                                render={ ( { field } ) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormLabel>Hoạt động</FormLabel>
                                        <FormControl>
                                            <Switch
                                                disabled={ updateExtraProductMutation.isPending }
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
                            <FormField
                                control={ form.control }
                                name="code"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mã sản phẩm phụ *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder="Nhập mã sản phẩm phụ"
                                                { ...field }
                                            />
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
                                            <Input
                                                disabled
                                                placeholder="Nhập mã SKU sản phẩm phụ"
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
                            name="name"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Tên sản phẩm phụ *</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={ updateExtraProductMutation.isPending }
                                            placeholder="Nhập tên sản phẩm phụ"
                                            { ...field }
                                        />
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
                                    <FormLabel>Giá sản phẩm phụ *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={ updateExtraProductMutation.isPending }
                                            placeholder="0"
                                            { ...field }
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
                            name="description"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Mô Tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={ updateExtraProductMutation.isPending }
                                            placeholder="Nhập mô tả sản phẩm phụ"
                                            className="min-h-[100px]"
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="displayOrder"
                            render={ ( { field } ) => (
                                <FormItem className="grid grid-cols-1 lg:grid-cols-1 items-center">
                                    <FormLabel>Thứ tự hiển thị *</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={ updateExtraProductMutation.isPending }
                                            placeholder="Thứ tự hiển thị"
                                            { ...field }
                                            onChange={ ( e ) =>
                                                field.onChange( Number( e.target.value ) )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </CardContent>
                </Card>
                <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                    <Button
                        className="mr-8 py-5 px-10"
                        type="submit"
                        disabled={ updateExtraProductMutation.isPending }
                    >
                        Lưu
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default OverviewSection