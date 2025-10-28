import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TAddPaymentMethod, TStorePaymentMethodConfig, TSystemPaymentMethod, TUpdateStorePaymentMethodStatus } from "@/schema/payment-method-config.schema";


const getPaymentMethodConfigByStore = async () =>
  await apiRequest.store.get<BaseResponse<TStorePaymentMethodConfig[]>>(
    API_SUFFIX.STORE_PAYMENT_METHOD_CONFIG_API
  );

const addPaymentMethod = async (data: TAddPaymentMethod) =>
  await apiRequest.store.post(
    API_SUFFIX.STORE_PAYMENT_METHOD_CONFIG_API,
    data
  );

const updatePaymentMethodStatusByStore = (id: string, data: TUpdateStorePaymentMethodStatus) =>
  apiRequest.store.put<BaseResponse<TStorePaymentMethodConfig>>(
    `${API_SUFFIX.STORE_PAYMENT_METHOD_CONFIG_API}/${id}`,
    data
  );

//System Admin
const getPaymentMethodBySystemAdmin = async (params?: any) =>
  await apiRequest.payment.get<BaseResponse<PaginationResponse<TSystemPaymentMethod>>>(
    API_SUFFIX.SYSTEM_PAYMENT_METHOD_API, { params }
  );

const getPaymentMethodBySystemAdminById = async (id: string) =>
  await apiRequest.payment.get<BaseResponse<TSystemPaymentMethod>>(
    `${API_SUFFIX.SYSTEM_PAYMENT_METHOD_API}/${id}`
  );

const updateSystemPaymentMethod = (id: string, data: FormData) =>
  apiRequest.payment.put<BaseResponse<TSystemPaymentMethod>>(
    `${API_SUFFIX.SYSTEM_PAYMENT_METHOD_API}/${id}`,
    data
  );
export const paymentMethodConfigApi = {
  //Store
  getPaymentMethodConfigByStore,
  addPaymentMethod,
  updatePaymentMethodStatusByStore,

  //SystemAdmin
  getPaymentMethodBySystemAdmin,
  getPaymentMethodBySystemAdminById,
  updateSystemPaymentMethod,
};
