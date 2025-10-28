import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePaymentMethodConfig } from "@/hooks/use-payment-method-config";
import { handleApiError } from "@/lib/error";
import type { TStorePaymentMethodConfig } from "@/schema/payment-method-config.schema";
import AddPaymentMethodDialog from "./add-payment-method-dialog";

const PaymentMethodConfigView = () =>
{
  const { updateConfigStatus, useGetConfigs } = usePaymentMethodConfig( {
    onUpdateStatusSuccess: () => toast.success( "Cập nhật trạng thái thành công" ),
  } );
  const { data, isLoading, isError, error } = useGetConfigs();

  if ( isError && error )
  {
    handleApiError( error );
  }
  const columns: ColumnDef<TStorePaymentMethodConfig>[] = useMemo(
    () => [
      {
        id: "stt",
        header: () => <div className="font-semibold text-base text-center">STT</div>,
        cell: ( info ) => (
          <div className="text-center">{ info.row.index + 1 }</div>
        ),
        size: 60,
      },
      {
        accessorKey: "name",
        header: () => <div className="font-semibold text-base text-center">Tên phương thức</div>,
        cell: ( info ) => (
          <div className="text-center w-full">{ info.getValue() as string }</div>
        ),
      },
      {
        accessorKey: "code",
        header: () => <div className="text-center w-full text-base">Mã phương thức</div>,
        cell: ( info ) => (
          <div className="text-center w-full">{ info.getValue() as string }</div>
        ),
      },
      {
        id: "isActiveByStore",
        header: () => (
          <div className="text-center font-semibold text-base">Trạng thái</div>
        ),
        cell: ( { row } ) =>
        {
          const { id, isActiveByStore } = row.original;

          const handleToggle = async ( checked: boolean ) =>
          {
            try
            {
              await updateConfigStatus.mutateAsync( {
                id,
                data: { isActiveByStore: checked },
              } );
            } catch ( error )
            {
              toast.error( "Cập nhật trạng thái thất bại" );
            }
          };

          return (
            <div className="flex items-center justify-center gap-2">
              <Switch
                checked={ isActiveByStore }
                onCheckedChange={ handleToggle }
                disabled={ updateConfigStatus.isPending }
                className={
                  isActiveByStore
                    ? "data-[state=checked]:bg-green-500"
                    : "data-[state=unchecked]:bg-red-500"
                }
              />
              <span
                className={ `text-sm font-semibold ${ isActiveByStore ? "text-green-600" : "text-red-500" }` }
              >
                { isActiveByStore ? "Bật" : "Tắt" }
              </span>
            </div>
          );
        },
      },
    ],
    [ updateConfigStatus ]
  );

  return (
    <Card className="col-span-full bg-white shadow-none border-none gap-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cấu hình phương thức thanh toán</CardTitle>
        <AddPaymentMethodDialog
          existingSystemPaymentMethodIds={ data?.data.map( item => item.systemPaymentMethodId ) || [] }
        >
          <Button
          >
            + Thêm phương thức thanh toán
          </Button>
        </AddPaymentMethodDialog>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={ columns }
          isLoading={ isLoading }
          data={ data?.data || [] }
          isPagingProp={ false }
          totalItems={ data?.data.length || 0 }
          currentPage={ 1 }
          pageSize={ 10 }
          onPageChange={ () => { } }
          onPageSizeChange={ () => { } }
        />
      </CardContent>
    </Card >
  );
};

export default PaymentMethodConfigView;
