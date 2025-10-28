import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/use-product";
import { handleApiError } from "@/lib/error";
import { UpdateModifierGroupSchema, type TUpdateModifierGroupRequest } from "@/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    modifierGroupId: string;
    initialData: TUpdateModifierGroupRequest;
}

const OverviewSection = ( {
    modifierGroupId,
    initialData,
}: Props ) =>
{
    const { updateModifierGroupMutation } = useProduct();

    const form = useForm<TUpdateModifierGroupRequest>( {
        resolver: zodResolver( UpdateModifierGroupSchema ),
        defaultValues: initialData,
    } );

    const onSubmit = async ( data: TUpdateModifierGroupRequest ) =>
    {
        try
        {
            await updateModifierGroupMutation.mutateAsync( { id: modifierGroupId, data } );
            toast.success( "Cập nhật nhóm tùy chọn thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }

    return (
        <Form { ...form }>
            <form
                className="relative"
                onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                {
                    console.error( "Form validation errors:", errors );
                } ) }
                noValidate
            >

                <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2'>
                    <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                        <CardTitle>
                            Thông tin nhóm tùy chọn
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
                                                disabled={ updateModifierGroupMutation.isPending }
                                                checked={ field.value }
                                                onCheckedChange={ field.onChange }
                                            />
                                        </FormControl>
                                    </FormItem>
                                ) }
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <FormField
                                control={ form.control }
                                name="name"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Tên nhóm *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ updateModifierGroupMutation.isPending }
                                                placeholder="Nhập tên nhóm"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="selectedType"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Hình thức chọn *</FormLabel>
                                        <Select disabled={ updateModifierGroupMutation.isPending } onValueChange={ ( value ) => field.onChange( Number( value ) ) } defaultValue={ field.value?.toString() }>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn hình thức" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">Một</SelectItem>
                                                <SelectItem value="1">Nhiều</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="displayOrder"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Thứ tự hiển thị *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ updateModifierGroupMutation.isPending }
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
                        <FormField
                            control={ form.control }
                            name="description"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={ updateModifierGroupMutation.isPending }
                                            placeholder="Nhập mô tả"
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </CardContent>
                    <CardFooter className='grid grid-cols-1 md:grid-cols-1 items-center gap-4'>
                        <div className="flex justify-end">
                            <Button disabled={ updateModifierGroupMutation.isPending } variant="default" className="w-32">
                                Cập nhật
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

            </form>
        </Form>
    )
}

export default OverviewSection