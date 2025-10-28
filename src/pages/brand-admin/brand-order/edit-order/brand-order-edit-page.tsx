// src/pages/category/edit/category-edit-page.tsx
// import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import { handleApiError } from "@/lib/error";

import
{
  Form
} from "@/components/ui/form";
import { useOrder } from "@/hooks/use-order";
import type { TBrandOrder } from "@/schema/order.schema";
import { BrandOrderSchema } from "@/schema/order.schema";
import { CalendarIcon } from "lucide-react";

import { getOrderTypeLabel } from "@/types/enums/order-type.enum";
// import {
//   getOrderStatusLabel,
//   OrderStatusEnum,
//   type TOrderStatusEnum,
// } from "@/types/enums/order-status.enum";
import { cn } from "@/lib/utils";
// import { getOrderStatusLabel } from "@/types/enums/order-status.enum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { formatCurrency } from '../../../../lib/utils';
import OrderItemTable from "./components/order-item-table";
import { getOrderStatusLabel2 } from "@/types/enums/order-status.enum";

const BrandOrderEditPage = () =>
{
  const { id } = useParams<{ id: string }>();
  //   const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const {
    data: brandOrderData,
    error: orderError,
    isError: isOrderError,
  } = getOrderById( id! );
  //   const [createdDateOpen, setCreatedDateOpen] = useState(false);

  if ( isOrderError && orderError )
  {
    handleApiError( orderError );
  }
  const initialData = ( brandOrderData?.data.data || {} ) as Partial<TBrandOrder>;

  const form = useForm<TBrandOrder>( {
    resolver: zodResolver( BrandOrderSchema ),
    defaultValues: {
      ...initialData,
      createdDate: initialData.createdDate
        ? new Date( initialData.createdDate )
        : undefined,
    },
  } );

  const onSubmit: SubmitHandler<TBrandOrder> = async ( data ) =>
  {
    console.log( data );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Thông tin đơn hàng</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Form { ...form }>
          <form
            onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
              console.log( errors )
            ) }
          >
            <Card className="bg-white shadow-none border-none">
              <CardHeader className="font-medium text-xl">Tổng quan</CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Kiểu phục vụ</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ getOrderTypeLabel( form.getValues( "type" ) ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Trạng thái</label>
                    { ( () =>
                    {
                      const { label, className } = getOrderStatusLabel2( form.getValues( "status" ) );
                      return (
                        <div className={ `inline-block px-3 py-2 rounded bg-gray-50 text-sm font-semibold ${ className }` }>
                          { label }
                        </div>
                      );
                    } )() }
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Thời gian tạo</label>
                    <div className={ cn(
                      "w-full px-3 py-2 rounded bg-gray-50 text-left font-semibold flex items-center",
                      !form.getValues( "createdDate" ) && "text-muted-foreground"
                    ) }>
                      { form.getValues( "createdDate" )
                        ? format( new Date( form.getValues( "createdDate" ) ), "EEEE, dd 'tháng' MM, yyyy hh:mm aa", { locale: vi } )
                        : <span></span>
                      }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Thời gian nhận hàng</label>
                    <div className={ cn(
                      "w-full px-3 py-2 rounded bg-gray-50 text-left font-semibold flex items-center",
                      !form.getValues( "pickupTime" ) && "text-muted-foreground"
                    ) }>
                      { form.getValues( "pickupTime" )
                        ? format( new Date( form.getValues( "pickupTime" ) as Date ), "EEEE, dd 'tháng' MM, yyyy hh:mm aa", { locale: vi } )
                        : <span>Chưa xác định</span>
                      }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-medium mb-1 text-gray-600">Phương thức thanh toán</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ form.getValues( "systemPaymentMethodNameSnapshot" ) ?? "" }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Tiền trước giảm</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "subTotalAmount" ) ?? 0 ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Tiền giảm</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "discountAmount" ) ?? 0 ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Tiền thuế</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "taxAmount" ) ?? 0 ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Tổng giá trị đơn hàng</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "totalAmount" ) ?? 0 ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Tiền làm tròn</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "cashRoundingAmount" ) ?? 0 ) }</div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-600">Thực nhận</label>
                    <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ formatCurrency( form.getValues( "amountPaid" ) ?? 0 ) }</div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-gray-600">Khuyến mãi áp dụng</label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      { form.getValues( "appliedOrderPromotions" )?.length > 0 ? (
                        <div className="space-y-3">
                          { form.getValues( "appliedOrderPromotions" ).map( ( promo, idx ) => (
                            <div key={ promo.id || idx }>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-800">
                                  { promo.promotionNameSnapshot }
                                </span>
                                <span className="text-red-600 font-medium">
                                  -{ promo.discountAmountApplied?.toLocaleString() }₫
                                </span>
                              </div>
                              { promo.promotionDescriptionSnapshot && (
                                <p className="text-sm text-gray-600">
                                  { promo.promotionDescriptionSnapshot }
                                </p>
                              ) }
                            </div>
                          ) ) }
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Không có khuyến mãi</p>
                      ) }
                    </div>
                  </div>
                  {
                    form.getValues( "note" ) && (
                      <div className="md:col-span-2">
                        <label className="block font-medium mb-1 text-gray-600">Ghi chú</label>
                        <div className="px-3 py-2 rounded bg-gray-50 text-gray-900 font-semibold">{ form.getValues( "note" ) ?? "" }</div>
                      </div>
                    )
                  }
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
      <div>
        <Card className="bg-white shadow-none border-none">
          <CardHeader className="font-medium text-xl">
            Sản phẩm trong đơn hàng
          </CardHeader>
          <CardContent>
            <OrderItemTable
              initialData={ brandOrderData?.data.data.orderItems ?? [] }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandOrderEditPage;
