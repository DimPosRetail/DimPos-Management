// import { useStore } from "@/hooks/use-store";
// import { handleApiError } from "@/lib/error";
// import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import
{
  CreateStoreRequest,
  type TCreateStoreRequest,
} from "@/schema/store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateStorePage = () =>
{
  const { createStoreMutation } = useStore();
  const navigator = useNavigate();
  const form = useForm<TCreateStoreRequest>( {
    resolver: zodResolver( CreateStoreRequest ),
  } );

  // useEffect(() => {
  //   if (initialData) {
  //     form.reset({
  //       ...initialData,
  //     });
  //   }
  // }, [initialData]);

  const onSubmit: SubmitHandler<TCreateStoreRequest> = async ( data ) =>
  {
    console.log( data );
    try
    {
      const result = await createStoreMutation.mutateAsync( data );
      if ( result.data.status >= 200 && result.data.status < 300 )
      {
        toast.success( "Tạo cửa hàng thành công." );
        navigator( -1 );
      } else
      {
        toast.error( "Tạo cửa hàng thất bại" );
      }
    } catch ( error )
    {
      handleApiError( error );
    }
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Thông tin cửa hàng</h1>
      </div>
      <Form { ...form }>
        <form
          className="relative"
          onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
          {
            console.error( "Form validation errors:", errors );
          } ) }
        >
          <div className="container pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 gap-4 mb-10">
              <Card className="shadow-none border-none bg-white">
                <CardHeader className="font-medium text-base pb-2">
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
                              <FormLabel>Mã cửa hàng *</FormLabel>
                              <FormControl>
                                <Input
                                  { ...field }
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập mã cửa hàng"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên chủ quản lý"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên cửa hàng"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên ngắn"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập số điện thoại cửa hàng"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập email cửa hàng"
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
                        name="startingStoreCashLending"
                        render={ ( { field } ) =>
                        {
                          return (
                            <FormItem>
                              <FormLabel>
                                Nhập tiền két khởi điểm của cửa hàng
                              </FormLabel>
                              <FormControl>
                                <Input
                                  { ...form.register(
                                    "startingStoreCashLending",
                                    { valueAsNumber: true }
                                  ) }
                                  onChange={ ( e ) =>
                                    field.onChange( Number( e.target.value ) )
                                  }
                                  type="number"
                                  min={ 1 }
                                  step={ 1 }
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tiền két khởi điểm của cửa hàng"
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
                        name="address"
                        render={ ( { field } ) =>
                        {
                          return (
                            <FormItem>
                              <FormLabel>Địa chỉ</FormLabel>
                              <FormControl>
                                <Input
                                  { ...field }
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên cửa hàng"
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
                    {/* <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Kinh độ</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="Nhập tên cửa hàng"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Vĩ độ</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="Nhập tên cửa hàng"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div> */}
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên cửa hàng"
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
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên cửa hàng"
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
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập tên cửa hàng"
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
              <Card className="shadow-none border-none bg-white">
                <CardHeader className="font-medium text-base pb-2">
                  Tài khoản chủ cửa hàng
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                      <FormField
                        control={ form.control }
                        name="username"
                        render={ ( { field } ) =>
                        {
                          return (
                            <FormItem>
                              <FormLabel>Nhập tên tài khoản</FormLabel>
                              <FormControl>
                                <Input
                                  { ...field }
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập để tạo tài khoản cửa hàng"
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
                        name="password"
                        render={ ( { field } ) =>
                        {
                          return (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  { ...field }
                                  value={ field.value ?? "" }
                                  disabled={ createStoreMutation.isPending }
                                  placeholder="Nhập mật khẩu cửa hàng"
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
            <Button className="mr-8 py-5 px-10" type="submit" disabled={ createStoreMutation.isPending }>
              Tạo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateStorePage;
