import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateStaffSchema, type TStaff, type TUpdateStaff } from "@/schema/staff.schema";
import { useEffect } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { handleApiError } from "@/lib/error";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    staff: TStaff | null;
    updateStaffMutation: any;
}

const UpdateAccountDialog = ({ open, onOpenChange, staff, updateStaffMutation }: Props) => {
    const form = useForm<TUpdateStaff>({
        resolver: zodResolver(UpdateStaffSchema),
        defaultValues: {
            code: "",
            username: "",
            password: "",
            email: "",
            status: undefined,
        },
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (open && staff) {
            reset({
                code: staff.code ?? "",
                username: staff.username ?? "",
                email: staff.email ?? "",
                status: staff.status ?? undefined,
                password: "",
            });
        }
    }, [open, staff, reset]);

const onSubmit = async (data: TUpdateStaff) => {
  if (!staff) return;

  try {
    await updateStaffMutation.mutateAsync({ id: staff.id, data });
    form.reset(data);
    toast.success("Cập nhật thông tin nhân viên thành công");
    onOpenChange(false);
  } catch (error) {
    handleApiError(error);
  }
};


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật nhân viên</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã nhân viên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mã nhân viên" {...field} value={field.value ?? ""} />
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
                                        <Input placeholder="Tên đăng nhập" {...field} value={field.value ?? ""} />
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
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Mật khẩu" {...field} value={field.value ?? ""} />
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
                                    <FormLabel>Email (không bắt buộc)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value?.toString() ?? ""}
                                            onValueChange={(value: string) => field.onChange(Number(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Đang hoạt động</SelectItem>
                                                <SelectItem value="1">Ngừng hoạt động</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>
                            <Button type="submit" disabled={updateStaffMutation.isPending}>
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAccountDialog;
