import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UpdateStoreFinancialShiftConfigSchema, type TStoreFinancialShiftConfig, type TUpdateStoreFinancialShiftConfig } from "@/schema/financial-shift-configs";
import { handleApiError } from "@/lib/error";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: TStoreFinancialShiftConfig | null;
    updateMutation: any;
}

const UpdateFinancialShiftDialog = ({ open, onOpenChange, data, updateMutation }: Props) => {
    const form = useForm<TUpdateStoreFinancialShiftConfig>({
        resolver: zodResolver(UpdateStoreFinancialShiftConfigSchema),
        defaultValues: {
            openingTime: "",
            closingTime: "",
            isActive: true,
        },
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (open && data) {
            reset({
                openingTime: data.openingTime ?? "",
                closingTime: data.closingTime ?? "",
                isActive: data.isActive ?? true,
            });
        }
    }, [open, data, reset]);

    const onSubmit = async (values: TUpdateStoreFinancialShiftConfig) => {
        if (!data) return;
        try {
            await updateMutation.mutateAsync({ id: data.id, data: values });
            toast.success("Cập nhật cấu hình ca tài chính thành công");
            onOpenChange(false);
        } catch (e) {
            handleApiError(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật ca tài chính</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="openingTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giờ mở ca</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="closingTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giờ đóng ca</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-4">
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                                            />
                                            <span className={field.value ? "text-green-600" : "text-red-600"}>
                                                {field.value ? "Đang hoạt động" : "Ngừng hoạt động"}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateFinancialShiftDialog;
