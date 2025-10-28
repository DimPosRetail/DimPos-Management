import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExtraProduct } from "@/hooks/use-extra-product";
import { handleApiError } from "@/lib/error";
import type { TCreateProductExtra } from "@/schema/product-extra.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CreateProductExtraSchema } from '../../../../schema/product-extra.schema';
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import SuccessDialog from "@/components/dialog/success-dialog";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";

const CreateProductExtraPage = () =>
{
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const { createExtraProductMutation } = useExtraProduct();
    const form = useForm<TCreateProductExtra>( {
        resolver: zodResolver( CreateProductExtraSchema ),
    } );

    const onSubmit = async ( data: TCreateProductExtra ) =>
    {
        try
        {
            const result = await createExtraProductMutation.mutateAsync( data );
            dispatch( handleSetCreatedId( result.data.data ) );
            dispatch( handleChangeModalState( true ) );
            form.reset();
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
                title="Tạo sản phẩm phụ mới thành công"
                actionLabel="Xem sản phẩm phụ"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.extra.edit( createdId ) );
                    }
                } }
            />
            <form className="relative" onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Tạo sản phẩm phụ mới</h1>
                </div>
                <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2">
                    <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                        <CardTitle>Thông Tin Cơ Bản</CardTitle>
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
                                                disabled={ createExtraProductMutation.isPending }
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
                                                disabled={ createExtraProductMutation.isPending }
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
                                            disabled={ createExtraProductMutation.isPending }
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
                                            disabled={ createExtraProductMutation.isPending }
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
                                            disabled={ createExtraProductMutation.isPending }
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
                                            disabled={ createExtraProductMutation.isPending }
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
                        disabled={ createExtraProductMutation.isPending }
                    >
                        Tạo
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateProductExtraPage