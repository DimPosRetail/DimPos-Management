import { orderApi, } from "@/apis/order.api";
import { useQuery, useSuspenseQuery, keepPreviousData } from "@tanstack/react-query";
import type { TGetStoreOrdersQuery } from "@/schema/order.schema";

interface UseOrderParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  status?: string | null;
  type?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export const useStoreOrder = () =>
{
  const getStoreOrders = ( params: TGetStoreOrdersQuery = {} ) =>
  {
    const {
      page = 1,
      pageSize = 30,
      sortBy = null,
      isAsc = true,
      status = null,
      type = null,
    } = params;

    return useQuery( {
      queryKey: [
        "orders",
        {
          page,
          pageSize,
          sortBy,
          isAsc,
          status,
          type,
        },
      ],
      queryFn: () =>
        orderApi.getStoreOrders( {
          page,
          pageSize,
          sortBy,
          isAsc,
          status,
          type,
        } ),
      // Adding keepPreviousData from your branch for better UX
      placeholderData: keepPreviousData,
    } );
  };

  const getStoreOrderById = ( id: string ) =>
  {
    return useSuspenseQuery( {
      queryKey: [ "order", id ],
      queryFn: () => orderApi.getStoreOrderById( id ),
    } );
  };

  return {
    getStoreOrders,
    getStoreOrderById,
  };
};

export const useOrder = () =>
{

  const getOrders = ( params: UseOrderParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      status = params.status || null,
      type = params.type || null,
      fromDate = params.fromDate || null,
      toDate = params.toDate || null,
    } = params;

    return useQuery( {
      queryKey: [
        "orders",
        {
          page,
          pageSize: size,
          sortBy,
          isAsc,
          status,
          type,
          fromDate,
          toDate,
        },
      ],
      queryFn: () =>
        orderApi.getBrandOrders( {
          page: page,
          pageSize: size,
          sortBy: sortBy,
          isAsc: isAsc,
          status: status,
          type: type,
          fromDate: fromDate,
          toDate: toDate,
        } ),
      placeholderData: keepPreviousData,
    } );
  };

  const getOrderById = ( id: string ) =>
    useSuspenseQuery( {
      queryKey: [ "order", id ],
      queryFn: () => orderApi.getBrandOrderById( id ),
    } );

  //   const updateOrder = () =>
  //     useMutation({
  //       mutationFn: (params: { id: string; data: FormData }) =>
  //         orderApi.updateProductsByBrandOrderId(params.id, params.data),
  //     });

  return {
    getOrders,
    getOrderById,
  };
};
