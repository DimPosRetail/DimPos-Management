// import { useStore } from "@/hooks/use-store";
// import { handleApiError } from "@/lib/error";
// import { useParams } from "react-router-dom";
import SuccessDialog from "@/components/dialog/success-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useInternalProduct } from "@/hooks/use-internal-product";
import { handleApiError } from "@/lib/error";
import { getImagePreviewUrl } from "@/lib/utils";
import { handleChangeModalState } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import
{
  CreatePurchasableProductRequestSchema,
  type TCreatePurchasableProductRequest,
} from "@/schema/purchasable-product.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePurchasableProductPage = () =>
{
  const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
  const dispatch = useDispatch();
  // const navigation = useNavigate();
  const { createInternalProductMutation } = useInternalProduct();
  const form = useForm<TCreatePurchasableProductRequest>( {
    resolver: zodResolver( CreatePurchasableProductRequestSchema ),
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

  const onSubmit: SubmitHandler<TCreatePurchasableProductRequest> = async (
    data
  ) =>
  {
    // console.log(data);
    const formData = new FormData();
    formData.append( "code", data.code );
    formData.append( "name", data.name );
    formData.append( "description", data.description ?? "" );
    formData.append( "displayOrder", data.displayOrder?.toString() ?? "" );
    formData.append( "note", "true" );
    formData.append( "sku", data.sku?.toString() ?? "" );
    formData.append( "price", data.price?.toString() ?? "" );


    if ( data.productImages )
    {
      data.productImages.forEach( ( imageObj, index ) =>
      {
        if ( imageObj.image instanceof File )
        {
          formData.append( `productImages[${ index }].image`, imageObj.image );
        }
        formData.append(
          `productImages[${ index }].isMainImage`,
          imageObj.isMainImage.toString()
        );
      } );
    }

    try
    {
      await createInternalProductMutation.mutateAsync( formData );
      toast.success( "Tạo sản phẩm nhập hàng thành công." );
      // dispatch(handleSetCreatedId(result.data.data.id));
      // dispatch(handleChangeModalState(true));
      form.reset( {
        code: "",
        sku: "",
        name: "",
        price: undefined,
        displayOrder: undefined,
        description: "",
        productImages: [],
      } );
    } catch ( error )
    {
      handleApiError( error );
    }
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tạo sản phẩm nhập hàng mới</h1>
      </div>
      <Form { ...form }>
        <form
          className="relative"
          onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
          {
            console.error( "Form validation errors:", errors );
          } ) }
        >
          <SuccessDialog
            open={ isOpen }
            onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
            title="Tạo sản phẩm mới thành công"
            actionLabel="Xem sản phẩm"
            onAction={ () =>
            {
              if ( createdId )
              {
                dispatch( handleChangeModalState( false ) );
                // navigation(PATH_BRAND_DASHBOARD.product.editProduct(createdId));
              }
            } }
          />
          <div className="container pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="grid lg:col-span-2 xl:col-span-1 gap-4">
                {/* Product Images */ }
                <Card className="shadow-none bg-white border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Ảnh Sản Phẩm
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
                        disabled={ createInternalProductMutation.isPending }
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
                                disabled={
                                  createInternalProductMutation.isPending
                                }
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
                                            createInternalProductMutation.isPending
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
              </div>
              <Card className="shadow-none border-none bg-white grid lg:col-span-2 xl:col-span-2 gap-4">
                <CardHeader className="font-medium text-base">
                  Tổng quan
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
                                  { ...form.register( "price", {
                                    valueAsNumber: true,
                                  } ) }
                                  type="number"
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
                              <FormLabel>Thứ tự hiển thị *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step={ 1 }
                                  value={ field.value ?? 0 }
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
          </div>
          <div className="flex justify-end h-16 shrink-0 items-center transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button className="mr-8 py-5 px-10" type="submit">
              Tạo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePurchasableProductPage;
