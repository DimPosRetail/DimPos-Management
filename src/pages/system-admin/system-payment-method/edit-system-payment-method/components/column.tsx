import { Button } from "@/components/ui/button";
import
    {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
import
    {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSystemPaymentMethod } from "@/hooks/use-payment-method-config";
import { handleApiError } from "@/lib/error";
import
    {
        UpdateSystemPaymentMethodSchema,
        type TUpdateSystemPaymentMethod,
        type TSystemPaymentMethod,
    } from "@/schema/payment-method-config.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { getPaymentMethodTypeLabel, PaymentMethodTypeEnum, type TPaymentMethodTypeEnum } from "@/types/enums/payment-method-type-enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";

type Props = {
    paymentMethod: TSystemPaymentMethod;
};

const DetailSystemPaymentMethod = ( { paymentMethod }: Props ) =>
{
    const { updateSystemPaymentMethod } = useSystemPaymentMethod();
    const [ previewImage, setPreviewImage ] = useState<string>( paymentMethod.logoUrl );

    const form = useForm<TUpdateSystemPaymentMethod>( {
        resolver: zodResolver( UpdateSystemPaymentMethodSchema ),
        defaultValues: {
            code: paymentMethod.code,
            name: paymentMethod.name,
            description: paymentMethod.description ?? "",
            type: paymentMethod.type,
            logo: undefined, // để user chọn file mới
            isGloballyActive: paymentMethod.isGloballyActive,
            configurationSchema: paymentMethod.configurationSchema,
        },
    } );
    const displayDate = paymentMethod.lastModifiedDate ?? paymentMethod.createdDate;
    const onSubmit = async ( data: TUpdateSystemPaymentMethod ) =>
    {
        try
        {
            const formData = new FormData();

            formData.append( "code", data.code );
            formData.append( "name", data.name );
            formData.append( "description", data.description ?? "" );
            formData.append( "type", String( data.type ) );
            formData.append( "isGloballyActive", String( data.isGloballyActive ) );
            formData.append(
                "configurationSchema",
                data.configurationSchema || "{}"
            );

            if ( data.logo instanceof File )
            {
                formData.append( "logo", data.logo );
            }

            await updateSystemPaymentMethod.mutateAsync( {
                id: paymentMethod.id,
                data: formData,
            } );

            toast.success( "Cập nhật phương thức thanh toán thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    };

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-6">

                <Card className="shadow-none border border-dashed bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Logo
                            { !previewImage && (
                                <>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.gif,.bmp,.webp"
                                        onChange={ ( e ) =>
                                        {
                                            const file = e.target.files?.[ 0 ];
                                            if ( file )
                                            {
                                                form.setValue( "logo", file );
                                                setPreviewImage( URL.createObjectURL( file ) );
                                            }
                                        } }
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={ () => document.getElementById( "logo-upload" )?.click() }
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Tải logo
                                    </Button>
                                </>
                            ) }
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="h-full">
                        <FormField
                            control={ form.control }
                            name="logo"
                            render={ ( { field } ) => (
                                <FormItem className="flex justify-center items-center">
                                    <FormControl>
                                        { !previewImage ? (
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer w-full"
                                                onClick={ () => document.getElementById( "logo-upload" )?.click() }
                                            >
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-600">Click để tải lên logo</p>
                                                <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG, GIF</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-32 h-32">
                                                <img
                                                    src={ previewImage }
                                                    alt="Xem trước logo"
                                                    className="w-full h-full object-contain border rounded bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={ () =>
                                                    {
                                                        field.onChange( null );
                                                        setPreviewImage( paymentMethod.logoUrl );
                                                    } }
                                                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100"
                                                >
                                                    <X className="w-3 h-3 text-red-500" />
                                                </button>
                                            </div>
                                        ) }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <FormField
                            control={ form.control }
                            name="code"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Mã phương thức *</FormLabel>
                                    <FormControl>
                                        <Input { ...field } placeholder="Nhập mã phương thức" disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        <FormField
                            control={ form.control }
                            name="name"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Tên phương thức *</FormLabel>
                                    <FormControl>
                                        <Input { ...field } placeholder="Nhập tên phương thức" />
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
                                    <FormLabel>Loại phương thức *</FormLabel>
                                    <Select
                                        disabled
                                        onValueChange={ ( val ) => field.onChange( Number( val ) ) }
                                        value={ String( field.value ) }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            { Object.keys( PaymentMethodTypeEnum )
                                                .filter( ( key ) => isNaN( Number( key ) ) )
                                                .map( ( key ) =>
                                                {
                                                    const value = PaymentMethodTypeEnum[ key as keyof typeof PaymentMethodTypeEnum ];
                                                    return (
                                                        <SelectItem key={ value } value={ String( value ) }>
                                                            { getPaymentMethodTypeLabel( value as TPaymentMethodTypeEnum ) }
                                                        </SelectItem>
                                                    );
                                                } ) }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        {/* Mô tả */ }
                        <FormField
                            control={ form.control }
                            name="description"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Input { ...field } placeholder="Nhập mô tả" value={ field.value ?? "" } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        <FormField
                            control={ form.control }
                            name="isGloballyActive"
                            render={ ( { field } ) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel>Kích hoạt toàn hệ thống</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={ field.value }
                                            onCheckedChange={ ( val ) => field.onChange( val ) }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />

                        <FormField
                            control={ form.control }
                            name="configurationSchema"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Cấu hình (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            { ...field }
                                            placeholder="Nhập cấu hình JSON"
                                            rows={ 5 }
                                            className="font-mono"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />



                        <FormItem>
                            <FormLabel>Ngày chỉnh sửa cuối</FormLabel>
                            <FormControl>
                                <Input
                                    value={ formatDate( displayDate ) }
                                    disabled
                                    readOnly
                                />
                            </FormControl>
                        </FormItem>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={ updateSystemPaymentMethod.isPending }>
                        Cập nhật
                    </Button>
                </div>
            </form>
        </Form>

    );
};

export default DetailSystemPaymentMethod;
