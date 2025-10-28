import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UpdateCampaignSchema, type TUpdateCampaignRequest } from '@/schema/campaign.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
type Props = {
    initialData: TUpdateCampaignRequest;
};

const OverviewCampaign = ( { initialData }: Props ) =>
{

    const form = useForm<TUpdateCampaignRequest>( {
        resolver: zodResolver( UpdateCampaignSchema ),
        defaultValues: {
            ...initialData,
            startDate: initialData.startDate ? new Date( initialData.startDate ) : undefined,
            endDate: initialData.endDate ? new Date( initialData.endDate ) : undefined
        },
    } );

    const onSubmit = async ( _: TUpdateCampaignRequest ) =>
    {

    };
    return (
        <Form { ...form }>
            <form
                className="relative"
                onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                {
                    console.error( "Form validation errors:", errors );
                } ) }
            >
                <div className="container pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 gap-2">
                        <Card className="shadow-none border-none bg-white gap-3">
                            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center'>
                                <CardTitle>
                                    Thông tin chiến dịch
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
                                                        disabled
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
                                <div>
                                    <FormField
                                        control={ form.control }
                                        name="name"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Tên chiến dịch *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            { ...field }
                                                            disabled
                                                            value={ field.value ?? "" }
                                                            placeholder="Nhập tên chiến dịch"
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
                                        name="description"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Mô tả</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            { ...field }
                                                            disabled
                                                            value={ field.value ?? "" }
                                                            placeholder="Mô tả chiến dịch"
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
                                        name="priority"
                                        render={ ( { field } ) =>
                                        {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Thứ tự hiển thị</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            { ...field }
                                                            disabled
                                                            type="number"
                                                            value={ field.value ?? 0 }
                                                            placeholder="Độ ưu tiên"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        } }
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                                        <FormField
                                            control={ form.control }
                                            name="startDate"
                                            render={ ( { field } ) =>
                                            {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Ngày bắt đầu *</FormLabel>
                                                        <FormControl>
                                                            <DateTimePicker
                                                                date={ field.value ? new Date( field.value ) : undefined }
                                                                setDate={ field.onChange }
                                                                placeholder="Chọn ngày bắt đầu"
                                                                disabled
                                                                toDate={ form.watch( "endDate" ) ? new Date( form.watch( "endDate" ) ) : undefined }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            } }
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                                        <FormField
                                            control={ form.control }
                                            name="endDate"
                                            render={ ( { field } ) =>
                                            {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Ngày kết thúc *</FormLabel>
                                                        <FormControl>
                                                            <DateTimePicker
                                                                date={ field.value ? new Date( field.value ) : undefined }
                                                                setDate={ field.onChange }
                                                                placeholder="Chọn ngày kết thúc"
                                                                disabled
                                                                fromDate={ form.watch( "startDate" ) ? new Date( form.watch( "startDate" ) ) : undefined }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            } }
                                        />
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}

export default OverviewCampaign