import { apiRequest } from "@/lib/http";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type { TBrandOrder, TStoreOrderResponse } from "@/schema/order.schema";

const getBrandOrders = async (params: any) => 
    await apiRequest.order.get<BaseResponse<PaginationResponse<TBrandOrder>>>(`${API_SUFFIX.ORDER_API}`, {params});

const getBrandOrderById = async (id: string) =>
    await apiRequest.order.get<BaseResponse<TBrandOrder>>(`${API_SUFFIX.ORDER_API}/${id}`);

// const updateBrandOrderId = async (id: string, data: { productVariantIds: string[] }) =>
//     await apiRequest.order.patch<BaseResponse<TBrandOrder>>(`${API_SUFFIX.ORDER_API}/${id}`, data);

const getStoreOrders = async (params?: any) =>
  await apiRequest.order.get<BaseResponse<PaginationResponse<TStoreOrderResponse>>>(
    API_SUFFIX.ORDER_API, 
    { params }
  );

const getStoreOrderById = async (id: string) =>
  await apiRequest.order.get<BaseResponse<TStoreOrderResponse>>(
    `${API_SUFFIX.ORDER_API}/${id}`
  );

export const orderApi = {
  getStoreOrders,
  getStoreOrderById,
  getBrandOrders,
  getBrandOrderById,
};
