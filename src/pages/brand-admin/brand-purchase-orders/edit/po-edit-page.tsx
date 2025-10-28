import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
import { handleApiError } from "@/lib/error";
// import { cn } from "@/lib/utils";
import {
  handleSetBrandConfirmDialogState,
  handleSetRejectDialogState,
} from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import {
  mapToUpdateStorePurchaseOrder,
  StorePurchaseOrder,
  type TStorePurchaseOrder,
} from "@/schema/internal-purchase-orders.schema";
import { getStorePurchaseOrderStatusLabel2, StorePurchaseOrderStatusEnum } from "@/types/enums/store-purchase-order-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import BrandConfirmPODialog from "./components/dialogs/brand-confirm-purchase-order-dialog";
import RejectPODialog from "./components/dialogs/reject-purchase-order-dialog";
import { columns } from "./components/po-item/columns";

const BrandPurchaseEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { rejectDialogOpen: isRejectOpen } = useSelector(
    (state: RootState) => state.modal
  );
  const { brandConfirmDialogOpen: isBrandConfirmOpen } = useSelector(
    (state: RootState) => state.modal
  );
  //   const navigate = useNavigate();
  const { getInternalPurchaseOrderById, updateInternalPurchaseOrderMutation } =
    useInternalPurchaseOrders();
  // const { getStoreById } = useStore();
  const {
    data: brandPurchaseData,
    error: orderError,
    isError: isOrderError,
    // isLoading: isOrderLoading,
  } = getInternalPurchaseOrderById(id as string);

  // var store = undefined as Partial<TStore> | undefined;

  if (isOrderError && orderError) {
    handleApiError(orderError);
  }
  const initialData = (brandPurchaseData?.data.data ||
    {}) as TStorePurchaseOrder;
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
  const handleBrandConfirmSubmit = (
    newStorePurchaseOrderItems?: TStorePurchaseOrderItem[]
  ) => {
    form.handleSubmit(
      async (data) => {
        const updatedData: TStorePurchaseOrder = {
          ...data,
          status: StorePurchaseOrderStatusEnum.BrandConfirmed,
          confirmedByBrandAt: new Date(), // hoặc toISOString() tuỳ backend
          storePurchaseOrderItems:
            newStorePurchaseOrderItems ?? data.storePurchaseOrderItems,
        };
        await onSubmit(updatedData); // onSubmit đã async
        // đóng dialog / reset pending
        dispatch(handleSetBrandConfirmDialogState(false));
      },
      (errors) => {
        console.log("Validation errors:", errors);
      }
    )();
  };

  const handleRejectSubmit = (cancellationReasonByBrand?: string) => {
    form.handleSubmit(
      async (data) => {
        const updatedData: TStorePurchaseOrder = {
          ...data,
          status: StorePurchaseOrderStatusEnum.RejectedByBrand,
          cancellationReasonByBrand:
            cancellationReasonByBrand || data.cancellationReasonByBrand,
        };
        await onSubmit(updatedData);
        dispatch(handleSetRejectDialogState(false));
      },
      (errors) => {
        console.log("Validation errors:", errors);
      }
    )();
  };
  const handleCancelSubmit = (cancellationReasonByBrand?: string) => {
    form.handleSubmit(
      async (data) => {
        const updatedData: TStorePurchaseOrder = {
          ...data,
          status: StorePurchaseOrderStatusEnum.CancelledByBrand,
          cancellationReasonByBrand:
            cancellationReasonByBrand || data.cancellationReasonByBrand,
        };
        await onSubmit(updatedData);
        dispatch(handleSetRejectDialogState(false));
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
  // const handleUpdateOrder = () =>
  // {
  //   form.handleSubmit(
  //     async ( data ) =>
  //     {
  //       const updatedData: TStorePurchaseOrder = {
  //         ...data,
  //         status: StorePurchaseOrderStatusEnum.BrandConfirmed,
  //         // noteFromBrand: data.noteFromBrand,
  //       };
  //       await onSubmit( updatedData );
  //     },
  //     ( errors ) =>
  //     {
  //       console.log( "Validation errors:", errors );
  //     }
  //   )();
  // };

  // const handleDoneOrder = () =>
  // {
  //   form.handleSubmit(
  //     async ( data ) =>
  //     {
  //       const updatedData: TStorePurchaseOrder = {
  //         ...data,
  //         status: StorePurchaseOrderStatusEnum.DoneByStore,
  //         // noteFromBrand: data.noteFromBrand,
  //         completedAt: new Date(),
  //       };
  //       await onSubmit( updatedData );
  //     },
  //     ( errors ) =>
  //     {
  //       console.log( "Validation errors:", errors );
  //     }
  //   )();
  // };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Phiếu nhập hàng</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log(errors)
          )}
        >
          <RejectPODialog
            open={isRejectOpen}
            onOpenChange={(open) => dispatch(handleSetRejectDialogState(open))}
            title="Hủy phiếu nhập hàng"
            description="Bạn có muốn hủy đơn nhập hàng này không? Trước khi hủy, vui lòng nhập lý do để tránh sai sót."
            onAction={(reason) =>
              initialData.status === StorePurchaseOrderStatusEnum.New
                ? handleRejectSubmit(reason)
                : handleCancelSubmit(reason)
            }
            hasTextArea={true}
            textPlaceHolder="Nhập lý do..."
          />
          <BrandConfirmPODialog
            open={isBrandConfirmOpen}
            onOpenChange={(open) =>
              dispatch(handleSetBrandConfirmDialogState(open))
            }
            title="Xác nhận phiếu nhập hàng"
            description="Bạn có muốn duyệt đơn nhập hàng này không? Trước khi duyệt, vui lòng nhập lý do để tránh sai sót."
            onAction={(reason) => handleBrandConfirmSubmit(reason)}
            storePurchaseOrderItems={initialData.storePurchaseOrderItems ?? []}
            textPlaceHolder="Nhập lý do..."
          />
          <Card className="bg-neutral-0 mb-10">
            <CardHeader className="text-xl font-semibold">
              Thông tin cơ bản
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                <FormField
                  control={form.control}
                  name={`store.name`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Cửa hàng</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    const { label, className } = getStorePurchaseOrderStatusLabel2(field.value);

                    return (
                      <FormItem>
                        <FormLabel>Trạng thái đơn hàng</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-normal w-full ${className}`}
                            >
                              {label}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="store.address"
                  render={() => (
                    <FormItem>
                      <FormLabel>Địa chỉ cửa hàng</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={initialData?.store?.address ?? "Chưa cập nhật"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="store.phone"
                  render={() => (
                    <FormItem>
                      <FormLabel>Số điện thoại cửa hàng</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={initialData?.store?.phone ?? "Chưa cập nhật"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`createdByAccount.username`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Người tạo</FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="estimatedTotalValue"
                  render={({ field }) => {
                    const formattedValue = new Intl.NumberFormat(
                      "vi-VN"
                    ).format(Number(field.value ?? 0));
                    return (
                      <FormItem>
                        <FormLabel>Tổng giá trị đơn hàng</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-1 px-3 h-10 rounded-md border border-input bg-muted text-sm">
                            <span>{formattedValue}</span>
                            <span>₫</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="createdDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tạo</FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                          {field.value
                            ? format(
                                field.value,
                                "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                {
                                  locale: vi,
                                }
                              )
                            : "Chưa hoàn thành"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmedByBrandAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày xác nhận</FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                          {field.value
                            ? format(
                                field.value,
                                "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                {
                                  locale: vi,
                                }
                              )
                            : "Chưa xác nhận"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {(initialData.completedAt || initialData.cancelledAt) && (
                  <FormField
                    control={form.control}
                    name={
                      initialData.completedAt ? "completedAt" : "cancelledAt"
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {initialData.completedAt
                            ? "Đơn hàng hoàn tất lúc"
                            : "Đơn hàng bị hủy lúc"}
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                            {field.value
                              ? format(
                                  field.value,
                                  "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                  {
                                    locale: vi,
                                  }
                                )
                              : "Không có thông tin"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                <FormField
                  control={form.control}
                  name={`noteFromStore`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Ghi chú từ cửa hàng</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={true}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                <FormField
                  control={form.control}
                  name={`noteFromBrand`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Ghi chú từ thương hiệu</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={
                              initialData.status ===
                              StorePurchaseOrderStatusEnum.CancelledByBrand
                            }
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              {initialData.status ==
                StorePurchaseOrderStatusEnum.CancelledByStore && (
                <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                  <FormField
                    control={form.control}
                    name={`cancellationRequestReasonByStore`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Lý do hủy của cửa hàng</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={false}
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}
              {initialData.status ==
                StorePurchaseOrderStatusEnum.CancelledByBrand && (
                <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                  <FormField
                    control={form.control}
                    name={`cancellationReasonByBrand`}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Lý do hủy của thương hiệu</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={true}
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-neutral-0 mb-10">
            <CardHeader className="text-xl font-semibold">
              Các sản phẩm
            </CardHeader>
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
                isShort={(initialData.storePurchaseOrderItems ?? []).length < 5}
                meta={{
                  poQuantityValues: poQuantity,
                  onPoQuantityChange: handlePoQuantityChange,
                  poStatus: initialData.status,
                }}
                rowSelection={(
                  initialData.storePurchaseOrderItems ?? []
                ).reduce<Record<string, boolean>>((acc, item) => {
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
          </Card>
          {initialData.status === StorePurchaseOrderStatusEnum.New && (
            <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
              <Button
                className="py-5 px-10 bg-white text-red-100 border border-red-100 hover:bg-gray-100"
                type="button"
                onClick={() => {
                  dispatch(handleSetRejectDialogState(true));
                }}
              >
                Hủy đơn
              </Button>
              <Button
                className="py-5 px-10"
                type="button"
                onClick={() => {
                  dispatch(handleSetBrandConfirmDialogState(true));
                }}
              >
                Duyệt
              </Button>
            </div>
          )}
          {initialData.status ===
            StorePurchaseOrderStatusEnum.BrandConfirmed && (
            <div className="flex justify-end h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-5 bg-transparent z-10">
              <Button
                className="py-5 px-10 bg-white text-red-100 border border-red-100 hover:bg-gray-100"
                type="button"
                disabled={false}
                onClick={() => {
                  // const updatedData = {
                  //   ...initialData,
                  //   status: StorePurchaseOrderStatusEnum.CancelledByBrand,
                  //   createdDate: initialData.createdDate
                  //     ? new Date( initialData.createdDate )
                  //     : undefined,
                  //   confirmedByBrandAt: initialData.confirmedByBrandAt
                  //     ? new Date( initialData.confirmedByBrandAt )
                  //     : undefined,
                  //   lastModifiedDate: initialData.lastModifiedDate
                  //     ? new Date( initialData.lastModifiedDate )
                  //     : undefined,
                  //   storePurchaseOrderItems: [],
                  // };
                  // form.reset( updatedData );
                  dispatch(handleSetRejectDialogState(true));
                }}
              >
                Hủy đơn
              </Button>
              {/* <Button
                  className="py-5 px-10 bg-white text-black border border-black-10 hover:bg-gray-100"
                  type="button"
                  onClick={ handleDoneOrder }
                >
                  Đóng đơn
                </Button> */}

              {/* <Button
                  className="py-5 px-10"
                  type="button"
                  onClick={ handleUpdateOrder }
                >
                  Cập nhật
                </Button> */}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BrandPurchaseEditPage;
