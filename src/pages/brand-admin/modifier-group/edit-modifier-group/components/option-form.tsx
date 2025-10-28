import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useProduct } from '@/hooks/use-product';
import { handleApiError } from '@/lib/error';
import { UpdateModifierOptionSchema, type TUpdateModifierOptionRequest } from '@/schema/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
    isDisabled: boolean;
    optionId: string;
    initialData: TUpdateModifierOptionRequest;
}

const OptionForm = ( {
    isDisabled = false,
    optionId,
    initialData
}: Props ) =>
{
    const { updateModifierOptionMutation } = useProduct();
    const form = useForm<TUpdateModifierOptionRequest>( {
        resolver: zodResolver( UpdateModifierOptionSchema ),
        defaultValues: initialData,
    } )

    const onSubmit = async ( data: TUpdateModifierOptionRequest ) =>
    {
        try
        {
            await updateModifierOptionMutation.mutateAsync( {
                id: optionId,
                data
            } );
            toast.success( "Cập nhật tùy chọn thành công" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <Card className='border-dashed shadow-none bg-white gap-3 '>
            <CardContent>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <div
                            className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center"
                        >
                            <FormField
                                control={ form.control }
                                name="name"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Tên tùy chọn *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên tùy chọn" { ...field } disabled={ updateModifierOptionMutation.isPending || isDisabled } />
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
                                            <Input placeholder="Nhập mô tả" { ...field } disabled={ updateModifierOptionMutation.isPending || isDisabled } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="isActive"
                                render={ ( { field } ) => (
                                    <FormItem className="flex flex-col justify-center items-center">
                                        <FormLabel>Trạng thái</FormLabel>
                                        <FormControl>
                                            <Switch
                                                disabled={ updateModifierOptionMutation.isPending || isDisabled }
                                                checked={ field.value }
                                                onCheckedChange={ field.onChange }
                                            />
                                        </FormControl>
                                    </FormItem>
                                ) }
                            />
                            <Button
                                type="submit"
                                disabled={ updateModifierOptionMutation.isPending || isDisabled }
                                className="max-w-2/3"
                            >
                                { updateModifierOptionMutation.isPending ? "Đang cập nhật..." : "Cập nhật" }
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default OptionForm