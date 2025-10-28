import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIngredient } from "@/hooks/use-ingredient";
import { handleApiError } from "@/lib/error";
import { UpdateIngredientSchema, type TUpdateIngredientRequest } from "@/schema/ingredients.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const EditIngredientPage = () =>
{
    const { id } = useParams<{ id: string }>();
    const { getIngredientById, updateIngredientMutation } = useIngredient();

    const { data: ingredient } = getIngredientById( id as string );
    const form = useForm<TUpdateIngredientRequest>( {
        resolver: zodResolver( UpdateIngredientSchema ),
        defaultValues: {
            code: ingredient.data.data.code,
            sku: ingredient.data.data.sku,
            name: ingredient.data.data.name,
            measureUnit: ingredient.data.data.measureUnit,
            description: ingredient.data.data.description || "",
            isActive: ingredient.data.data.isActive,
        }
    } )
    const onSubmit = async ( data: TUpdateIngredientRequest ) =>
    {
        const updatedData: Omit<TUpdateIngredientRequest, "code" | "sku"> = {
            name: data.name,
            measureUnit: data.measureUnit,
            description: data.description,
            isActive: data.isActive,
        };
        try
        {
            await updateIngredientMutation.mutateAsync( { id: id as string, data: updatedData } );
            toast.success( "Cập nhật thành phần thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <Form { ...form }>
            <form className='relative' onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">{ ingredient.data.data.name }</h1>
                    </div>
                    <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2'>
                        <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                            <CardTitle>
                                Thông tin thành phần
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
                                                    disabled={ updateIngredientMutation.isPending }
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
                                            <FormLabel>Mã thành phần *</FormLabel>
                                            <FormControl>
                                                <Input disabled placeholder="Nhập mã thành phần" { ...field } />
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
                                                    placeholder="Nhập mã SKU thành phần"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <FormField
                                    control={ form.control }
                                    name="name"
                                    render={ ( { field } ) => (
                                        <FormItem className="col-span-1 md:col-span-4">
                                            <FormLabel>Tên Thành Phần *</FormLabel>
                                            <FormControl>
                                                <Input disabled={ updateIngredientMutation.isPending } placeholder="Nhập tên thành phần" { ...field } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="measureUnit"
                                    render={ ( { field } ) => (
                                        <FormItem className="col-span-1 md:col-span-1">
                                            <FormLabel>Đơn vị tính *</FormLabel>
                                            <FormControl>
                                                <Input disabled={ updateIngredientMutation.isPending } placeholder="VD: gói, túi, cái" { ...field } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>
                            <FormField
                                control={ form.control }
                                name="description"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mô Tả *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={ updateIngredientMutation.isPending }
                                                placeholder="Nhập mô tả thành phần"
                                                className="min-h-[100px]"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                    <Button className='mr-8 py-5 px-10' type="submit" disabled={ updateIngredientMutation.isPending }>
                        Lưu
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EditIngredientPage