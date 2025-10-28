import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import
{
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Upload } from "lucide-react";

import { categoryApi } from "@/apis/category.api";
import SuccessDialog from "@/components/dialog/success-dialog";
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
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import
{
  CreateCategorySchema,
  defaultCategoryResponse,
  type TCategoryResponse,
  type TCreateCategoryRequest,
} from "@/schema/category.schema";
import { useMutation } from "@tanstack/react-query";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateCategoryPage = () =>
{
  const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [ imagePreview, setImagePreview ] = useState<string | null>( null );
  const [ selectedType, setSelectedType ] = useState<number>( 1 );
  const [ chosenCategory, setChosenCategory ] = useState<TCategoryResponse>();
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setPage,
    setPageSize,
    filter,
    setFilter,
  } = useQueryParams( {
    defaultSortBy: "displayOrder",
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
    ],
  } );

  const { getCategories } = useCategory();
  const {
    data,
    isLoading,
    isError: isCateError,
    error: cateError,
  } = getCategories( {
    size: pageSize,
    page: currentPage,
    sortBy: sortBy,
    isAsc: isAsc,
    type: 'Parent',
    name: ( filter.find( ( f ) => f.id === "name" )?.value as string ) || "",
  } );
  if ( cateError && isCateError )
  {
    handleApiError( cateError );
  }

  const form = useForm<TCreateCategoryRequest>( {
    resolver: zodResolver( CreateCategorySchema ),
    defaultValues: defaultCategoryResponse,
  } );

  const createCategoryMutation = useMutation( {
    mutationFn: ( formData: FormData ) => categoryApi.createCategory( formData ),
  } );

  const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = e.target.files?.[ 0 ];
    if ( !file ) return;

    const reader = new FileReader();
    reader.onload = () =>
    {
      setImagePreview( reader.result as string );
    };
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

  const onSubmit = async ( data: TCreateCategoryRequest ) =>
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
    if ( data.image instanceof File )
    {
      formData.append( "image", data.image );
    }

    try
    {
      const result = await createCategoryMutation.mutateAsync( formData );
      dispatch( handleSetCreatedId( result.data.data ) );
      dispatch( handleChangeModalState( true ) );
      form.reset( defaultCategoryResponse );
    } catch ( error )
    {
      handleApiError( error );
    }
  };

  const watchType = form.watch( "type" );

  useEffect( () =>
  {
    setSelectedType( watchType );
    if ( watchType === 1 )
    {
      form.setValue( "parentCategoryId", undefined );
    }
  }, [ watchType, form.setValue ] );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tạo danh mục mới</h1>
      </div>
      <Form { ...form }>
        <SuccessDialog
          open={ isOpen }
          onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
          title="Tạo danh mục mới thành công"
          actionLabel="Xem danh mục"
          onAction={ () =>
          {
            if ( createdId )
            {
              dispatch( handleChangeModalState( false ) );
              navigation( PATH_BRAND_DASHBOARD.category.edit( createdId ) );
            }
          } }
        />
        <form
          onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
            console.log( errors )
          ) }
        // className="grid gap-6 grid-cols-1 lg:grid-cols-4"
        >
          <div className="container pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              <Card className="shadow-none border-none bg-white lg:col-span-2 2xl:col-span-1">
                <CardContent className="flex w-full h-full items-center justify-center">
                  <FormField
                    control={ form.control }
                    name="image"
                    render={ () =>
                    {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col items-center gap-4 w-full">
                              <input
                                type="file"
                                id="upload-image"
                                accept="image/*"
                                onChange={ handleImageChange }
                                className="hidden"
                                disabled={ createCategoryMutation.isPending }
                              />
                              { imagePreview ? (
                                <img
                                  src={ imagePreview }
                                  alt="Preview"
                                  className="w-full max-w-sm h-auto rounded-lg border"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12 px-4 rounded-md">
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
                  <div className="flex gap-2 items-center mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={ createCategoryMutation.isPending }
                      onClick={ () =>
                        document.getElementById( "upload-image" )?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" /> <span>Tải lên</span>
                    </Button>
                    { imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={ handleRemoveImage }
                        disabled={ createCategoryMutation.isPending }
                      >
                        Xóa
                      </Button>
                    ) }
                  </div>
                </CardFooter>
              </Card>
              <div className="grid lg:col-span-2 2xl:col-span-2 gap-4">
                <Card className="shadow-none border-none bg-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin danh mục</CardTitle>
                    <FormField
                      control={ form.control }
                      name="status"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem className="flex gap-4">
                            <FormLabel>Trạng thái</FormLabel>
                            <FormControl>
                              <Switch
                                { ...field }
                                checked={ field.value === 0 }
                                onCheckedChange={ ( checked ) =>
                                  field.onChange( checked ? 0 : 1 )
                                }
                                disabled={ createCategoryMutation.isPending }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
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
                                  disabled={ createCategoryMutation.isPending }
                                  { ...field }
                                  placeholder="Nhập mã danh mục"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        } }
                      />
                    </div>

                    <div>
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
                                  disabled={ createCategoryMutation.isPending }
                                  { ...field }
                                  placeholder="Nhập tên danh mục"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        } }
                      />
                    </div>
                    <div>
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
                                  disabled={ createCategoryMutation.isPending }
                                  { ...field }
                                  placeholder="Mô tả danh mục"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        } }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                  disabled={ createCategoryMutation.isPending }
                                  onValueChange={ ( value ) =>
                                    field.onChange( Number( value ) )
                                  }
                                  value={ String( field.value ) }
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Chọn trạng thái" />
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
                              return (
                                <FormItem className="grid grid-cols-1 lg:grid-cols-1 items-center">
                                  <FormLabel>Danh mục *</FormLabel>
                                  <Select
                                    disabled={
                                      createCategoryMutation.isPending || isLoading
                                    }
                                    onValueChange={ ( val ) =>
                                    {
                                      field.onChange( val );
                                      const selected = data?.data.data.items.find(
                                        ( item ) => item.id === val
                                      );
                                      setChosenCategory( selected );
                                    } }
                                    value={ field.value }
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        { chosenCategory != null && (
                                          <SelectValue defaultValue={ chosenCategory.id }>
                                            { chosenCategory.code } -{ " " }
                                            { chosenCategory.name }
                                          </SelectValue>
                                        ) }
                                        { chosenCategory == null && (
                                          <SelectValue placeholder="Chọn danh mục" />
                                        ) }
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                      page={ currentPage }
                                      size={ pageSize }
                                      searchValue={
                                        ( filter.find( ( f ) => f.id === "name" )
                                          ?.value as string ) || ""
                                      }
                                      onSearchValueChange={ ( val ) =>
                                      {
                                        const newFilter: ColumnFiltersState = [
                                          ...filter.filter( ( f ) => f.id !== "name" ),
                                          { id: "name", value: val },
                                        ];
                                        setFilter( newFilter );
                                      } }
                                      onPageChange={ setPage }
                                      onPageSizeChange={ setPageSize }
                                      totalPages={ data?.data.data.totalPages }
                                      searchable={ true }
                                      items={ data?.data.data.items.map( ( e ) =>
                                      {
                                        return (
                                          <SelectItem key={ e.id } value={ e.id }>
                                            { e.code } - { e.name }
                                          </SelectItem>
                                        );
                                      } ) }
                                    />
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              );
                            } }
                          />
                        </div>
                      ) }

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
                                    { ...field }
                                    disabled={ createCategoryMutation.isPending }
                                    placeholder="Nhập thứ tự hiển thị"
                                    onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
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
            <div className="lg:col-span-3 space-y-6 mt-10">
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={ createCategoryMutation.isPending }
                >
                  { createCategoryMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu danh mục" }
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Dialog xác nhận thành công */ }
      {/* <Dialog
        open={isOpen}
        onOpenChange={(open) => dispatch(handleChangeModalState(open))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo danh mục thành công</DialogTitle>
          </DialogHeader>
          <p>Bạn có muốn chuyển đến trang chỉnh sửa danh mục vừa tạo không?</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(handleChangeModalState(false))}
            >
              Ở lại
            </Button>
            <Button
              onClick={() => {
                if (createdId) {
                  dispatch(handleChangeModalState(false));
                  navigate(PATH_BRAND_DASHBOARD.category.edit(createdId));
                }
              }}
            >
              Xem danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default CreateCategoryPage;
