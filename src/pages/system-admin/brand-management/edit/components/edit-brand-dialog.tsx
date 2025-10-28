import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBrand } from "@/hooks/use-brand";
import type { TBrand, TUpdateBrand } from "@/schema/brand.schema";
import { UpdateBrandSchema } from "@/schema/brand.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";

type Props = {
    initialData?: TBrand;
    children: ReactNode;
}

const EditBrandDialog = ( {
    initialData,
    children,
}: Props ) =>
{
    const { updateBrandMutation } = useBrand();
    const queryClient = useQueryClient();
    const [ open, setOpen ] = useState( false );
    const [ imagePreview, setImagePreview ] = useState<string | null>( initialData?.pictureUrl || null );

    const mutation = updateBrandMutation();

    const form = useForm<TUpdateBrand>( {
        resolver: zodResolver( UpdateBrandSchema ),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            phone: initialData?.phone || "",
            picture: undefined,
        },
    } );

    const onSubmit = async ( data: TUpdateBrand ) =>
    {
        if ( !initialData?.id )
        {
            toast.error( "Không tìm thấy ID thương hiệu!" );
            return;
        }

        try
        {
            await mutation.mutateAsync( {
                id: initialData.id,
                data,
            } );
            // Invalidate queries to refresh the data
            queryClient.invalidateQueries( { queryKey: [ "brand", initialData.id ] } );
            queryClient.invalidateQueries( { queryKey: [ "brands" ] } );
            toast.success( "Cập nhật thương hiệu thành công!" );
            setOpen( false );
        } catch ( error )
        {
            toast.error( "Có lỗi xảy ra khi cập nhật thương hiệu!" );
        }
    };

    const handleImageChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const file = event.target.files?.[ 0 ];
        if ( file )
        {
            form.setValue( "picture", file );
            const reader = new FileReader();
            reader.onload = ( e ) =>
            {
                setImagePreview( e.target?.result as string );
            };
            reader.readAsDataURL( file );
        }
    };

    const removeImage = () =>
    {
        form.setValue( "picture", undefined );
        setImagePreview( initialData?.pictureUrl || null );
    };

    // Reset form when dialog opens/closes
    useEffect( () =>
    {
        if ( open )
        {
            form.reset( {
                name: initialData?.name || "",
                address: initialData?.address || "",
                phone: initialData?.phone || "",
                picture: undefined,
            } );
            setImagePreview( initialData?.pictureUrl || null );
        }
    }, [ open, initialData, form ] );

    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin thương hiệu</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin thương hiệu của bạn tại đây. Nhấn lưu khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Image Upload Section */ }
                            <div className="md:col-span-2 flex flex-col justify-between items-center">
                                <FormLabel className="text-sm font-medium">Ảnh đại diện</FormLabel>
                                <div className="mt-2 flex flex-col justify-between items-center">
                                    { imagePreview ? (
                                        <div className="relative w-32 h-32 border rounded-xl overflow-hidden bg-gray-50">
                                            <PhotoProvider>
                                                <PhotoView src={ imagePreview }>
                                                    <img
                                                        src={ imagePreview }
                                                        alt="Preview"
                                                        className="w-full h-full object-cover cursor-pointer"
                                                    />
                                                </PhotoView>
                                            </PhotoProvider>
                                            <button
                                                type="button"
                                                onClick={ removeImage }
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                                            <div className="text-center">
                                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">Tải ảnh lên</span>
                                            </div>
                                        </div>
                                    ) }
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={ handleImageChange }
                                        className="hidden"
                                        id="picture-upload"
                                    />
                                    <label
                                        htmlFor="picture-upload"
                                        className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                                    >
                                        { imagePreview ? "Thay đổi ảnh" : "Chọn ảnh" }
                                    </label>
                                </div>
                                <FormMessage />
                            </div>

                            {/* Name Field */ }
                            <div className="md:col-span-2">
                                <FormField
                                    control={ form.control }
                                    name="name"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Tên thương hiệu</FormLabel>
                                            <FormControl>
                                                <Input disabled={ mutation.isPending } placeholder="Nhập tên thương hiệu" { ...field } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>

                            {/* Phone Field */ }
                            <div className="md:col-span-1">
                                <FormField
                                    control={ form.control }
                                    name="phone"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input disabled={ mutation.isPending } placeholder="Nhập số điện thoại" { ...field } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>

                            {/* Address Field */ }
                            <div className="md:col-span-1">
                                <FormField
                                    control={ form.control }
                                    name="address"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Địa chỉ</FormLabel>
                                            <FormControl>
                                                <Input disabled={ mutation.isPending } placeholder="Nhập địa chỉ" { ...field } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={ () => setOpen( false ) }
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={ mutation.isPending }
                            >
                                { mutation.isPending ? "Đang lưu..." : "Lưu thay đổi" }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditBrandDialog
