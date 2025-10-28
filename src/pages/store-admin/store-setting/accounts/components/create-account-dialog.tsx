import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CreateAccountSchema, type TCreateAccount } from "@/schema/staff.schema";
import type { UseMutationResult } from "@tanstack/react-query";
import { handleApiError } from "@/lib/error";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createStaffMutation: UseMutationResult<any, unknown, TCreateAccount>;
}

const CreateStaffDialog = ({ open, onOpenChange, createStaffMutation }: Props) => {
  const form = useForm<TCreateAccount>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      code: "",
      username: "",
      password: "",
      email: null,
    },
  });

 const onSubmit = async (data: TCreateAccount) => {
  try {
    await createStaffMutation.mutateAsync(data);
    form.reset();
    toast.success("Tạo tài khoản nhân viên thành công");
    onOpenChange(false);
  } catch (error) {
    handleApiError(error);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản nhân viên</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhân viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Mã nhân viên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên đăng nhập" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={createStaffMutation.isPending}>
              {createStaffMutation.isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffDialog;
