import { Button } from "@/components/ui/button";
import
{
  Card,
  CardContent,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { useInternalProduct } from "@/hooks/use-internal-product";
import { handleApiError } from "@/lib/error";
import { getImagePreviewUrl } from "@/lib/utils";
import
{
  mapPurchasableProductToUpdateRequest,
  UpdatePurchasableProductRequestSchema,
  type TPurchasableProduct,
  type TUpdatePurchasableProductRequest,
} from "@/schema/purchasable-product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";

type Props = {
  internalProduct: TPurchasableProduct;
};
const validateImageFile = ( file: File ): string | null =>
{
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const allowedTypes = [ "image/jpeg", "image/jpg", "image/png", "image/gif" ];

  if ( file.size > maxSize )
  {
    return "File size must be less than 5MB";
  }

  if ( !allowedTypes.includes( file.type ) )
  {
    return "Only JPG, PNG, and GIF files are allowed";
  }

  return null;
};
const OverviewPurchasableProductPage = ( { internalProduct }: Props ) =>
{
  // const navigation = useNavigate();
  const { updateInternalProductMutation } = useInternalProduct();
  const form = useForm<TUpdatePurchasableProductRequest>( {
    resolver: zodResolver( UpdatePurchasableProductRequestSchema ),
    defaultValues: {
      ...mapPurchasableProductToUpdateRequest( internalProduct ),
    },
  } );
  useEffect( () =>
  {
    if ( internalProduct )
    {
      form.reset( mapPurchasableProductToUpdateRequest( internalProduct ) );
    }
  }, [ internalProduct ] );
  const [ newImagePreviewUrls, setNewImagePreviewUrls ] = useState<string[]>( [] );

  const { fields: imageFields, remove: removeImage } = useFieldArray( {
    control: form.control,
    name: "existInternalProductImages",
    keyName: "_id",
  } );

  const {
    fields: newImageFields,
    append: appendNewImage,
    remove: removeUpdatedImage,
  } = useFieldArray( {
    control: form.control,
    name: "newInternalProductImages",
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
    const wasMainImage = form.getValues(
      `existInternalProductImages.${ index }.isMainImage`
    );
    removeImage( index );

    if ( wasMainImage )
    {
      if ( imageFields.length > 1 )
      {
        const nextIndex = index === 0 ? 1 : 0;
        form.setValue(
          `existInternalProductImages.${ nextIndex }.isMainImage`,
          true
        );
      } else if ( newImageFields.length > 0 )
      {
        form.setValue( `newInternalProductImages.0.isMainImage`, true );
      }
    }
  };

  const removeNewImage = ( index: number ) =>
  {
    const wasMainImage = form.getValues(
      `newInternalProductImages.${ index }.isMainImage`
    );
    removeUpdatedImage( index );

    if ( wasMainImage )
    {
      if ( newImageFields.length > 1 )
      {
        const nextIndex = index === 0 ? 1 : 0;
        form.setValue(
          `newInternalProductImages.${ nextIndex }.isMainImage`,
          true
        );
      } else if ( imageFields.length > 0 )
      {
        form.setValue( `existInternalProductImages.0.isMainImage`, true );
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
        form.setValue( `existInternalProductImages.${ index }.isMainImage`, false );
      } );

      newImageFields.forEach( ( _, index ) =>
      {
        form.setValue( `newInternalProductImages.${ index }.isMainImage`, false );
      } );

      if ( isExisting )
      {
        form.setValue(
          `existInternalProductImages.${ imageIndex }.isMainImage`,
          true
        );
      } else
      {
        form.setValue(
          `newInternalProductImages.${ imageIndex }.isMainImage`,
          true
        );
      }
    } else
    {
      if ( imageFields.length > 0 )
      {
        form.setValue( `existInternalProductImages.0.isMainImage`, true );
      } else if ( newImageFields.length > 0 )
      {
        form.setValue( `newInternalProductImages.0.isMainImage`, true );
      }
    }
  };

  const onSubmit: SubmitHandler<TUpdatePurchasableProductRequest> = async (
    data
  ) =>
  {
    const formData = new FormData();
    formData.append( "name", data.name );
    formData.append( "code", data.code );
    formData.append( "description", data.description ?? "" );
    formData.append( "price", String( data.price ) );
    formData.append( "sku", data.sku?.toString() ?? "" );
    formData.append( "displayOrder", data.displayOrder?.toString() ?? "" );
    formData.append( "isActive", String( data.isActive ) );
    formData.append( "price", data.price?.toString() ?? "" );
    if ( data.existInternalProductImages?.length )
    {
      data.existInternalProductImages.forEach( ( imageObj, index ) =>
      {
        formData.append(
          `existInternalProductImages[${ index }].id`,
          imageObj.id
        );
        formData.append(
          `existInternalProductImages[${ index }].isMainImage`,
          String( imageObj.isMainImage )
        );
      } );
    }
    if ( data.newInternalProductImages?.length )
    {
      data.newInternalProductImages.forEach( ( imageObj, index ) =>
      {
        if ( imageObj.image instanceof File )
        {
          formData.append(
            `newInternalProductImages[${ index }].image`,
            imageObj.image
          );
        }
        formData.append(
          `newInternalProductImages[${ index }].isMainImage`,
          String( imageObj.isMainImage )
        );
      } );
    }
    try
    {
      await updateInternalProductMutation.mutateAsync( {
        id: internalProduct.id ?? "",
        data: formData,
      } );
      toast.success( "Cập nhật sản phẩm nhập hàng thành công." );
      //   dispatch(handleSetCreatedId(result.data.data.id));
      //   dispatch(handleChangeModalState(true));
    } catch ( error )
    {
      handleApiError( error );
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
      >
        <div className="container pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="grid lg:col-span-2 xl:col-span-1 gap-4">
              {/* Product Images */ }
              <Card className="shadow-none border-none bg-white">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-center">Ảnh Sản Phẩm</CardTitle>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={ handleImageUpload }
                    className="hidden"
                    id="image-upload"
                    disabled={ totalImages >= 4 || updateInternalProductMutation.isPending }
                  />
                </CardHeader>
                <CardContent className="flex w-full h-full items-center justify-center">
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
                                    disabled={
                                      updateInternalProductMutation.isPending
                                    }
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
                                      name={ `existInternalProductImages.${ index }.isMainImage` }
                                      render={ ( { field } ) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              disabled={
                                                updateInternalProductMutation.isPending
                                              }
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
                                      disabled={
                                        updateInternalProductMutation.isPending
                                      }
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
                                        name={ `newInternalProductImages.${ index }.isMainImage` }
                                        render={ ( { field } ) => (
                                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl>
                                              <Checkbox
                                                disabled={
                                                  updateInternalProductMutation.isPending
                                                }
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
                      className="rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
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
                <CardFooter className="flex gap-2 items-center justify-center mt-2">
                  <Button
                    type="button"
                    disabled={ updateInternalProductMutation.isPending }
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={ () =>
                    {
                      document.getElementById( "image-upload" )?.click();
                    } }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên ảnh
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <Card className="shadow-none border-none bg-white grid lg:col-span-2 xl:col-span-2 gap-4">
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
                            disabled={ updateInternalProductMutation.isPending }
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
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="code"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Mã sản phẩm nhập hàng *</FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                { ...field }
                                value={ field.value ?? "" }
                                placeholder="Nhập mã sản phẩm nhập hàng"
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
                      name="sku"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>SKU *</FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                { ...field }
                                value={ field.value ?? "" }
                                placeholder="Nhập mã sản phẩm nhập hàng"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="name"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Tên sản phẩm *</FormLabel>
                            <FormControl>
                              <Input
                                disabled={ updateInternalProductMutation.isPending }
                                { ...field }
                                value={ field.value ?? "" }
                                placeholder="Nhập tên sản phẩm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="price"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Giá sản phẩm *</FormLabel>
                            <FormControl>
                              <Input
                                disabled={ updateInternalProductMutation.isPending }
                                { ...form.register( "price", {
                                  valueAsNumber: true,
                                } ) }
                                type="number"
                                min={ 1 }
                                value={ field.value ?? 0 }
                                placeholder="Nhập giá sản phẩm"
                                onChange={ ( e ) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? ""
                                      : Number( e.target.value )
                                  )
                                }
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
                      name="displayOrder"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Thứ tự hiển thị * </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={ 1 }
                                step={ 1 }
                                value={ field.value ?? "" }
                                disabled={ updateInternalProductMutation.isPending }
                                onChange={ ( e ) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? ""
                                      : Number( e.target.value )
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
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
                                disabled={ updateInternalProductMutation.isPending }
                                value={ field.value ?? "" }
                                placeholder="Nhập mô tả sản phẩm nhập hàng"
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
          <div className="flex justify-end h-16 shrink-0 items-center transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button className="mr-8 py-5 px-10" type="submit" disabled={ updateInternalProductMutation.isPending }>
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default OverviewPurchasableProductPage;
