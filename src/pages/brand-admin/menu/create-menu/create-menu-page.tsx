import SuccessDialog from "@/components/dialog/success-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMenu } from "@/hooks/use-menu";
import { handleApiError } from "@/lib/error";
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { CreateBrandMenuSchema, type TCreateBrandMenu } from "@/schema/menu.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {}

const CreateMenuPage = ( _: Props ) =>
{
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { createBrandMenuMutation } = useMenu();

    const form = useForm<TCreateBrandMenu>( {
        resolver: zodResolver( CreateBrandMenuSchema ),
        defaultValues: {
            name: "",
            description: "",
            type: undefined,
        },
    } );

    const onSubmit = async ( data: TCreateBrandMenu ) =>
    {
        try
        {
            const result = await createBrandMenuMutation.mutateAsync( data );
            dispatch( handleSetCreatedId( result.data.data ) );
            dispatch( handleChangeModalState( true ) );
        } catch ( error )
        {
            handleApiError( error );
        }

    }

    return (
        <Form { ...form }>
            <SuccessDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Tạo thực đơn mới thành công"
                actionLabel="Xem thực đơn"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.product.editMenu( createdId ) );
                    }
                } }
            />
            <form className='relative' onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Tạo Thực đơn</h1>
                    </div>
                    <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2'>
                        {/* <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                            <CardTitle>Thông Tin Cơ Bản</CardTitle>
                        </CardHeader> */}
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4 ">
                                <FormField
                                    control={ form.control }
                                    name="name"
                                    render={ ( { field } ) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Tên Thực đơn *</FormLabel>
                                            <FormControl>
                                                <Input disabled={ createBrandMenuMutation.isPending } placeholder="Nhập tên" { ...field } />
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
                                            <Select disabled={ createBrandMenuMutation.isPending } onValueChange={ ( value ) => field.onChange( Number( value ) ) } defaultValue={ field.value?.toString() }>
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
                                                disabled={ createBrandMenuMutation.isPending }
                                                placeholder="Nhập ghi chú cho sản phẩm"
                                                className="min-h-[100px]"
                                                { ...field }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={ form.control }
                                    name="validFrom"
                                    render={ ( { field } ) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Có hiệu lực từ</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            disabled={ createBrandMenuMutation.isPending }
                                                            className={ cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            ) }
                                                        >
                                                            { field.value ? (
                                                                format( field.value, "dd/MM/yyyy HH:mm" )
                                                            ) : (
                                                                <span>Chọn ngày và giờ</span>
                                                            ) }
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={ field.value }
                                                        onSelect={ ( date ) =>
                                                        {
                                                            if ( date )
                                                            {
                                                                // If there's already a time set, preserve it
                                                                if ( field.value )
                                                                {
                                                                    const existingTime = field.value;
                                                                    date.setHours( existingTime.getHours() );
                                                                    date.setMinutes( existingTime.getMinutes() );
                                                                } else
                                                                {
                                                                    // Set default time to current time
                                                                    const now = new Date();
                                                                    date.setHours( now.getHours() );
                                                                    date.setMinutes( now.getMinutes() );
                                                                }
                                                            }
                                                            field.onChange( date );
                                                        } }
                                                        disabled={ ( date ) => date < new Date() }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />

                                <FormField
                                    control={ form.control }
                                    name="validTo"
                                    render={ ( { field } ) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Có hiệu lực đến</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            disabled={ createBrandMenuMutation.isPending }
                                                            className={ cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            ) }
                                                        >
                                                            { field.value ? (
                                                                format( field.value, "dd/MM/yyyy HH:mm" )
                                                            ) : (
                                                                <span>Chọn ngày và giờ</span>
                                                            ) }
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={ field.value }
                                                        onSelect={ ( date ) =>
                                                        {
                                                            if ( date )
                                                            {
                                                                // If there's already a time set, preserve it
                                                                if ( field.value )
                                                                {
                                                                    const existingTime = field.value;
                                                                    date.setHours( existingTime.getHours() );
                                                                    date.setMinutes( existingTime.getMinutes() );
                                                                } else
                                                                {
                                                                    // Set default time to end of day
                                                                    date.setHours( 23, 59 );
                                                                }
                                                            }
                                                            field.onChange( date );
                                                        } }
                                                        disabled={ ( date ) =>
                                                        {
                                                            const today = new Date();
                                                            today.setHours( 0, 0, 0, 0 );
                                                            const validFrom = form.getValues( "validFrom" );

                                                            // Disable dates before today
                                                            if ( date < today ) return true;

                                                            // If validFrom is set, disable dates before validFrom
                                                            if ( validFrom )
                                                            {
                                                                const validFromDate = new Date( validFrom );
                                                                validFromDate.setHours( 0, 0, 0, 0 );
                                                                return date < validFromDate;
                                                            }

                                                            return false;
                                                        } }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                    <Button className='mr-8 py-5 px-10' type="submit" disabled={ createBrandMenuMutation.isPending }>
                        Tạo
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateMenuPage