import ConfirmDialog from "@/components/dialog/confirm-dialog";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
import { handleApiError } from "@/lib/error";
import RejectPODialog from "@/pages/brand-admin/brand-purchase-orders/edit/components/dialogs/reject-purchase-order-dialog";
import { handleChangeModalState, handleSetRejectDialogState } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import {
  InternalPurchaseOrderinStore,
  mapToUpdateStorePurchaseOrder,
  type TInternalPurchaseOrderinStore,
  type TStorePurchaseOrder,
} from "@/schema/internal-purchase-orders.schema";
import {
  getStorePurchaseOrderStatusLabel2,
  StorePurchaseOrderStatusEnum,
} from "@/types/enums/store-purchase-order-status.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { columns } from "./components/po-item/columns";

const StorePurchasePage = () =>
{
  const { id } = useParams<{ id: string }>();
  const { getInternalPurchaseOrderByIdbyStore, updateInternalPurchaseOrderMutation } = useInternalPurchaseOrders();
  const dispatch = useDispatch();
  const { rejectDialogOpen: isRejectOpen, isOpen } = useSelector(
    ( state: RootState ) => state.modal
  );

  const {
    data: brandPurchaseData,
    error: orderError,
    isError: isOrderError,
  } = getInternalPurchaseOrderByIdbyStore( id as string );

  if ( isOrderError && orderError )
  {
    handleApiError( orderError );
  }

  const initialData = ( brandPurchaseData?.data.data || {} ) as TInternalPurchaseOrderinStore;

  const form = useForm<TInternalPurchaseOrderinStore>( {
    resolver: zodResolver( InternalPurchaseOrderinStore ),
    defaultValues: initialData,
  } );

  useEffect( () =>
  {
    if ( initialData )
    {
      form.reset( {
        ...initialData,
        createdDate: initialData.createdDate ? new Date( initialData.createdDate ) : undefined,
        completedAt: initialData.completedAt ? new Date( initialData.completedAt ) : undefined,
        confirmedByBrandAt: initialData.confirmedByBrandAt
          ? new Date( initialData.confirmedByBrandAt )
          : undefined,
        cancelledAt: initialData.cancelledAt ? new Date( initialData.cancelledAt ) : undefined,
        lastModifiedDate: initialData.lastModifiedDate
          ? new Date( initialData.lastModifiedDate )
          : undefined,
        storePurchaseOrderItems: initialData.storePurchaseOrderItems?.map( ( item ) => ( {
          ...item,
          approvedQuantityByBrand: item.approvedQuantityByBrand ?? item.requestedQuantity,
        } ) ),
      } );
    }
  }, [ initialData ] );
  const onSubmit: SubmitHandler<TStorePurchaseOrder> = async ( data ) =>
  {
    // //Find and update approvedQuantityByBrand of purchase order item
    // const updatedItems = data.storePurchaseOrderItems?.map( ( item ) =>
    // {
    //   const updated = poQuantity.find( ( q ) => q.id === item.id );
    //   return updated
    //     ? {
    //       ...item,
    //       approvedQuantityByBrand:
    //         updated.approvedQuantityByBrand ??
    //         item.approvedQuantityByBrand ??
    //         item.requestedQuantity,
    //     }
    //     : item;
    // } );
    // const finalData = {
    //   ...data,
    //   storePurchaseOrderItems: updatedItems,
    // };
    const updateStorePurchaseOrder = mapToUpdateStorePurchaseOrder( data );
    try
    {
      await updateInternalPurchaseOrderMutation.mutateAsync( {
        id: data.id,
        data: updateStorePurchaseOrder,
      } );
      toast.success( "Cập nhật phiếu yêu cầu nhập hàng thành công!" );
      // navigate(-1);
    } catch ( error )
    {
      handleApiError( error );
    }
  };

  const handleCancelOrderSubmit = ( cancellationRequestReasonByStore?: string ) =>
  {
    form.handleSubmit(
      async ( data ) =>
      {
        const updatedData: TStorePurchaseOrder = {
          ...data,
          status: StorePurchaseOrderStatusEnum.CancelledByStore,
          cancellationRequestReasonByStore:
            cancellationRequestReasonByStore || data.cancellationRequestReasonByStore,
        };
        await onSubmit( updatedData );
        dispatch( handleSetRejectDialogState( false ) );
      },
      ( errors ) =>
      {
        console.log( "Validation errors:", errors );
      }
    )();
  };

  const handleDoneOrderSubmit = () =>
  {
    form.handleSubmit(
      async ( data ) =>
      {
        const updatedData: TStorePurchaseOrder = {
          ...data,
          status: StorePurchaseOrderStatusEnum.DoneByStore,
        };
        await onSubmit( updatedData );
      },
      ( errors ) =>
      {
        console.log( "Validation errors:", errors );
      }
    )();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Phiếu nhập hàng</h1>
      </div>
      <Form { ...form }>
        <form>
          <ConfirmDialog
            open={ isOpen }
            onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
            title="Xác nhận hoàn tất đơn hàng"
            description="Bạn có chắc chắn muốn xác nhận hoàn tất này không?"
            actionLabel="Xác nhận"
            onAction={ handleDoneOrderSubmit }
            hasTextArea={
              form.getValues( "status" ) ===
              StorePurchaseOrderStatusEnum.CancelledByBrand ||
              form.getValues( "status" ) ===
              StorePurchaseOrderStatusEnum.RejectedByBrand
            }
            textPlaceHolder="Nhập lý do..."
          />
          <RejectPODialog
            open={ isRejectOpen }
            onOpenChange={ ( open ) => dispatch( handleSetRejectDialogState( open ) ) }
            title="Hủy phiếu nhập hàng"
            description="Bạn có muốn hủy đơn nhập hàng này không? Trước khi hủy, vui lòng nhập lý do để tránh sai sót."
            onAction={ ( reason ) => handleCancelOrderSubmit( reason ) }
            hasTextArea={ true }
            textPlaceHolder="Nhập lý do..."
          />
          <Card className="bg-neutral-0 mb-10">
            <CardHeader className="text-xl font-semibold">Thông tin cơ bản</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                <FormField
                  control={ form.control }
                  name="store"
                  render={ () => (
                    <FormItem>
                      <FormLabel>Cửa hàng</FormLabel>
                      <FormControl>
                        <Input disabled value={ initialData?.store?.name ?? "Không xác định" } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="status"
                  render={ ( { field } ) =>
                  {
                    const { label, className } =
                      getStorePurchaseOrderStatusLabel2(field.value);

                    return (
                      <FormItem>
                        <FormLabel>Trạng thái đơn hàng</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-normal w-full ${className}`}
                            >
                              { label }
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  } }
                />
                <FormField
                  control={ form.control }
                  name="store.address"
                  render={ () => (
                    <FormItem>
                      <FormLabel>Địa chỉ cửa hàng</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={ initialData?.store?.address ?? "Chưa cập nhật" }
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="store.phone"
                  render={ () => (
                    <FormItem>
                      <FormLabel>Số điện thoại cửa hàng</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={ initialData?.store?.phone ?? "Chưa cập nhật" }
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="createdDate"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Ngày tạo</FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                          { field.value
                            ? format( field.value, "EEEE, dd 'tháng' MM, yyyy hh:mm aa", {
                              locale: vi,
                            } )
                            : "Chưa hoàn thành" }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="estimatedTotalValue"
                  render={ ( { field } ) =>
                  {
                    const formattedValue = new Intl.NumberFormat( "vi-VN" ).format( Number( field.value ?? 0 ) );
                    return (
                      <FormItem>
                        <FormLabel>Tổng giá trị đơn hàng</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-1 px-3 h-10 rounded-md border border-input bg-muted text-sm">
                            <span>{ formattedValue }</span>
                            <span>₫</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  } }
                />
                <FormField
                  control={ form.control }
                  name="confirmedByBrandAt"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Ngày xác nhận</FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                          { field.value
                            ? format( field.value, "EEEE, dd 'tháng' MM, yyyy hh:mm aa", {
                              locale: vi,
                            } )
                            : "Chưa xác nhận" }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </FormItem>
                  ) }
                />

                { ( initialData.completedAt || initialData.cancelledAt ) && (
                  <FormField
                    control={ form.control }
                    name={ initialData.completedAt ? "completedAt" : "cancelledAt" }
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>
                          { initialData.completedAt ? "Đơn hàng hoàn tất lúc" : "Đơn hàng bị hủy lúc" }
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm px-3">
                            { field.value
                              ? format( field.value, "EEEE, dd 'tháng' MM, yyyy hh:mm aa", {
                                locale: vi,
                              } )
                              : "Không có thông tin" }
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </div>
                        </FormControl>
                      </FormItem>
                    ) }
                  />
                ) }
              </div>
              { initialData.noteFromStore && (
                <FormField
                  control={ form.control }
                  name="noteFromStore"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Ghi chú từ cửa hàng</FormLabel>
                      <FormControl>
                        <Textarea disabled value={ field.value ?? "" } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
              ) }

              { initialData.noteFromBrand && (
                <FormField
                  control={ form.control }
                  name="noteFromBrand"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Ghi chú từ thương hiệu</FormLabel>
                      <FormControl>
                        <Textarea disabled value={ field.value ?? "" } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
              ) }

              { initialData.status === StorePurchaseOrderStatusEnum.CancelledByBrand &&
                initialData.cancellationRequestReasonByStore && (
                  <FormField
                    control={ form.control }
                    name="cancellationRequestReasonByStore"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Lý do hủy của cửa hàng</FormLabel>
                        <FormControl>
                          <Textarea disabled value={ field.value ?? "" } />
                        </FormControl>
                      </FormItem>
                    ) }
                  />
                ) }

            </CardContent>
          </Card>

          <Card className="bg-neutral-0 mb-10">
            <CardHeader className="text-xl font-semibold">Các sản phẩm</CardHeader>
            <CardContent>
              <DataTable
                columns={ columns }
                data={ ( initialData.storePurchaseOrderItems ?? [] ) as TStorePurchaseOrderItem[] }
                totalItems={ initialData.storePurchaseOrderItems?.length ?? 0 }
                currentPage={ 1 }
                pageSize={ initialData.storePurchaseOrderItems?.length ?? 0 }
                onPageChange={ () => { } }
                onPageSizeChange={ () => { } }
                isPagingProp={ false }
                isShort={ ( initialData.storePurchaseOrderItems ?? [] ).length < 5 }
                meta={ {
                  poQuantityValues: [],
                  poStatus: initialData.status,
                } }
                rowSelection={ {} }
              />
            </CardContent>
          </Card>

          { initialData.status === StorePurchaseOrderStatusEnum.New && (
            <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
              <Button
                className="py-5 px-10 bg-white text-red-100 border border-red-100 hover:bg-gray-100"
                type="button"
                onClick={ () =>
                {
                  dispatch( handleSetRejectDialogState( true ) );
                } }
              >
                Hủy đơn
              </Button>
            </div>
          ) }
          { initialData.status === StorePurchaseOrderStatusEnum.BrandConfirmed && (
            <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
              <Button
                className="py-5 px-10"
                type="button"
                onClick={ () =>
                {
                  dispatch( handleChangeModalState( true ) );
                } }
              >
                Xác nhận đơn
              </Button>
            </div>
          ) }
        </form>
      </Form>
    </div>
  );
};

export default StorePurchasePage;
