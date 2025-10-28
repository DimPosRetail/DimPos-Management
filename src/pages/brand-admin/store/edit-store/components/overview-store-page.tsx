import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { StoreSchema, type TStore } from "@/schema/store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

type Props = {};

const EditStoreForm = ( _: Props ) =>
{
  const { id } = useParams<{ id: string }>();

  const { getStoreById, updateStoreMutation } = useStore();

  const {
    data: storeData,
    error: storeDataError,
    isError: isStoreDataError,
    // isLoading: isStoreDataLoading,
  } = getStoreById( id as string );

  if ( isStoreDataError && storeDataError )
  {
    handleApiError( storeDataError );
  }

  const initialData = storeData.data.data as TStore;
  const form = useForm<TStore>( {
    resolver: zodResolver( StoreSchema ),
    defaultValues: initialData,
  } );

  useEffect( () =>
  {
    if ( initialData )
    {
      form.reset( {
        ...initialData,
      } );
    }
  }, [ initialData ] );
  const onSubmit: SubmitHandler<TStore> = async ( data ) =>
  {
    // console.log(form.formState.dirtyFields)
    if ( form.formState.dirtyFields )
    {
      try
      {
        var result = await updateStoreMutation.mutateAsync( {
          id: initialData.id,
          data: {
            startingStoreCashLending: data.startingStoreCashLending,
            status: data.status,
          },
        } );
        if ( result.status >= 200 && result.status < 300 )
        {
          toast.success( "Cập nhật cửa hàng thành công" )
        } else
        {
          toast.success( "Cập nhật cửa hàng thất bại" )
        }
      } catch ( error )
      {
        handleApiError( error );
      }
    }
  };
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
          <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 gap-4">
            <Card className="shadow-none border-none bg-white">
              <CardContent className="space-y-4">
                <FormField
                  control={ form.control }
                  name="id"
                  render={ ( { field } ) =>
                  {
                    return (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <Input
                            type="hidden"
                            { ...field }
                            value={ field.value ?? "" }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  } }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="code"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Mã cửa hàng *</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                value={ field.value ?? "" }
                                disabled
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
                      name="managerName"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Chủ quản lý</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="shortName"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Tên ngắn</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="name"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Tên cửa hàng *</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="phone"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="email"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="address"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="wifiName"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Tên wifi</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="wifiPassword"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Mật khẩu wifi</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                                disabled
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
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
                      name="startingStoreCashLending"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Số tiền tạm ứng</FormLabel>
                            <FormControl>
                              <Input
                                { ...field }
                                value={ field.value ?? "" }
                                placeholder="Chưa cập nhật"
                                disabled={ updateStoreMutation.isPending }
                                onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
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
                      name="status"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select disabled={ updateStoreMutation.isPending } onValueChange={ ( value ) => field.onChange( Number( value ) ) } defaultValue={ field.value?.toString() }>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">Hoạt động</SelectItem>
                                <SelectItem value="1">Không hoạt động</SelectItem>
                              </SelectContent>
                            </Select>
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
          <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button
              className="py-5 px-10"
              type="submit"
              disabled={ updateStoreMutation.isPending }
            >
              Cập Nhật
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditStoreForm;
