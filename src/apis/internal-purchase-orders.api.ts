import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

import type {
  TCreateInternalOrderRequest,
  TInternalPurchaseOrderinStore,
  TStorePurchaseOrder,
  TUpdateStorePurchaseOrder
} from "@/schema/internal-purchase-orders.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";

// // ==== INTERNAL PURCHASE ORDERS ====

const getListPurchaseOrder = async (params?: any) =>
  await apiRequest.order.get<BaseResponse<PaginationResponse<TStorePurchaseOrder>>>(
    API_SUFFIX.INTERNAL_PURCHASE_ORDER_API,
    { params }
  );

const getPurchaseOrderById = async (id: string) =>
  await apiRequest.order.get<BaseResponse<TStorePurchaseOrder>>(
    `${API_SUFFIX.INTERNAL_PURCHASE_ORDER_API}/${id}`
  );

const createInternalOrder = async (data: TCreateInternalOrderRequest) =>
  await apiRequest.order.post<BaseResponse<TStorePurchaseOrder>>(
    API_SUFFIX.INTERNAL_PURCHASE_ORDER_API,
    data
  );

const update = async (id: string, data: Partial<TUpdateStorePurchaseOrder>) =>
  await apiRequest.order.put<BaseResponse<TUpdateStorePurchaseOrder>>(
    `${API_SUFFIX.INTERNAL_PURCHASE_ORDER_API}/${id}`,
    data
  );

// const requestCancel = async (id: string, reason: string) =>
//   await apiRequest.inventory.patch<BaseResponse<TStorePurchaseOrder>>(
//     `${API_SUFFIX.INTERNAL_PURCHASE_ORDER_API}/${id}/cancel`,
//     { reason }
//   );

// ==== EXPORT COMBINED API ====

const getListPurchaseOrderbyStore = async (params?: any) =>
  await apiRequest.order.get<BaseResponse<PaginationResponse<TInternalPurchaseOrderinStore>>>(
    API_SUFFIX.INTERNAL_PURCHASE_ORDER_API,
    { params }
  );
const getPurchaseOrderByIdbyStore = async (id: string) =>
  await apiRequest.order.get<BaseResponse<TInternalPurchaseOrderinStore>>(
    `${API_SUFFIX.INTERNAL_PURCHASE_ORDER_API}/${id}`
  );
export const internalPOApi = {
  getListPurchaseOrder,
  getPurchaseOrderById,
  createInternalOrder,
  update,
  //   requestCancel,
  getListPurchaseOrderbyStore,
  getPurchaseOrderByIdbyStore,

};
