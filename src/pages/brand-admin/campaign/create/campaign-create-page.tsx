import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker"; // Add this import
import { useCampaign } from "@/hooks/use-campaign";
import { handleApiError } from "@/lib/error";
import { CreateCampaignSchema, type TCreateCampaignRequest } from "@/schema/campaign.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import SuccessDialog from "@/components/dialog/success-dialog";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";

const CampaignCreatePage = () =>
{
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { createCampaign } = useCampaign();
    const form = useForm<TCreateCampaignRequest>( {
        resolver: zodResolver( CreateCampaignSchema ),
    } );

    const onSubmit = async ( data: TCreateCampaignRequest ) =>
    {
        // try
        // {
        try
        {
            const formattedData = {
                ...data,
                startDate: new Date( data.startDate.getTime() - ( data.startDate.getTimezoneOffset() * 60000 ) ),
                endDate: new Date( data.endDate.getTime() - ( data.endDate.getTimezoneOffset() * 60000 ) ),
            };
            const result = await createCampaign.mutateAsync( formattedData );
            dispatch( handleSetCreatedId( result.data.data ) );
            dispatch( handleChangeModalState( true ) );
        } catch ( e )
        {
            handleApiError( e );
        }
        // await createCampaign.mutateAsync( data );
        // } catch ( e )
        // {
        //     handleApiError( e );
        // }
    };
    return (
        <div>
            <SuccessDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Tạo chiến dịch mới thành công"
                actionLabel="Xem chiến dịch"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.campaign.editCampaign( createdId ) );
                    }
                } }
            />
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Tạo chiến dịch khuyến mãi mới</h1>
            </div>
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
                                                                disabled={ createCampaign.isPending }
                                                                { ...field }
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
                                                                disabled={ createCampaign.isPending }
                                                                { ...field }
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
                                                        <FormLabel>Thứ tự hiển thị *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                disabled={ createCampaign.isPending }
                                                                { ...field }
                                                                type="number"
                                                                value={ field.value }
                                                                onChange={ ( e ) =>
                                                                {
                                                                    field.onChange( Number( e.target.value ) );
                                                                } }
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
                                                            <FormLabel>Ngày bắt đầu</FormLabel>
                                                            <FormControl>
                                                                <DateTimePicker
                                                                    date={ field.value ? new Date( field.value ) : undefined }
                                                                    setDate={ field.onChange }
                                                                    placeholder="Chọn ngày bắt đầu"
                                                                    disabled={ createCampaign.isPending }
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
                                                            <FormLabel>Ngày kết thúc</FormLabel>
                                                            <FormControl>
                                                                <DateTimePicker
                                                                    date={ field.value ? new Date( field.value ) : undefined }
                                                                    setDate={ field.onChange }
                                                                    placeholder="Chọn ngày kết thúc"
                                                                    disabled={ createCampaign.isPending }
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
                    <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                        <Button
                            className="mr-8 py-5 px-10"
                            type="submit"
                            disabled={ createCampaign.isPending }
                        >
                            Tạo chiến dịch
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CampaignCreatePage