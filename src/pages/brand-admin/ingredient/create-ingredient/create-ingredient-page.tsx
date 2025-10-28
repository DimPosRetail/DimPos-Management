import SuccessDialog from "@/components/dialog/success-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useIngredient } from "@/hooks/use-ingredient"
import { handleApiError } from "@/lib/error"
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice"
import type { RootState } from "@/redux/store"
import { PATH_BRAND_DASHBOARD } from "@/routes/path"
import { CreateIngredientSchema, type TCreateIngredientRequest } from "@/schema/ingredients.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const CreateIngredientPage = () =>
{
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { createIngredientMutation } = useIngredient();
    const form = useForm<TCreateIngredientRequest>( {
        resolver: zodResolver( CreateIngredientSchema ),
        defaultValues: {
            code: "",
            sku: "",
            name: "",
            measureUnit: "",
            description: undefined,
        }
    } )
    const onSubmit = async ( data: TCreateIngredientRequest ) =>
    {
        console.log( "Submitted data:", data );
        try
        {
            const result = await createIngredientMutation.mutateAsync( data );
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
                title="Tạo thành phần mới thành công"
                actionLabel="Xem thành phần"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.ingredient.edit( createdId ) )
                    }
                } }
            />
            <form className='relative' onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Tạo Thành Phần Mới</h1>
                    </div>
                    <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2'>
                        <CardHeader>
                            <CardTitle>
                                Thông tin thành phần
                            </CardTitle>
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
                                                <Input disabled={ createIngredientMutation.isPending } placeholder="Nhập mã thành phần" { ...field } />
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
                                                    disabled={ createIngredientMutation.isPending }
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
                                                <Input disabled={ createIngredientMutation.isPending } placeholder="Nhập tên thành phần" { ...field } />
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
                                                <Input disabled={ createIngredientMutation.isPending } placeholder="VD: gói, túi, cái" { ...field } />
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
                                        <FormLabel>Mô Tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={ createIngredientMutation.isPending }
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
                    <Button className='mr-8 py-5 px-10' type="submit" disabled={ createIngredientMutation.isPending }>
                        Tạo
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateIngredientPage