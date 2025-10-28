import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBrand } from '@/hooks/use-brand';
import { handleApiError } from '@/lib/error';
import { PATH_ADMIN_DASHBOARD } from '@/routes/path';
import { CreateBrandSchema, type TCreateBrandRequest } from '@/schema/brand-management.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CreateBrandPage = () => {
  const navigate = useNavigate();
  const { createBrand } = useBrand();
  const createBrandMutation = createBrand();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TCreateBrandRequest>({
    resolver: zodResolver(CreateBrandSchema),
    defaultValues: {
      code: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      picture: undefined,
      username: '',
      password: '',
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    form.setValue('picture', file);
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('picture', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: TCreateBrandRequest) => {
    if (createBrandMutation.isPending) return;

    const formData = new FormData();
    formData.append('Code', data.code);
    formData.append('Name', data.name);
    formData.append('Email', data.email);
    formData.append('Phone', data.phone);
    formData.append('Address', data.address);
    formData.append('Username', data.username);
    formData.append('Password', data.password);
    if (data.picture) formData.append('Picture', data.picture);

    try {
      await createBrandMutation.mutateAsync(formData);
      navigate(PATH_ADMIN_DASHBOARD.brand.root); // ➤ chuyển về danh sách thương hiệu
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Tạo Thương Hiệu Mới</h1>
        </div>

        <Card className="bg-white shadow-none border-none">
          <CardHeader>
            <CardTitle>Ảnh đại diện</CardTitle>
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative w-40 h-40">
                <img src={imagePreview} className="w-full h-full object-cover rounded" alt="Ảnh xem trước" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm">Nhấn để tải ảnh lên</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none border-none">
          <CardHeader>
            <CardTitle>Thông Tin Cơ Bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã thương hiệu *</FormLabel>
                    <FormControl><Input {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thương hiệu *</FormLabel>
                    <FormControl><Input {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl><Input {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl><Textarea {...field} disabled={createBrandMutation.isPending} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập *</FormLabel>
                    <FormControl><Input {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu *</FormLabel>
                    <FormControl><Input type="password" {...field} disabled={createBrandMutation.isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>



        <div className="flex justify-end">
          <Button type="submit" disabled={createBrandMutation.isPending} className="px-8 py-4">
            Tạo thương hiệu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBrandPage;
