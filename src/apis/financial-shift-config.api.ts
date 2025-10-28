import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TCreateStoreFinancialShiftConfig, TStoreFinancialShift, TStoreFinancialShiftConfig, TUpdateStoreFinancialShiftConfig } from "@/schema/financial-shift-configs";

const getFinancialShiftConfigByStore = async (params?: any) =>
  await apiRequest.store.get<BaseResponse<PaginationResponse<TStoreFinancialShiftConfig>>>(
    API_SUFFIX.STORE_FINANCIAL_SHIFT_CONFIG_API,
    { params }
  );

  const getFinancialShiftConfigByStoreById = async (id: string) =>
  await apiRequest.store.get<BaseResponse<TStoreFinancialShiftConfig>>(
    `${API_SUFFIX.STORE_FINANCIAL_SHIFT_CONFIG_API}/${id}`
  );
const createFinancialShiftConfigByStore= async (data: TCreateStoreFinancialShiftConfig) =>
  await apiRequest.store.post<BaseResponse<TStoreFinancialShiftConfig>>(
    API_SUFFIX.STORE_FINANCIAL_SHIFT_CONFIG_API,
    data
  );
const updateFinancialShiftConfigByStore = async (id: string, data: TUpdateStoreFinancialShiftConfig) =>
  await apiRequest.store.put<BaseResponse<TStoreFinancialShiftConfig>>(
    `${API_SUFFIX.STORE_FINANCIAL_SHIFT_CONFIG_API}/${id}`,
    data
  );


  const getFinancialShiftByStore = async (params?: any) =>
  await apiRequest.store.get<BaseResponse<PaginationResponse<TStoreFinancialShift>>>(
    API_SUFFIX.STORE_FINANCIAL_SHIFT_API,
    { params }
  );

  const getFinancialShiftByStoreById = async (id: string) =>
  await apiRequest.store.get<BaseResponse<TStoreFinancialShift>>(
    `${API_SUFFIX.STORE_FINANCIAL_SHIFT_API}/${id}`
  );
export const financialShiftConfigApi = {
    //FinancialShiftConfig
  getFinancialShiftConfigByStore,
  getFinancialShiftConfigByStoreById,
  createFinancialShiftConfigByStore,
  updateFinancialShiftConfigByStore,
    // FinancialShift
  getFinancialShiftByStore,
  getFinancialShiftByStoreById,
};

