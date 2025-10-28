import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useComboProduct } from '@/hooks/use-combo-product';
import { handleApiError } from '@/lib/error';
import { formatPrice, getImagePreviewUrl, validateImageFile } from '@/lib/utils';
import { UpdateComboProductSchema, type TComboProduct, type TUpdateComboProduct } from '@/schema/combo-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';

type Props = {
    initialData?: TComboProduct;
}

const OverviewSection = ( {
    initialData
}: Props ) =>
{
    const queryClient = useQueryClient();
    const [ newImagePreviewUrls, setNewImagePreviewUrls ] = useState<string[]>( [] );
    const { updateComboProductMutation } = useComboProduct();
    const form = useForm<TUpdateComboProduct>( {
        resolver: zodResolver( UpdateComboProductSchema ),
        defaultValues: {
            ...initialData,
            description: initialData?.description ?? "",
            note: initialData?.note ?? "",
            code: initialData?.code ?? "",
            name: initialData?.name ?? "",
            sku: initialData?.sku ?? "",
        }
    } )
    const onSubmit = async ( data: TUpdateComboProduct ) =>
    {
        // kiểm tra giá gốc nếu lớn hơn giá ước tính của comboProductItems thì form setError ở value price
        const totalPrice = initialData!.comboProductItems!.reduce( ( acc, item ) => acc + item.productVariant.price! * item.quantity, 0 );
        if ( data.price > totalPrice )
        {
            form.setError( "price", {
                type: "manual",
                message: `Giá gốc không được lớn hơn tổng giá của các sản phẩm trong Combo. Tổng giá hiện tại là ${ totalPrice } VNĐ.`,
            } );
            return;
        }


        // Handle form submission logic here
        console.log( "Form submitted with data:", data );
        const formData = new FormData();
        formData.append( "code", data.code );
        formData.append( "sku", data.sku );
        formData.append( "name", data.name );
        if ( data.description )
        {
            formData.append( "description", data.description );
        }
        formData.append( "note", data.note || "" );
        formData.append( "price", data.price.toString() );
        formData.append( "displayOrder", data.displayOrder?.toString() || "0" );
        formData.append( "isActive", data.isActive ? "true" : "false" );
        if ( data.productImages && data.productImages.length > 0 )
        {
            data.productImages.forEach( ( imageData, index ) =>
            {
                formData.append(
                    `ExistComboProductImages[${ index }].ID`,
                    imageData.id.toString()
                );
                formData.append(
                    `ExistComboProductImages[${ index }].IsMainImage`,
                    imageData.isMainImage.toString()
                );
            } );
        }
        if ( data.newProductImages && data.newProductImages.length > 0 )
        {
            data.newProductImages.forEach( ( imageData, index ) =>
            {
                if ( imageData.image )
                {
                    formData.append(
                        `NewComboProductImages[${ index }].Image`,
                        imageData.image
                    );
                }
                formData.append(
                    `NewComboProductImages[${ index }].IsMainImage`,
                    imageData.isMainImage.toString()
                );
            } );
        }
        try
        {
            await updateComboProductMutation.mutateAsync( {
                comboProductId: initialData?.id as string,
                data: formData,
            } );
            queryClient.invalidateQueries( { queryKey: [ "combo-product", initialData?.id as string ] } );
            toast.success( "Cập nhật Combo sản phẩm thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }

    }

    const { fields: imageFields, remove: removeImage } = useFieldArray( {
        control: form.control,
        name: "productImages",
        keyName: "_id",
    } );


    const {
        fields: newImageFields,
        append: appendNewImage,
        remove: removeUpdatedImage,
    } = useFieldArray( {
        control: form.control,
        name: "newProductImages",
    } );
    useEffect( () =>
    {
        const updateNewImagePreviews = async () =>
        {
            const urls = await Promise.all(
                newImageFields.map( async ( field ) =>
                {
                    if ( field.image instanceof File )
                    {
                        return await getImagePreviewUrl( field.image );
                    }
                    return "";
                } )
            );
            setNewImagePreviewUrls( urls );
        };

        updateNewImagePreviews();
    }, [ newImageFields ] );

    const handleImageUpload = ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const files = event.target.files;
        if ( !files ) return;

        const totalImages = imageFields.length + newImageFields.length;
        const availableSlots = 4 - totalImages;

        if ( availableSlots <= 0 )
        {
            toast.error( "Bạn chỉ có thể tải lên tối đa 4 hình ảnh." );
            return;
        }

        const filesToProcess = Array.from( files ).slice( 0, availableSlots );

        filesToProcess.forEach( ( file ) =>
        {
            // Validate each file
            const validationError = validateImageFile( file );
            if ( validationError )
            {
                toast.error( `${ file.name }: ${ validationError }` );
                return;
            }

            // Determine if this should be the main image
            const isMainImage = totalImages === 0 && newImageFields.length === 0;

            appendNewImage( {
                image: file,
                isMainImage,
            } );
        } );

        // Reset the input value
        event.target.value = "";
    };

    const removeExistingImage = ( index: number ) =>
    {
        const wasMainImage = form.getValues( `productImages.${ index }.isMainImage` );
        removeImage( index );

        if ( wasMainImage )
        {
            if ( imageFields.length > 1 )
            {
                const nextIndex = index === 0 ? 1 : 0;
                form.setValue( `productImages.${ nextIndex }.isMainImage`, true );
            } else if ( newImageFields.length > 0 )
            {
                form.setValue( `newProductImages.0.isMainImage`, true );
            }
        }
    };

    const removeNewImage = ( index: number ) =>
    {
        const wasMainImage = form.getValues(
            `newProductImages.${ index }.isMainImage`
        );
        removeUpdatedImage( index );

        if ( wasMainImage )
        {
            if ( newImageFields.length > 1 )
            {
                const nextIndex = index === 0 ? 1 : 0;
                form.setValue( `newProductImages.${ nextIndex }.isMainImage`, true );
            } else if ( imageFields.length > 0 )
            {
                form.setValue( `productImages.0.isMainImage`, true );
            }
        }
    };

    const handleMainImageChange = (
        imageIndex: number,
        isExisting: boolean,
        isChecked: boolean
    ) =>
    {
        if ( !isChecked )
        {
            const totalImages = imageFields.length + newImageFields.length;
            if ( totalImages === 1 )
            {
                toast.error( "Phải có ít nhất một ảnh chính." );
                return;
            }
        }

        if ( isChecked )
        {
            imageFields.forEach( ( _, index ) =>
            {
                form.setValue( `productImages.${ index }.isMainImage`, false );
            } );

            newImageFields.forEach( ( _, index ) =>
            {
                form.setValue( `newProductImages.${ index }.isMainImage`, false );
            } );

            if ( isExisting )
            {
                form.setValue( `productImages.${ imageIndex }.isMainImage`, true );
            } else
            {
                form.setValue( `newProductImages.${ imageIndex }.isMainImage`, true );
            }
        } else
        {
            if ( imageFields.length > 0 )
            {
                form.setValue( `productImages.0.isMainImage`, true );
            } else if ( newImageFields.length > 0 )
            {
                form.setValue( `newProductImages.0.isMainImage`, true );
            }
        }
    };
    const totalImages = imageFields.length + newImageFields.length;
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
                <div className="container pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2 gap-1">
                            <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                <CardTitle>Thông Tin Cơ Bản</CardTitle>
                                <div className="flex justify-end items-center space-x-2">
                                    <FormField
                                        control={ form.control }
                                        name="isActive"
                                        render={ ( { field } ) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormLabel>Hoạt động</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        disabled={ updateComboProductMutation.isPending }
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={ form.control }
                                        name="code"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Mã Combo *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled
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
                                                        disabled
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
                                                    disabled={ updateComboProductMutation.isPending }
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
                                            <FormLabel>Giá gốc *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={ updateComboProductMutation.isPending }
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
                                {/* hiển thị giá ước tính không cần formfield */ }
                                <div className="flex items-center space-x-2">
                                    <FormLabel>Giá ước tính</FormLabel>
                                    <span className="text-sm text-blue-500">
                                        { formatPrice( initialData?.comboProductItems?.reduce(
                                            ( acc, item ) =>
                                                acc + item.productVariant.price! * item.quantity,
                                            0
                                        ) ?? 0 ) }
                                    </span>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={ form.control }
                                        name="description"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Mô Tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={ updateComboProductMutation.isPending }
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
                                                        disabled={ updateComboProductMutation.isPending }
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
                                                    disabled={ updateComboProductMutation.isPending }
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
                            <Card className="shadow-none border-none bg-white gap-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Ảnh Combo
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={ handleImageUpload }
                                                className="hidden"
                                                id="image-upload"
                                            // disabled={ totalImages >= 4 }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            disabled={ updateComboProductMutation.isPending }
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
                                <CardContent className="h-full">
                                    { totalImages > 0 ? (
                                        <div className="space-y-4">
                                            <PhotoProvider>
                                                {/* Existing Images */ }
                                                { ( imageFields.length > 0 ||
                                                    newImageFields.length > 0 ) && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            { imageFields.map( ( field, index ) => (
                                                                <div key={ field.id } className="relative">
                                                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                                        <PhotoView src={ imageFields[ index ].imageUrl }>
                                                                            <img
                                                                                src={ imageFields[ index ].imageUrl }
                                                                                className="w-full h-full object-cover hover:cursor-pointer"
                                                                            />
                                                                        </PhotoView>
                                                                    </div>
                                                                    <Button
                                                                        disabled={ updateComboProductMutation.isPending }
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                                        onClick={ () => removeExistingImage( index ) }
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
                                                                                            disabled={ updateComboProductMutation.isPending }
                                                                                            checked={ field.value }
                                                                                            onCheckedChange={ ( checked ) =>
                                                                                                handleMainImageChange(
                                                                                                    index,
                                                                                                    true,
                                                                                                    checked as boolean
                                                                                                )
                                                                                            }
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
                                                            { newImageFields.map( ( field, index ) =>
                                                            {
                                                                return (
                                                                    <div key={ field.id } className="relative">
                                                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={ newImagePreviewUrls[ index ] }
                                                                                alt={ `New ${ index }` }
                                                                                className="w-full h-full object-cover hover:cursor-pointer"
                                                                            />
                                                                        </div>
                                                                        <Button
                                                                            disabled={ updateComboProductMutation.isPending }
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                                            onClick={ () => removeNewImage( index ) }
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                        <div className="mt-2 space-y-2">
                                                                            <FormField
                                                                                control={ form.control }
                                                                                name={ `newProductImages.${ index }.isMainImage` }
                                                                                render={ ( { field } ) => (
                                                                                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                disabled={ updateComboProductMutation.isPending }
                                                                                                checked={ field.value }
                                                                                                onCheckedChange={ ( checked ) =>
                                                                                                    handleMainImageChange(
                                                                                                        index,
                                                                                                        false,
                                                                                                        checked as boolean
                                                                                                    )
                                                                                                }
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
                                                                );
                                                            } ) }
                                                        </div>
                                                    ) }
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
                        </div>
                    </div>

                    <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                        <Button
                            className="py-5 px-10"
                            type="submit"
                            disabled={
                                updateComboProductMutation.isPending
                            }
                        >
                            Cập Nhật
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default OverviewSection