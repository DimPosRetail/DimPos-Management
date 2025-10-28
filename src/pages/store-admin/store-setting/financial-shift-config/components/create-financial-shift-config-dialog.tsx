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

import type { UseMutationResult } from "@tanstack/react-query";
import { CreateStoreFinancialShiftConfigSchema, type TCreateStoreFinancialShiftConfig } from "@/schema/financial-shift-configs";
import { handleApiError } from "@/lib/error";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createConfigMutation: UseMutationResult<any, unknown, TCreateStoreFinancialShiftConfig>;
}

const CreateFinancialShiftDialog = ({ open, onOpenChange, createConfigMutation }: Props) => {
  const form = useForm<TCreateStoreFinancialShiftConfig>({
    resolver: zodResolver(CreateStoreFinancialShiftConfigSchema),
    defaultValues: {
      openingTime: "",
      closingTime: "",
    },
  });

  const onSubmit = async (data: TCreateStoreFinancialShiftConfig) => {
    try {
      await createConfigMutation.mutateAsync(data);
      form.reset();
      toast.success("Tạo cấu hình ca tài chính thành công");
      onOpenChange(false);
    } catch (e) {
      handleApiError(e)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo ca tài chính</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={createConfigMutation.isPending}>
              {createConfigMutation.isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFinancialShiftDialog;
