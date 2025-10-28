import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useComboProduct } from "@/hooks/use-combo-product"
import { handleApiError } from "@/lib/error";
import { formatPrice, getImagePreviewUrl } from "@/lib/utils";
import { CreateComboProductSchema, type TCreateComboProduct, type TCreateItemProductVariants } from "@/schema/combo-product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowOutUpRight, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";
import AddProductVariantDialog from "./components/add-product-variant-dialog";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import SuccessDialog from "@/components/dialog/success-dialog";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";

const CreateComboProductPage = () =>
{
    const { createComboProductMutation } = useComboProduct();
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const form = useForm<TCreateComboProduct>( {
        resolver: zodResolver( CreateComboProductSchema ),
    } );
    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray( {
        control: form.control,
        name: "productImages",
    } );
    const [ imagePreviewUrls, setImagePreviewUrls ] = useState<string[]>( [] );
    const [ isAddProductVariantDialogOpen, setIsAddProductVariantDialogOpen ] = useState( false );

    useEffect( () =>
    {
        const updatePreviews = async () =>
        {
            const urls = await Promise.all(
                imageFields.map( async ( field ) =>
                {
                    if ( field.image instanceof File )
                    {
                        return await getImagePreviewUrl( field.image );
                    }
                    return ""; // fallback for non-File objects
                } )
            );
            setImagePreviewUrls( urls );
        };

        updatePreviews();
    }, [ imageFields ] );
    const {
        fields: variantFields,
        append: appendVariant,
        // update: updateVariant,
        // remove: removeVariant,
    } = useFieldArray( {
        control: form.control,
        name: "itemProductVariants",
        keyName: "_id"
    } );

    const itemProductVariants: TCreateItemProductVariants = {
        itemProductVariants: variantFields.map( ( field ) => ( {
            productVariantId: field.productVariantId,
            productVariantName: field.productVariantName,
            quantity: field.quantity || 1,
            displayOrder: field.displayOrder || 0,
            unitPrice: field.unitPrice || 0,
        } ) )
    };

    const handleMainImageChange = ( selectedIndex: number, isChecked: boolean ) =>
    {
        if ( !isChecked )
        {
            if ( imageFields.length === 1 )
            {
                toast.error( "Phải có ít nhất một ảnh chính." );
                return;
            }

            imageFields.forEach( ( _, index ) =>
            {
                form.setValue( `productImages.${ index }.isMainImage`, index === 0 );
            } );
        } else
        {
            imageFields.forEach( ( _, index ) =>
            {
                form.setValue(
                    `productImages.${ index }.isMainImage`,
                    index === selectedIndex
                );
            } );
        }
    };

    const handleImageUpload = ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const files = event.target.files;
        if ( !files ) return;

        if ( imageFields.length + files.length > 4 )
        {
            toast.error( "Bạn chỉ có thể tải lên tối đa 4 hình ảnh." );
            return;
        }

        Array.from( files ).forEach( ( file ) =>
        {
            appendImage( {
                image: file,
                isMainImage: imageFields.length === 0,
            } );
        } );

        event.target.value = "";
    };

    const removeImagePreview = ( index: number ) =>
    {
        const currentImages = form.getValues( "productImages" );
        const isRemovedImageMain = currentImages?.[ index ]?.isMainImage;

        removeImage( index );

        if ( isRemovedImageMain && imageFields.length > 1 )
        {
            setTimeout( () =>
            {
                const updatedImages = form.getValues( "productImages" );
                if ( updatedImages && updatedImages.length > 0 )
                {
                    form.setValue( "productImages.0.isMainImage", true );
                    for ( let i = 1; i < updatedImages.length; i++ )
                    {
                        form.setValue( `productImages.${ i }.isMainImage`, false );
                    }
                }
            }, 0 );
        }
    };

    const onSubmit = async ( data: TCreateComboProduct ) =>
    {
        console.log( "Data: ", data );
        if ( createComboProductMutation.isPending ) return;
        if ( data.itemProductVariants.length < 2 )
        {
            toast.warning( "Combo phải có ít nhất 2 sản phẩm." );
            return;
        }

        // kiểm tra giá gốc nếu lớn hơn giá ước tính thì form setError ở value price
        const totalPrice = data.itemProductVariants.reduce( ( acc, item ) => acc + item.unitPrice! * item.quantity, 0 );
        console.log( "Total Price: ", totalPrice );
        console.log( "Data Price: ", data.price );
        if ( data.price > totalPrice )
        {
            form.setError( "price", {
                type: "manual",
                message: `Giá combo không được lớn hơn tổng giá của các sản phẩm trong combo (${ formatPrice( totalPrice ) })`,
            } );
            return;
        }

        const formData = new FormData();
        formData.append( "Code", data.code );
        formData.append( "Name", data.name );
        formData.append( "Price", data.price?.toString() || "0" );
        if ( data.description )
        {
            formData.append( "Description", data.description );
        }
        formData.append( "Sku", data.sku || "" );
        formData.append( "DisplayOrder", data.displayOrder?.toString() || "0" );
        formData.append( "Note", data.note || "" );
        if ( data.productImages && data.productImages.length > 0 )
        {
            data.productImages.forEach( ( imageData, index ) =>
            {
                if ( imageData.image )
                {
                    formData.append( `ProductImages[${ index }].Image`, imageData.image );
                }

                formData.append(
                    `ProductImages[${ index }].IsMainImage`,
                    imageData.isMainImage.toString()
                );
            } );
        }
        if ( data.itemProductVariants && data.itemProductVariants.length > 0 )
        {
            data.itemProductVariants.forEach( ( variant, index ) =>
            {
                formData.append( `ItemProductVariants[${ index }].ProductVariantId`, variant.productVariantId );
                formData.append( `ItemProductVariants[${ index }].Quantity`, variant.quantity.toString() );
                formData.append( `ItemProductVariants[${ index }].DisplayOrder`, variant.displayOrder?.toString() || "0" );
            } );
        }
        try
        {
            const result = await createComboProductMutation.mutateAsync( formData );
            dispatch( handleSetCreatedId( result.data.data ) );
            dispatch( handleChangeModalState( true ) );
        }
        catch ( error )
        {
            handleApiError( error );
        }
    };


    const handleAddProductVariants = ( variants: TCreateItemProductVariants ) =>
    {
        form.setValue( "itemProductVariants", [] );
        variants.itemProductVariants.forEach( ( variant ) =>
        {
            appendVariant( {
                productVariantId: variant.productVariantId,
                productVariantName: variant.productVariantName,
                quantity: variant.quantity || 1,
                displayOrder: variant.displayOrder || 0,
                unitPrice: variant.unitPrice || 0,
            } );
        } );
        // setIsAddProductVariantDialogOpen( false );
    }
    return (
        <Form { ...form }>
            <SuccessDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Tạo combo mới thành công"
                actionLabel="Xem combo"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.combo.edit( createdId ) );
                    }
                } }
            />
            <form className="relative" onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Tạo Combo Mới</h1>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                            <FormLabel>Mã Combo *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={ createComboProductMutation.isPending }
                                                    placeholder="Nhập mã Combo"
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
                                                    disabled={ createComboProductMutation.isPending }
                                                    placeholder="Nhập mã SKU Combo"
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
                                        <FormLabel>Tên Combo *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ createComboProductMutation.isPending }
                                                placeholder="Nhập tên Combo"
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
                                        <FormLabel>Giá combo *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ createComboProductMutation.isPending }
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={ form.control }
                                    name="description"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Mô Tả</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={ createComboProductMutation.isPending }
                                                    placeholder="Nhập mô tả Combo"
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
                                    name="note"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Ghi chú</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={ createComboProductMutation.isPending }
                                                    placeholder="Nhập ghi chú cho Combo"
                                                    className="min-h-[100px]"
                                                    { ...field }
                                                    value={ field.value ?? "" }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>
                            <FormField
                                control={ form.control }
                                name="displayOrder"
                                render={ ( { field } ) => (
                                    <FormItem className="grid grid-cols-1 lg:grid-cols-1 items-center">
                                        <FormLabel>Thứ tự hiển thị *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ createComboProductMutation.isPending }
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
                    <div className="grid lg:col-span-2 xl:col-span-1 gap-4">
                        <Card className="shadow-none bg-white border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Ảnh Combo
                                    <div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={ ( e ) =>
                                            {
                                                console.log( "File input changed:", e.target.files );
                                                handleImageUpload( e );
                                            } }
                                            className="hidden"
                                            id="image-upload"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        disabled={ createComboProductMutation.isPending }
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={ () =>
                                        {
                                            console.log( "Upload button clicked" );
                                            document.getElementById( "image-upload" )?.click();
                                        } }
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Tải lên ảnh
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                { imageFields.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <PhotoProvider>
                                            { imageFields.map( ( field, index ) => (
                                                <div key={ field.id } className="relative">
                                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                        { imagePreviewUrls[ index ] && (
                                                            <PhotoView src={ imagePreviewUrls[ index ] }>
                                                                <img
                                                                    src={ imagePreviewUrls[ index ] }
                                                                    alt={ `Preview ${ index }` }
                                                                    className="w-full h-full object-cover hover:cursor-pointer"
                                                                />
                                                            </PhotoView>
                                                        ) }
                                                    </div>
                                                    <Button
                                                        disabled={ createComboProductMutation.isPending }
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                        onClick={ () => removeImagePreview( index ) }
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                    <div className="mt-2 space-y-2">
                                                        <FormField
                                                            control={ form.control }
                                                            name={ `productImages.${ index }.isMainImage` }
                                                            render={ ( { field } ) => (
                                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            disabled={
                                                                                createComboProductMutation.isPending
                                                                            }
                                                                            checked={ field.value }
                                                                            onCheckedChange={ ( checked ) =>
                                                                            {
                                                                                handleMainImageChange(
                                                                                    index,
                                                                                    checked as boolean
                                                                                );
                                                                            } }
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-xs">
                                                                        Ảnh chính
                                                                    </FormLabel>
                                                                </FormItem>
                                                            ) }
                                                        />
                                                    </div>
                                                </div>
                                            ) ) }
                                        </PhotoProvider>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                        onClick={ () =>
                                            document.getElementById( "image-upload" )?.click()
                                        }
                                    >
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            Kéo thả thêm ảnh hoặc click để chọn
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi file)
                                        </p>
                                    </div>
                                ) }
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border-none bg-white gap-0">
                            <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                <CardTitle>Sản phẩm trong combo <span className="text-red-50 text-sm font-normal">{ `(${ variantFields?.length } sản phẩm)` }</span></CardTitle>
                                <AddProductVariantDialog
                                    isOpen={ isAddProductVariantDialogOpen }
                                    onOpenChange={ setIsAddProductVariantDialogOpen }
                                    onSave={ handleAddProductVariants }
                                    isSubmitting={ createComboProductMutation.isPending }
                                    initialData={ itemProductVariants }
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-auto"
                                        type="button"
                                        disabled={ createComboProductMutation.isPending }
                                        onClick={ () =>
                                        {
                                            setIsAddProductVariantDialogOpen( true );
                                        } }
                                    >
                                        { variantFields?.length > 0 ? "Chỉnh sửa" : "Thêm" }
                                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </AddProductVariantDialog>
                            </CardHeader>
                            <CardContent>
                                {/* Giá ước tính sẽ được hiển thị trong phần này */ }
                                { variantFields.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-sm text-muted-foreground">
                                            Giá ước tính:{ " " }
                                            <span className="font-semibold text-red-500">
                                                { formatPrice(
                                                    variantFields.reduce(
                                                        ( total, item ) =>
                                                            total + ( item.unitPrice || 0 ) * ( item.quantity || 1 ),
                                                        0
                                                    )
                                                ) }
                                            </span>
                                        </p>
                                    </div>
                                ) }
                                <ScrollArea className="max-h-[200px] overflow-y-auto w-full">
                                    <div className="mx-1">
                                        { variantFields.length > 0 ? variantFields.map( ( variant, index ) => (
                                            <div
                                                key={ index }
                                                className="p-3 my-2 border rounded-lg relative group bg-secondary/30"
                                                onClick={ () =>
                                                {
                                                    // setIsModifierGroupsDialogOpen( true );
                                                } }
                                            >
                                                <p className="text-base font-semibold">{ variant.productVariantName }</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    SL: <span className="font-mono text-red-500">
                                                        { variant.quantity }
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Giá bán đơn: <span className="font-mono text-red-500">
                                                        { formatPrice( variant.unitPrice ?? 0 ) }
                                                    </span>
                                                </p>

                                            </div>
                                        ) ) : (
                                            <div className="flex items-center justify-center text-gray-500 text-sm text-center min-h-10">
                                                Chưa có sản phẩm nào được thêm vào combo.
                                            </div>
                                        ) }
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                    <Button
                        className="mr-8 py-5 px-10"
                        type="submit"
                        disabled={ createComboProductMutation.isPending }
                    >
                        Tạo
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateComboProductPage