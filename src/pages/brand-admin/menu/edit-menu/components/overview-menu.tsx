import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMenu } from "@/hooks/use-menu";
import { handleApiError } from "@/lib/error";
import { UpdateBrandMenuSchema, type TBrandMenu, type TUpdateBrandMenu } from "@/schema/menu.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    initialData: TBrandMenu
}

const OverviewMenu = ( { initialData }: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateBrandMenuMutation } = useMenu();
    const form = useForm<TUpdateBrandMenu>( {
        resolver: zodResolver( UpdateBrandMenuSchema ),
        defaultValues: {
            name: initialData.name,
            description: initialData.description || "",
            type: initialData.type,
        },
    } )
    const onsubmit = async ( data: TUpdateBrandMenu ) =>
    {
        console.log( data );
        try
        {
            await updateBrandMenuMutation.mutateAsync( {
                id: initialData.id,
                data
            } );
            queryClient.invalidateQueries( { queryKey: [ 'brandMenu', initialData.id ] } );
            toast.success( "Cập nhật thực đơn thành công" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onsubmit ) } noValidate>
                <Card className='border-none shadow-none bg-white lg:col-span-2 xl:col-span-2 gap-3 my-4'>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <FormField
                                control={ form.control }
                                name="name"
                                render={ ( { field } ) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Tên Thực đơn *</FormLabel>
                                        <FormControl>
                                            <Input disabled={ updateBrandMenuMutation.isPending } placeholder="Nhập tên" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="type"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Loại Menu *</FormLabel>
                                        <Select disabled={ updateBrandMenuMutation.isPending } onValueChange={ ( value ) => field.onChange( Number( value ) ) } defaultValue={ field.value?.toString() }>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">Theo mùa</SelectItem>
                                                <SelectItem value="1">Theo thời gian</SelectItem>
                                                <SelectItem value="2">Tiêu chuẩn</SelectItem>
                                                <SelectItem value="3">Khuyến mại</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={ updateBrandMenuMutation.isPending }
                                            placeholder="Nhập ghi chú cho sản phẩm"
                                            className="min-h-[100px]"
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </CardContent>
                    <CardFooter className='grid grid-cols-1 md:grid-cols-1 items-center gap-4'>
                        <div className="flex justify-end mt-10">
                            <Button disabled={ updateBrandMenuMutation.isPending } variant="default" className="w-32">
                                Cập nhật
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}

export default OverviewMenu