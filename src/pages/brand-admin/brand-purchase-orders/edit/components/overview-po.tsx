import ConfirmDialog from "@/components/dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import
{
  Card,
  CardContent
} from "@/components/ui/card";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import
{
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { handleChangeModalState } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import
{
  mapToUpdateStorePurchaseOrder,
  StorePurchaseOrder,
  type TStorePurchaseOrder,
} from "@/schema/internal-purchase-orders.schema";
import
{
  StorePurchaseOrderStatusEnum,
} from "@/types/enums/store-purchase-order-status.enum";
import { zodResolver } from "@hookform/resolvers/zod"; // import { useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  initialData: TStorePurchaseOrder;
};

const EditPurchaseOrderForm = ( { initialData }: Props ) =>
{
  //   const navigate = useNavigate();
  const { updateInternalPurchaseOrderMutation } = useInternalPurchaseOrders();
  const dispatch = useDispatch();
  const { isOpen } = useSelector( ( state: RootState ) => state.modal );

  const form = useForm<TStorePurchaseOrder>( {
    resolver: zodResolver( StorePurchaseOrder ),
    defaultValues: initialData,
  } );

  // useEffect(() => {
  //   if (initialData) {
  //     form.reset({
  //       ...initialData,
  //       createdDate: initialData.createdDate
  //         ? new Date(initialData.createdDate)
  //         : undefined,
  //       completedAt: initialData.completedAt
  //         ? new Date(initialData.completedAt)
  //         : undefined,
  //       confirmedByBrandAt: initialData.confirmedByBrandAt
  //         ? new Date(initialData.confirmedByBrandAt)
  //         : undefined,
  //       cancelledAt: initialData.cancelledAt
  //         ? new Date(initialData.cancelledAt)
  //         : undefined,
  //       lastModifiedDate: initialData.lastModifiedDate
  //         ? new Date(initialData.lastModifiedDate)
  //         : undefined,
  //       storePurchaseOrderItems: initialData.storePurchaseOrderItems?.map(
  //         (item) => ({
  //           ...item,
  //           approvedQuantityByBrand:
  //             item.approvedQuantityByBrand ?? item.requestedQuantity,
  //         })
  //       ),
  //     });
  //   }
  // }, [initialData]);
  const onSubmit: SubmitHandler<TStorePurchaseOrder> = async ( data ) =>
  {
    //Find and update approvedQuantityByBrand of purchase order item
    const updatedItems = data.storePurchaseOrderItems?.map( ( item ) =>
    {
      const updated = poQuantity.find( ( q ) => q.id === item.id );
      return updated
        ? {
          ...item,
          approvedQuantityByBrand:
            updated.approvedQuantityByBrand ??
            item.approvedQuantityByBrand ??
            item.requestedQuantity,
        }
        : item;
    } );

    //Get remain data
    const finalData = {
      ...data,
      storePurchaseOrderItems: updatedItems,
    };
    // console.log(finalData);

    const updateStorePurchaseOrder = mapToUpdateStorePurchaseOrder( finalData );
    console.log( updateStorePurchaseOrder );
    try
    {
      await updateInternalPurchaseOrderMutation.mutateAsync( {
        id: finalData.id,
        data: updateStorePurchaseOrder,
      } );
      toast.success( "Cập nhật phiếu yêu cầu nhập hàng thành công!" );
      // navigate(-1);
    } catch ( error )
    {
      handleApiError( error );
    }
  };

  const [ poQuantity, _ ] = useState<
    Pick<TStorePurchaseOrderItem, "id" | "approvedQuantityByBrand">[]
  >( [] );
  const handleConfirmSubmit = ( cancellationReasonByBrand?: string ) =>
  {
    form.handleSubmit(
      ( data ) =>
      {
        const updatedData = {
          ...data,
          cancellationReasonByBrand:
            cancellationReasonByBrand || data.cancellationReasonByBrand,
        };
        onSubmit( updatedData );
      },
      ( errors ) =>
      {
        console.log( "Validation errors:", errors );
      }
    )();
  };
  return (
    <Form { ...form }>
      <form
        onSubmit={ form.handleSubmit( onSubmit, ( errors ) => console.log( errors ) ) }
      >
        <ConfirmDialog
          open={ isOpen }
          onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
          title="Xác nhận cập nhật các cửa hàng sử dụng thực đơn"
          description="Bạn có chắc chắn muốn cập nhật các cửa hàng sử dụng thực đơn này không?"
          actionLabel="Xác nhận"
          onAction={ ( reason ) => handleConfirmSubmit( reason ) }
          hasTextArea={
            form.getValues( "status" ) ===
            StorePurchaseOrderStatusEnum.CancelledByBrand ||
            form.getValues( "status" ) ===
            StorePurchaseOrderStatusEnum.RejectedByBrand
          }
          textPlaceHolder="Nhập lý do..."
        />
        <Card className="bg-neutral-0 mb-10">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                <FormField
                  control={ form.control }
                  name={ `store.name` }
                  render={ ( { field } ) =>
                  {
                    return (
                      <FormItem>
                        <FormLabel>Cửa hàng</FormLabel>
                        <FormControl>
                          <Input
                            disabled={ true }
                            { ...field }
                            value={ field.value }
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
                  name={ `createdByAccount.username` }
                  render={ ( { field } ) =>
                  {
                    return (
                      <FormItem>
                        <FormLabel>Người tạo</FormLabel>
                        <FormControl>
                          <Input
                            disabled={ true }
                            { ...field }
                            value={ field.value }
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
                  name="createdDate"
                  render={ ( { field } ) =>
                  {
                    return (
                      <FormItem>
                        <FormLabel>Ngày tạo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled>
                            <FormControl>
                              <Button
                                variant={ "outline" }
                                className={ cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                ) }
                              >
                                { field.value ? (
                                  format(
                                    field.value,
                                    "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                    { locale: vi }
                                  )
                                ) : (
                                  <span>Chưa hoàn thành</span>
                                ) }
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={ field.value ?? undefined }
                              onSelect={ field.onChange }
                              disabled={ ( date ) =>
                                date > new Date() ||
                                date < new Date( "1900-01-01" )
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    );
                  } }
                />
              </div>
              { ( initialData.status ==
                StorePurchaseOrderStatusEnum.CancelledByStore ||
                initialData.status ==
                StorePurchaseOrderStatusEnum.CancelledByBrand ||
                initialData.status ==
                StorePurchaseOrderStatusEnum.RejectedByBrand ) && (
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="cancelledAt"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Ngày hủy</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild disabled>
                                <FormControl>
                                  <Button
                                    variant={ "outline" }
                                    className={ cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    ) }
                                  >
                                    { field.value ? (
                                      format(
                                        field.value,
                                        "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                        { locale: vi }
                                      )
                                    ) : (
                                      <span>Chưa hoàn thành</span>
                                    ) }
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={ field.value ?? undefined }
                                  onSelect={ field.onChange }
                                  disabled={ ( date ) =>
                                    date > new Date() ||
                                    date < new Date( "1900-01-01" )
                                  }
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                ) }
              { initialData.status ==
                StorePurchaseOrderStatusEnum.DoneByStore && (
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="completedAt"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Ngày hoàn thành</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild disabled>
                                <FormControl>
                                  <Button
                                    variant={ "outline" }
                                    className={ cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    ) }
                                  >
                                    { field.value ? (
                                      format(
                                        field.value,
                                        "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                        { locale: vi }
                                      )
                                    ) : (
                                      <span>Chưa hoàn thành</span>
                                    ) }
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={ field.value ?? undefined }
                                  onSelect={ field.onChange }
                                  disabled={ ( date ) =>
                                    date > new Date() ||
                                    date < new Date( "1900-01-01" )
                                  }
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                ) }
              { initialData.status ==
                StorePurchaseOrderStatusEnum.BrandConfirmed && (
                  <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
                    <FormField
                      control={ form.control }
                      name="confirmedByBrandAt"
                      render={ ( { field } ) =>
                      {
                        return (
                          <FormItem>
                            <FormLabel>Ngày chấp nhận</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild disabled>
                                <FormControl>
                                  <Button
                                    variant={ "outline" }
                                    className={ cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    ) }
                                  >
                                    { field.value ? (
                                      format(
                                        field.value,
                                        "EEEE, dd 'tháng' MM, yyyy hh:mm aa",
                                        { locale: vi }
                                      )
                                    ) : (
                                      <span>Chưa hoàn thành</span>
                                    ) }
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={ field.value ?? undefined }
                                  onSelect={ field.onChange }
                                  disabled={ ( date ) =>
                                    date > new Date() ||
                                    date < new Date( "1900-01-01" )
                                  }
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        );
                      } }
                    />
                  </div>
                ) }
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 items-center">
              <FormField
                control={ form.control }
                name={ `estimatedTotalValue` }
                render={ ( { field } ) =>
                {
                  return (
                    <FormItem>
                      <FormLabel>Tổng đơn</FormLabel>
                      <FormControl>
                        <Input
                          disabled={ true }
                          { ...field }
                          value={ field.value ?? "" }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                } }
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
              <FormField
                control={ form.control }
                name={ `noteFromStore` }
                render={ ( { field } ) =>
                {
                  return (
                    <FormItem>
                      <FormLabel>Ghi chú từ cửa hàng</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={ true }
                          { ...field }
                          value={ field.value ?? "" }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                } }
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
              <FormField
                control={ form.control }
                name={ `noteFromBrand` }
                render={ ( { field } ) =>
                {
                  return (
                    <FormItem>
                      <FormLabel>Ghi chú từ thương hiệu</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={ false }
                          { ...field }
                          value={ field.value ?? "" }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                } }
              />
            </div>
            { initialData.status ==
              StorePurchaseOrderStatusEnum.CancelledByStore && (
                <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                  <FormField
                    control={ form.control }
                    name={ `cancellationRequestReasonByStore` }
                    render={ ( { field } ) =>
                    {
                      return (
                        <FormItem>
                          <FormLabel>Lý do hủy của cửa hàng</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={ false }
                              { ...field }
                              value={ field.value ?? "" }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    } }
                  />
                </div>
              ) }
            { initialData.status ==
              StorePurchaseOrderStatusEnum.CancelledByStore && (
                <div className="grid grid-cols-1 lg:grid-cols-1 items-center pb-6">
                  <FormField
                    control={ form.control }
                    name={ `cancellationReasonByBrand` }
                    render={ ( { field } ) =>
                    {
                      return (
                        <FormItem>
                          <FormLabel>Lý do hủy của thương hiệu</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={ false }
                              { ...field }
                              value={ field.value ?? "" }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    } }
                  />
                </div>
              ) }
          </CardContent>
        </Card>
        { initialData.status === StorePurchaseOrderStatusEnum.New && (
          <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button
              className="py-5 px-10 bg-white text-black border border-black"
              type="submit"
              disabled={ false }
            >
              Hủy
            </Button>
            <Button className="py-5 px-10" type="submit" disabled={ false }>
              Lưu
            </Button>
          </div>
        ) }
        { initialData.status === StorePurchaseOrderStatusEnum.BrandConfirmed && (
          <div className="flex justify-end h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
            <Button
              className="py-5 px-10 bg-white text-black border border-black"
              type="submit"
              disabled={ false }
            >
              Đóng đơn
            </Button>
            <Button className="py-5 px-10" type="submit" disabled={ false }>
              Cập nhật
            </Button>
          </div>
        ) }
      </form>
    </Form>
  );
};

export default EditPurchaseOrderForm;
