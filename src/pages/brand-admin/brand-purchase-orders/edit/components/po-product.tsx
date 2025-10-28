import ConfirmDialog from "@/components/dialog/confirm-dialog";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
import { handleApiError } from "@/lib/error";
import { handleChangeModalState } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import {
  mapToUpdateStorePurchaseOrder,
  StorePurchaseOrder,
  type TStorePurchaseOrder,
} from "@/schema/internal-purchase-orders.schema";
import { StorePurchaseOrderStatusEnum } from "@/types/enums/store-purchase-order-status.enum";
import { zodResolver } from "@hookform/resolvers/zod"; // import { useEffect } from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { columns } from "./po-item/columns";

type Props = {
  initialData: TStorePurchaseOrder;
};

const EditPOProductForm = ({ initialData }: Props) => {
  //   const navigate = useNavigate();
  const { updateInternalPurchaseOrderMutation } = useInternalPurchaseOrders();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.modal);

  const form = useForm<TStorePurchaseOrder>({
    resolver: zodResolver(StorePurchaseOrder),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        createdDate: initialData.createdDate
          ? new Date(initialData.createdDate)
          : undefined,
        completedAt: initialData.completedAt
          ? new Date(initialData.completedAt)
          : undefined,
        confirmedByBrandAt: initialData.confirmedByBrandAt
          ? new Date(initialData.confirmedByBrandAt)
          : undefined,
        cancelledAt: initialData.cancelledAt
          ? new Date(initialData.cancelledAt)
          : undefined,
        lastModifiedDate: initialData.lastModifiedDate
          ? new Date(initialData.lastModifiedDate)
          : undefined,
        storePurchaseOrderItems: initialData.storePurchaseOrderItems?.map(
          (item) => ({
            ...item,
            approvedQuantityByBrand:
              item.approvedQuantityByBrand ?? item.requestedQuantity,
          })
        ),
      });
    }
  }, [initialData]);

  //Status: New
  const onSubmit: SubmitHandler<TStorePurchaseOrder> = async (data) => {
    //Find and update approvedQuantityByBrand of purchase order item
    const updatedItems = data.storePurchaseOrderItems?.map((item) => {
      const updated = poQuantity.find((q) => q.id === item.id);
      return updated
        ? {
            ...item,
            approvedQuantityByBrand:
              updated.approvedQuantityByBrand ??
              item.approvedQuantityByBrand ??
              item.requestedQuantity,
          }
        : item;
    });
    const finalData = {
      ...data,
      storePurchaseOrderItems: updatedItems,
    };
    const updateStorePurchaseOrder = mapToUpdateStorePurchaseOrder(finalData);
    console.log(updateStorePurchaseOrder);
    try {
      await updateInternalPurchaseOrderMutation.mutateAsync({
        id: finalData.id,
        data: updateStorePurchaseOrder,
      });
      toast.success("Cập nhật phiếu yêu cầu nhập hàng thành công!");
      // navigate(-1);
    } catch (error) {
      handleApiError(error);
    }
  };

  const [poQuantity, setPoQuantity] = useState<
    Pick<TStorePurchaseOrderItem, "id" | "approvedQuantityByBrand">[]
  >([]);
  const handleConfirmSubmit = (cancellationReasonByBrand?: string) => {
    form.handleSubmit(
      (data) => {
        const updatedData = {
          ...data,
          cancellationReasonByBrand:
            cancellationReasonByBrand || data.cancellationReasonByBrand,
        };
        onSubmit(updatedData);
      },
      (errors) => {
        console.log("Validation errors:", errors);
      }
    )();
  };
  const handlePoQuantityChange = (id: string, value: number) => {
    setPoQuantity((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) {
        return prev.map((item) =>
          item.id === id ? { ...item, approvedQuantityByBrand: value } : item
        );
      } else {
        return [...prev, { id, approvedQuantityByBrand: value }];
      }
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
      >
        <ConfirmDialog
          open={isOpen}
          onOpenChange={(open) => dispatch(handleChangeModalState(open))}
          title="Xác nhận cập nhật các cửa hàng sử dụng thực đơn"
          description="Bạn có chắc chắn muốn cập nhật các cửa hàng sử dụng thực đơn này không?"
          actionLabel="Xác nhận"
          onAction={(reason) => handleConfirmSubmit(reason)}
          hasTextArea={
            form.getValues("status") ===
              StorePurchaseOrderStatusEnum.CancelledByBrand ||
            form.getValues("status") ===
              StorePurchaseOrderStatusEnum.RejectedByBrand
          }
          textPlaceHolder="Nhập lý do..."
        />
        <Card className="bg-neutral-0">
          <CardContent>
            <DataTable
              columns={columns}
              data={
                (initialData.storePurchaseOrderItems ??
                  []) as TStorePurchaseOrderItem[]
              }
              totalItems={initialData.storePurchaseOrderItems?.length ?? 0}
              currentPage={1}
              pageSize={initialData.storePurchaseOrderItems?.length ?? 0}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              isPagingProp={false}
              meta={{
                poQuantityValues: poQuantity,
                onPoQuantityChange: handlePoQuantityChange,
                poStatus: initialData.status,
              }}
              rowSelection={(initialData.storePurchaseOrderItems ?? []).reduce<
                Record<string, boolean>
              >((acc, item) => {
                acc[item.id] = poQuantity.some(
                  (changedItem) =>
                    changedItem.id === item.id &&
                    changedItem.approvedQuantityByBrand !==
                      item.approvedQuantityByBrand
                );
                return acc;
              }, {})}
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        {initialData.status === StorePurchaseOrderStatusEnum.New && (
          <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button
              className="py-5 px-10 bg-white text-black border border-black"
              type="submit"
              disabled={false}
            >
              Hủy
            </Button>
            <Button className="py-5 px-10" type="submit" disabled={false}>
              Lưu
            </Button>
          </div>
        )}
        {initialData.status === StorePurchaseOrderStatusEnum.BrandConfirmed && (
          <div className="flex justify-end h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button
              className="py-5 px-10 bg-white text-black border border-black"
              type="submit"
              disabled={false}
            >
              Đóng đơn
            </Button>
            <Button className="py-5 px-10" type="submit" disabled={false}>
              Cập nhật
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default EditPOProductForm;
