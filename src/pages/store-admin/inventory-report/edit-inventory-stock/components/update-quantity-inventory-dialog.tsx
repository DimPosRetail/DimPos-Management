import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "@/hooks/use-inventory";
import { handleApiError } from "@/lib/error";
import {
  UpdateInventoryStockRequestSchema,
  type TUpdateInventoryStockRequest,
} from "@/schema/inventory.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

type Props = {
  inventoryStockId: string;
  children: ReactNode;
};

const UpdateQuantityInventoryDialog = ({
  inventoryStockId,
  children,
}: Props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false); // State riêng để theo dõi chế độ "other"
  
  const { updateQuantityInventoryStockMutation } = useInventory();
  const form = useForm<TUpdateInventoryStockRequest>({
    resolver: zodResolver(UpdateInventoryStockRequestSchema),
  });

  const onSubmit = async (data: TUpdateInventoryStockRequest) => {
    if (updateQuantityInventoryStockMutation.isPending) return;
    try {
      await updateQuantityInventoryStockMutation.mutateAsync({
        id: inventoryStockId,
        data,
      });
      toast.success("Cập nhật số lượng thành công");
      setOpen(false);
      form.reset();
      setIsOtherReason(false); // Reset state khi đóng dialog
      queryClient.invalidateQueries({
        queryKey: ["inventory-stock", inventoryStockId],
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset form và state khi đóng dialog
      form.reset();
      setIsOtherReason(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa số lượng thành phần</DialogTitle>
          <DialogDescription>
            Chỉnh sửa số lượng của thành phần trong kho.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={updateQuantityInventoryStockMutation.isPending}
                      placeholder="Nhập số lượng"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reasonManualAdjustment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do cập nhật *</FormLabel>
                  {!isOtherReason ? (
                    <Select
                      onValueChange={(value) => {
                        if (value === "other") {
                          setIsOtherReason(true);
                          form.setValue("reasonManualAdjustment", "");
                        } else {
                          field.onChange(value);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn lý do cập nhật" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sản phẩm bị hỏng">
                          Sản phẩm bị hỏng
                        </SelectItem>
                        <SelectItem value="Sản phẩm quá hạn">
                          Sản phẩm quá hạn
                        </SelectItem>
                        <SelectItem value="other">Khác....</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <FormControl>
                        <Textarea
                          disabled={
                            updateQuantityInventoryStockMutation.isPending
                          }
                          placeholder="Nhập lý do cập nhật thủ công"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsOtherReason(false);
                          form.setValue("reasonManualAdjustment", "");
                        }}
                      >
                        ← Quay lại danh sách
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={updateQuantityInventoryStockMutation.isPending}
                      placeholder="Nhập ghi chú"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsOtherReason(false);
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateQuantityInventoryStockMutation.isPending}
              >
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateQuantityInventoryDialog;