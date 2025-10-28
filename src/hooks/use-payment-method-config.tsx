import { paymentMethodConfigApi } from "@/apis/payment-method-config.api";
import type { TAddPaymentMethod, TCreatePaymentMethodConfig, TUpdateStorePaymentMethodStatus } from "@/schema/payment-method-config.schema";
import { PaymentMethodTypeEnum } from "@/types/enums/payment-method-type-enum";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const usePaymentMethodConfig = ( {
  onUpdateStatusSuccess,
}: {
  onUpdateStatusSuccess?: () => void;
} = {} ) =>
{
  const queryClient = useQueryClient();

  const useGetConfigs = () =>
    useQuery( {
      queryKey: [ "payment-method-configs" ],
      queryFn: () => paymentMethodConfigApi.getPaymentMethodConfigByStore(),
      select: ( res ) => res.data,
    } );

  const updateConfigStatus = useMutation( {
    mutationFn: ( {
      id,
      data,
    }: {
      id: string;
      data: TUpdateStorePaymentMethodStatus;
    } ) => paymentMethodConfigApi.updatePaymentMethodStatusByStore( id, data ),
    onSuccess: ( _res, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "payment-method-configs" ] } );
      queryClient.invalidateQueries( { queryKey: [ "payment-method-config", id ] } );
      onUpdateStatusSuccess?.();
    },
  } );

  const addPaymentMethodMutation = useMutation( {
    mutationFn: ( data: TCreatePaymentMethodConfig ) =>
    {
      const createdData: TAddPaymentMethod = {
        systemPaymentMethodId: data.systemPaymentMethodId,
        credentialsConfigAtStore: null,
      }

      if ( data.paymentMethodType === PaymentMethodTypeEnum.QR_VIETQR ||
        data.paymentMethodType === PaymentMethodTypeEnum.QR_EDC ||
        data.paymentMethodType === PaymentMethodTypeEnum.CARD_EDC
      )
      {
        createdData.credentialsConfigAtStore = JSON.stringify( data.mPosRequest );
      } else if ( data.paymentMethodType === PaymentMethodTypeEnum.QR_PAYOS )
      {
        createdData.credentialsConfigAtStore = JSON.stringify( data.payOsRequest );
      }
      return paymentMethodConfigApi.addPaymentMethod( createdData );
    }
  } )

  return {
    useGetConfigs,
    updateConfigStatus,
    addPaymentMethodMutation,
  };
};
export interface UseSystemPaymentMethodsParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
}

export const useSystemPaymentMethod = ( {
  onUpdateStatusSuccess,
}: {
  onUpdateStatusSuccess?: () => void;
} = {} ) =>
{
  const queryClient = useQueryClient();

  const getSystemPaymentMethods = ( params: UseSystemPaymentMethodsParams = {} ) =>
  {
    const {
      page = 1,
      size = 10,
      sortBy = "createdDate",
      isAsc = true,
      name = "",
    } = params;

    return useQuery( {
      queryKey: [
        "system-payment-methods",
        {
          page,
          size,
          sortBy,
          isAsc,
          name,
        },
      ],
      queryFn: () =>
        paymentMethodConfigApi.getPaymentMethodBySystemAdmin( {
          page,
          size,
          sortBy,
          isAsc,
          name,
        } ),
      placeholderData: keepPreviousData,
    } );
  };

  const getSystemPaymentMethodById = ( id: string ) =>
  {
    return useSuspenseQuery( {
      queryKey: [ "system-payment-method", id ],
      queryFn: () => paymentMethodConfigApi.getPaymentMethodBySystemAdminById( id ),
    } );
  };
  const updateSystemPaymentMethod = useMutation( {
    mutationFn: ( {
      id,
      data,
    }: {
      id: string;
      data: FormData;
    } ) => paymentMethodConfigApi.updateSystemPaymentMethod( id, data ),
    onSuccess: ( _res, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "payment-method" ] } );
      queryClient.invalidateQueries( { queryKey: [ "payment-method", id ] } );
      onUpdateStatusSuccess?.();
    },
  } );
  return {
    getSystemPaymentMethods,
    getSystemPaymentMethodById,
    updateSystemPaymentMethod,
  };
};