import { Button } from "@/components/ui/button";
import
{
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "@/hooks/use-category";
import { useProduct } from "@/hooks/use-product";
import { useProductVariant } from "@/hooks/use-product-variant";
import { handleApiError } from "@/lib/error";
import { cn, validateImageFile } from "@/lib/utils";
import
{
  UpdateProductSchema,
  type TUpdateProductRequest,
} from "@/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  initialData: TUpdateProductRequest;
};


const getImagePreviewUrl = ( image: any ): string =>
{
  if ( image instanceof File )
  {
    return URL.createObjectURL( image );
  }
  if ( typeof image === "string" )
  {
    return image;
  }
  if ( image && image.url )
  {
    return image.url;
  }
  return "";
};

const EditProductForm = ( { initialData }: Props ) =>
{
  const { updateProductMutation } = useProduct();
  const { getProductVariantById, updateProductVariantMutation } = useProductVariant();
  if ( !initialData.isHasVariants )
  {
    const { data } = getProductVariantById( initialData.productVariants ? initialData.productVariants[ 0 ].id : "" );
    initialData.productVariants = data?.data.data ? [ data.data.data ] : [];
  }
  // const navigate = useNavigate();

  const form = useForm<TUpdateProductRequest>( {
    resolver: zodResolver( UpdateProductSchema ),
    defaultValues: initialData,
  } );
  // console.log( "formState", form.formState );
  const { getCategories } = useCategory();

  //Cần chỉnh sửa
  const {
    data,
    error: cateError,
    isError: isCateError,
    isLoading,
  } = getCategories( {
    size: 10000,
    page: 1,
  } );

  if ( cateError && isCateError )
  {
    handleApiError( cateError );
  }

  const [ newImagePreviewUrls, setNewImagePreviewUrls ] = useState<string[]>( [] );

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

  const onSubmit = async ( data: TUpdateProductRequest ) =>
  {
    console.log( "Submitted data:", data );
    const formProductData = new FormData();
    let productVariantPayload = undefined;
    if ( !initialData.isHasVariants )
    {
      if ( data.productVariants && data.productVariants[ 0 ] )
      {
        var productVariant = data.productVariants[ 0 ];
        productVariantPayload = {
          name: data.name,
          displayOrder: data.displayOrder,
          isActive: productVariant.isActive,
          sku: productVariant.sku ?? "",
          price: productVariant.price ?? 0,
        };
      }
      formProductData.append( "name", data.name );
      formProductData.append( "description", data.description );
      formProductData.append(
        "displayOrder",
        data.displayOrder !== undefined ? data.displayOrder.toString() : ""
      );
      formProductData.append( "note", data.note ?? "" );
      // formProductData.append( "status", data.status.toString() );
      formProductData.append( "categoryId", data.category?.id ?? "" );
      if ( data.productImages && data.productImages.length > 0 )
      {
        data.productImages.forEach( ( imageData, index ) =>
        {
          formProductData.append(
            `ExistProductImages[${ index }].ID`,
            imageData.id.toString()
          );
          formProductData.append(
            `ExistProductImages[${ index }].IsMainImage`,
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
            formProductData.append(
              `NewProductImages[${ index }].Image`,
              imageData.image
            );
          }
          formProductData.append(
            `NewProductImages[${ index }].IsMainImage`,
            imageData.isMainImage.toString()
          );
        } );
      }
      try
      {
        let productVariantResult;
        if ( productVariantPayload )
        {
          productVariantResult = await updateProductVariantMutation.mutateAsync(
            {
              id: data.productVariants![ 0 ].id,
              data: productVariantPayload,
            }
          );
        }
        const productResult = await updateProductMutation.mutateAsync( {
          id: initialData.id,
          data: formProductData,
        } );

        if (
          productResult.status >= 200 &&
          productResult.status <= 299 &&
          ( !productVariantResult ||
            ( productVariantResult.status >= 200 &&
              productVariantResult.status <= 299 ) )
        )
        {
          toast.success( "Cập nhật sản phẩm thành công!!" );
        }
        // navigate(-1);
      } catch ( error )
      {
        form.reset();
        handleApiError( error );
      }
    } else
    {
      // Nếu có biến thể thì chỉ cập nhật product
      const formProductData = new FormData();
      formProductData.append( "name", data.name );
      // formProductData.append("categoryId", data.category?.id ?? "");
      formProductData.append( "description", data.description );
      formProductData.append(
        "displayOrder",
        data.displayOrder !== undefined ? data.displayOrder.toString() : ""
      );
      formProductData.append( "note", data.note ?? "" );
      // formProductData.append( "status", data.status.toString() );
      formProductData.append( "categoryId", data.category?.id ?? "" );
      if ( data.productImages && data.productImages.length > 0 )
      {
        data.productImages.forEach( ( imageData, index ) =>
        {
          formProductData.append(
            `ExistProductImages[${ index }].Id`,
            imageData.id.toString()
          );
          formProductData.append(
            `ExistProductImages[${ index }].IsMainImage`,
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
            formProductData.append(
              `NewProductImages[${ index }].Image`,
              imageData.image
            );
          }
          formProductData.append(
            `NewProductImages[${ index }].IsMainImage`,
            imageData.isMainImage.toString()
          );
        } );
      }
      try
      {
        const productResult = await updateProductMutation.mutateAsync( {
          id: initialData.id,
          data: formProductData,
        } );

        if ( productResult.status >= 200 && productResult.status <= 299 )
        {
          toast.success( "Cập nhật sản phẩm thành công!!" );
        }
      } catch ( error )
      {
        handleApiError( error );
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
            {/* Basic Information */ }
            <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2 gap-2">
              <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                <CardTitle>
                  <div className="flex flex-col items-start gap-2">
                    Thông Tin Cơ Bản

                    {
                      ( !initialData.isHasVariants && initialData.productVariants![ 0 ].recipeItems!.length === 0 ) && ( <span className="text-red-500 text-xs font-normal">
                        { "(Chưa có công thức)" }
                      </span> )
                    }
                  </div>
                </CardTitle>
                {
                  !initialData.isHasVariants &&
                  <div className="flex justify-end items-center space-x-2">
                    <FormField
                      control={ form.control }
                      name="productVariants.0.isActive"
                      render={ ( { field } ) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Hoạt động</FormLabel>
                          <FormControl>
                            <Switch
                              disabled={ updateProductVariantMutation.isPending }
                              checked={ field.value }
                              onCheckedChange={ field.onChange }
                            />
                          </FormControl>
                        </FormItem>
                      ) }
                    />
                  </div>
                }
              </CardHeader>

              {/* //Code and sku  */ }
              <CardContent className="space-y-4">
                {/* //Mã sản phẩm  */ }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={ form.control }
                    name="code"
                    disabled
                    render={ ( { field } ) => (
                      <FormItem className={ cn( "col-span-1", initialData.isHasVariants ? "md:col-span-1" : "md:col-span-2" ) }>
                        <FormLabel>Mã sản phẩm *</FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              updateProductMutation.isPending ||
                              updateProductVariantMutation.isPending
                            }
                            placeholder="Nhập mã sản phẩm"
                            { ...field }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />

                  {/* //Danh mục nếu product có variant*/ }
                  { initialData.isHasVariants && (
                    <FormField
                      control={ form.control }
                      name="category.id"
                      render={ ( { field } ) =>
                      {
                        const [ searchTerm ] = useState( "" );

                        const filteredCategories = (
                          data?.data.data.items ?? []
                        ).filter( ( category ) =>
                          category.name
                            .toLowerCase()
                            .includes( searchTerm.toLowerCase() )
                        );
                        return (
                          <FormItem className="grid grid-cols-1 lg:grid-cols-1 items-center">
                            <FormLabel>Danh mục *</FormLabel>
                            <Select
                              disabled={
                                updateProductMutation.isPending ||
                                updateProductVariantMutation.isPending ||
                                isLoading
                              }
                              onValueChange={ field.onChange }
                              defaultValue={ field.value }
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <span className="truncate">
                                    { form.watch( "category.id" ) != null
                                      ? ( () =>
                                      {
                                        const selectedCategory =
                                          data?.data.data.items.find(
                                            ( item ) =>
                                              item.id ===
                                              form.watch( "category.id" )
                                          );
                                        return selectedCategory
                                          ? `${ selectedCategory.code } - ${ selectedCategory.name }`
                                          : "Chọn danh mục";
                                      } )()
                                      : initialData.category?.name &&
                                        initialData.category?.code
                                        ? `${ initialData.category?.code } - ${ initialData.category?.name }`
                                        : "Chọn danh mục" }
                                  </span>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="h-60 overflow-y-auto">
                                { filteredCategories.length > 0 ? (
                                  filteredCategories.map( ( category ) => (
                                    <SelectItem
                                      key={ category.id }
                                      value={ category.id }
                                    >
                                      { category.code } - { category.name }
                                    </SelectItem>
                                  ) )
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    Không có danh mục nào
                                  </div>
                                ) }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  ) }
                </div>
                <FormField
                  control={ form.control }
                  name="name"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            updateProductMutation.isPending ||
                            updateProductVariantMutation.isPending
                          }
                          placeholder="Nhập tên sản phẩm"
                          { ...field }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                {/* //Danh mục nếu product không có variant*/ }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  { !initialData.isHasVariants && (
                    <FormField
                      control={ form.control }
                      name="category.id"
                      render={ ( { field } ) =>
                      {
                        const [ searchTerm ] = useState( "" );

                        const filteredCategories = (
                          data?.data.data.items ?? []
                        ).filter( ( category ) =>
                          category.name
                            .toLowerCase()
                            .includes( searchTerm.toLowerCase() )
                        );
                        return (
                          <FormItem className="grid grid-cols-1 lg:grid-cols-1 items-center">
                            <FormLabel>Danh mục *</FormLabel>
                            <Select
                              disabled={
                                updateProductMutation.isPending ||
                                updateProductVariantMutation.isPending ||
                                isLoading
                              }
                              onValueChange={ field.onChange }
                              defaultValue={ field.value }
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <span className="truncate">
                                    { form.watch( "category.id" ) != null
                                      ? ( () =>
                                      {
                                        const selectedCategory =
                                          data?.data.data.items.find(
                                            ( item ) =>
                                              item.id ===
                                              form.watch( "category.id" )
                                          );
                                        return selectedCategory
                                          ? `${ selectedCategory.code } - ${ selectedCategory.name }`
                                          : "Chọn danh mục";
                                      } )()
                                      : initialData.category?.name &&
                                        initialData.category?.code
                                        ? `${ initialData.category?.code } - ${ initialData.category?.name }`
                                        : "Chọn danh mục" }
                                  </span>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="h-60 overflow-y-auto">
                                { filteredCategories.length > 0 ? (
                                  filteredCategories.map( ( category ) => (
                                    <SelectItem
                                      key={ category.id }
                                      value={ category.id }
                                    >
                                      { category.code } - { category.name }
                                    </SelectItem>
                                  ) )
                                ) : (
                                  <div className="p-2 text-sm text-gray-500">
                                    Không có danh mục nào
                                  </div>
                                ) }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  ) }
                  <FormField
                    control={ form.control }
                    name="displayOrder"
                    render={ ( { field } ) => (
                      <FormItem className={ cn( !initialData.isHasVariants ? "md:col-span-1" : "md:col-span-2" ) }>
                        <FormLabel>Thứ tự hiển thị *</FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              updateProductMutation.isPending ||
                              updateProductVariantMutation.isPending
                            }
                            type="number"
                            placeholder="Nhập thứ tự"
                            { ...field }
                            value={ field.value ?? "" }
                            onChange={ ( e ) =>
                            {
                              const value = e.target.value;
                              field.onChange( Number( value ) );
                            } }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />

                  {/* //Giá gốc nếu product không có variant*/ }
                  { !initialData.isHasVariants && (
                    <FormField
                      control={ form.control }
                      name="productVariants.0.price"
                      render={ ( { field } ) => (
                        <FormItem className={ cn( !initialData.isHasVariants ? "md:col-span-2" : "md:col-span-1" ) }>
                          <FormLabel>Giá gốc *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={
                                updateProductMutation.isPending ||
                                updateProductVariantMutation.isPending
                              }
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
                  ) }
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <FormField
                    control={ form.control }
                    name="description"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Mô tả *</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={
                              updateProductMutation.isPending ||
                              updateProductVariantMutation.isPending
                            }
                            placeholder="Nhập mô tả sản phẩm"
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
                            disabled={
                              updateProductMutation.isPending ||
                              updateProductVariantMutation.isPending
                            }
                            placeholder="Nhập ghi chú cho sản phẩm"
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
              </CardContent>
            </Card>

            <div className="grid lg:col-span-2 xl:col-span-1 gap-4">
              {/* Product Images */ }
              <Card className="shadow-none border-none bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Ảnh Sản Phẩm
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
                      disabled={ updateProductMutation.isPending ||
                        updateProductVariantMutation.isPending }
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
                                    disabled={
                                      updateProductMutation.isPending ||
                                      updateProductVariantMutation.isPending
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
                                      name={ `productImages.${ index }.isMainImage` }
                                      render={ ( { field } ) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              disabled={
                                                updateProductMutation.isPending ||
                                                updateProductVariantMutation.isPending
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
                                        updateProductMutation.isPending ||
                                        updateProductVariantMutation.isPending
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
                                        name={ `newProductImages.${ index }.isMainImage` }
                                        render={ ( { field } ) => (
                                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl>
                                              <Checkbox
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
                updateProductMutation.isPending ||
                updateProductVariantMutation.isPending
              }
            >
              Cập Nhật
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditProductForm;
