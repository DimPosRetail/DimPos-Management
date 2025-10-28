// src/pages/category/edit/category-edit-page.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { categoryApi } from "@/apis/category.api";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCategory } from "@/hooks/use-category";
import { handleApiError } from "@/lib/error";
import
{
  defaultCategoryResponse,
  mapCategoryResponseToUpdateRequest,
  UpdateCategorySchema,
  type TUpdateCategoryRequest
} from "@/schema/category.schema";
import { Upload } from "lucide-react";

const CategoryEditPage = () =>
{
  const { id } = useParams<{ id: string }>();
  const [ imagePreview, setImagePreview ] = useState<string | null>( null );
  const [ selectedType, setSelectedType ] = useState<0 | 1>( 0 );

  const { getCategoryById, getParentCategories } = useCategory();
  const {
    data: categoryData,
    error: categoryError,
    isError: isCategoryError,
    // isLoading: isCategoryLoading,
  } = getCategoryById( id as string );
  const {
    data: _,
    error: parentCategoriesError,
    isError: isParentCategoriesError,
    // isLoading: isParentCategoriesLoading,
  } = getParentCategories();

  const { getCategories } = useCategory();

  //Cần chỉnh sửa
  const {
    data,
    error: cateError,
    isError: isCateError,
  } = getCategories( {
    size: 10000,
    page: 1,
  } );

  if ( cateError && isCateError )
  {
    handleApiError( cateError );
  }

  const form = useForm<TUpdateCategoryRequest>( {
    resolver: zodResolver( UpdateCategorySchema ),
    defaultValues: mapCategoryResponseToUpdateRequest( defaultCategoryResponse ),
  } );

  // const parentCategories: TCategoryResponse[] =
  //   parentCategoriesResponse?.data?.data?.items ?? [];

  useEffect( () =>
  {
    if ( categoryData?.data?.data )
    {
      const category = categoryData.data.data;
      form.reset( { ...mapCategoryResponseToUpdateRequest( category ) } );
      setImagePreview( category.pictureUrl ?? null );
      setSelectedType( category.type as 0 | 1 );
    }
  }, [ categoryData ] );
  // if (isParentCategoriesLoading || isCategoryLoading) {
  //   return <div>Đang tải ...</div>;
  // }
  if ( categoryError && isCategoryError )
  {
    handleApiError( categoryError );
  }
  if ( parentCategoriesError && isParentCategoriesError )
  {
    handleApiError( parentCategoriesError );
  }

  const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = e.target.files?.[ 0 ];
    if ( !file ) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview( reader.result as string );
    reader.readAsDataURL( file );
    form.setValue( "image", file );
  };

  const handleRemoveImage = () =>
  {
    setImagePreview( null );
    form.setValue( "image", undefined );
    const input = document.getElementById(
      "upload-image"
    ) as HTMLInputElement | null;
    if ( input ) input.value = "";
  };

  const onSubmit: SubmitHandler<TUpdateCategoryRequest> = async ( data ) =>
  {
    const formData = new FormData();
    Object.entries( data ).forEach( ( [ key, value ] ) =>
    {
      if ( value !== null && value !== undefined )
      {
        if ( Array.isArray( value ) )
        {
          value.forEach( ( item, index ) =>
          {
            formData.append( `${ key }[${ index }]`, JSON.stringify( item ) );
          } );
        } else if ( typeof value === "object" )
        {
          formData.append( key, JSON.stringify( value ) );
        } else
        {
          formData.append( key, value.toString() );
        }
      }
    } );
    if ( data.image instanceof File ) formData.append( "image", data.image );

    try
    {
      await categoryApi.updateCategory( data.id, formData );
      toast.success( "Cập nhật danh mục thành công!" );
    } catch ( error )
    {
      handleApiError( error );
    }
  };

  const watchType = form.watch( "type" );

  useEffect( () =>
  {
    setSelectedType( watchType );
    if ( watchType === 0 ) form.setValue( "parentCategoryId", undefined );
  }, [ watchType, form.setValue ] );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Thông tin danh mục</h1>
      </div>
      <Form { ...form }>
        <form
          onSubmit={ form.handleSubmit( onSubmit ) }
        // className="grid gap-6 grid-cols-1 lg:grid-cols-4"
        >
          <div className="container pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-1">
                <CardContent className="flex w-full h-full items-center justify-center">
                  <FormField
                    control={ form.control }
                    name="image"
                    render={ () =>
                    {
                      return (
                        <FormItem>
                          <FormLabel></FormLabel>
                          <FormControl>
                            <div>
                              <div>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  id="image-upload"
                                  disabled
                                />
                              </div>
                              <input
                                type="file"
                                id="upload-image"
                                accept="image/*"
                                onChange={ handleImageChange }
                                className="hidden"
                              />
                              { imagePreview ? (
                                <img
                                  src={ imagePreview }
                                  alt="Preview"
                                  className="w-full h-auto rounded-lg"
                                />
                              ) : (
                                <div className="text-center text-muted-foreground py-12">
                                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-40" />
                                  <p>Chưa chọn hình ảnh</p>
                                </div>
                              ) }
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    } }
                  />
                </CardContent>
                <CardFooter className="flex gap-2 items-center justify-center mt-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={ () =>
                        document.getElementById( "upload-image" )?.click()
                      }
                    >
                      { " " }
                      <Upload className="w-4 h-4 mr-2" /> Tải lên{ " " }
                    </Button>
                    { imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={ handleRemoveImage }
                      >
                        Xóa
                      </Button>
                    ) }
                  </div>
                </CardFooter>
              </Card>
              <div className="grid lg:col-span-2 xl:col-span-2 gap-4">
                <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2">
                  <CardContent className="space-y-6">
                    <FormField
                      control={ form.control }
                      name="code"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Mã danh mục *</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                readOnly
                                className="bg-muted cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />

                    {/* <div>
                      <label className="block text-sm font-medium">
                        Tên danh mục *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Nhập tên danh mục"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div> */}
                    <FormField
                      control={ form.control }
                      name="name"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Tên danh mục *</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                placeholder="Nhập tên danh mục"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
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
                                placeholder="Mô tả danh mục"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                  <Input { ...field } type="number" onChange={ ( e ) => field.onChange( Number( e.target.value ) ) } />
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
                          name="type"
                          render={ ( { field } ) =>
                          {
                            return (
                              <FormItem>
                                <FormLabel>Loại danh mục *</FormLabel>
                                <Select
                                  value={ field.value?.toString() }
                                  disabled
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0">
                                      Danh mục cha
                                    </SelectItem>
                                    <SelectItem value="1">
                                      Danh mục con
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          } }
                        />
                      </div>
                      { selectedType === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                          <FormField
                            control={ form.control }
                            name="parentCategoryId"
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
                                  <FormLabel>Danh mục cha *</FormLabel>
                                  <Select
                                    disabled
                                    onValueChange={ field.onChange }
                                    defaultValue={ field.value }
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <span className="truncate">
                                          { form.watch( "parentCategoryId" ) != null
                                            ? ( () =>
                                            {
                                              const selectedCategory =
                                                data?.data.data.items.find(
                                                  ( item ) =>
                                                    item.id ===
                                                    form.watch( "parentCategoryId" )
                                                );
                                              return selectedCategory
                                                ? `${ selectedCategory.code } - ${ selectedCategory.name }`
                                                : "Chọn danh mục";
                                            } )()
                                            : categoryData.data.data?.parentCategory?.name &&
                                              categoryData.data.data?.parentCategory?.code
                                              ? `${ categoryData.data.data?.parentCategory?.code } - ${ categoryData.data.data?.parentCategory?.name }`
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
                        </div>
                      ) }
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={ form.control }
                        name="status"
                        render={ ( { field } ) =>
                        {
                          return (
                            <FormItem className="flex gap-6">
                              <FormLabel>Hoạt động</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={ field.value === 0 }
                                  onCheckedChange={ ( checked ) =>
                                    field.onChange( checked ? 0 : 1 )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        } }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryEditPage;
