import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TAddStoreTaxRateRequest, TCreateStoreRequest, TDetailStoreMenu, TStore, TStoreMenu, TStoreProduct, TStoreResponse, TStoreTaxRate, TUpdateDetailStoreMenu, TUpdateStoreProductPrice, TUpdateStoreRequest, TUpdateStoreTaxRateRequest } from "@/schema/store.schema";

// ==== Store ====
const getStores = async (params?: any) =>
  await apiRequest.store.get<BaseResponse<PaginationResponse<TStore>>>(
    API_SUFFIX.STORE_API,
    { params }
  );

const getStoreById = async (id: string) =>
  await apiRequest.store.get<BaseResponse<TStore>>(
    `${API_SUFFIX.STORE_API}/${id}`
  );

const getStoreMenusById = async (id: string, params?: any) =>
  await apiRequest.menu.get<BaseResponse<PaginationResponse<TStoreMenu>>>(
    `${API_SUFFIX.STORE_MENU_API}/stores/${id}`,
    { params }
  );
const getStoreMenuByMenuId = async (id: string) => 
  await apiRequest.menu.get<BaseResponse<TDetailStoreMenu>>(
    `${API_SUFFIX.STORE_MENU_API}/${id}`
  );

const updateStoreMutation = async (id: string, data: Pick<TStore, "startingStoreCashLending" | "status">) =>
  await apiRequest.store.patch(
    `${API_SUFFIX.STORE_API}/${id}`,
    data
  );

const createStoreMutation = async (data: TCreateStoreRequest) =>
  await apiRequest.store.post<BaseResponse<TStore>>(
    API_SUFFIX.STORE_API,
    data
  );
const updateStoreMenuItem = async (storeMenuId: string, data: TUpdateDetailStoreMenu) =>
  await apiRequest.menu.patch(
    `${API_SUFFIX.STORE_MENU_ITEM_API}/${storeMenuId}`,
    data
  );
const getStoreProductsByStoreId = async (storeId: string, params?: any) =>
  await apiRequest.catalog.get<BaseResponse<PaginationResponse<TStoreProduct>>>(
    `${API_SUFFIX.STORE_PRODUCT_PRICE_API}/stores/${storeId}`,
    { params }
  );
const getStoreProductById = async (storeProductId: string) =>
  await apiRequest.catalog.get<BaseResponse<TStoreProduct>>(
    `${API_SUFFIX.STORE_PRODUCT_PRICE_API}/${storeProductId}`
  );
const updateStoreProductPrice = async (storeProductId: string, data: TUpdateStoreProductPrice) =>
  await apiRequest.catalog.patch(
    `${API_SUFFIX.STORE_PRODUCT_PRICE_API}/${storeProductId}`,
    data
  );

const updateStatusStoreMenu = async (storeId: string, storeMenuId: string, isActiveAtStore: boolean) =>
  await apiRequest.menu.put(
    `${API_SUFFIX.STORE_MENU_API}/${storeMenuId}/stores/${storeId}`,
    { isActiveAtStore }
  );

const getStoreDetail = async () =>
  await apiRequest.store.get<BaseResponse<TStoreResponse>>(API_SUFFIX.STORE_DETAIL_API);
const updateStoreDetail = async (data: TUpdateStoreRequest) =>
  await apiRequest.store.patch<BaseResponse<TStore>>(
    API_SUFFIX.STORE_API,
    data
  );

const getStoreTaxRates = async (storeId: string, params?: any) =>
  await apiRequest.store.get<BaseResponse<PaginationResponse<TStoreTaxRate>>>(
    `${API_SUFFIX.STORE_API}/${storeId}/tax-rates`,
    { params }
  );

const addStoreTaxRate = async (storeId: string, data: TAddStoreTaxRateRequest) =>
  await apiRequest.store.post(
    `${API_SUFFIX.STORE_API}/${storeId}/tax-rates`,
    data
  );

const updateStoreTaxRate = async (storeId: string, taxRateId: string, data: TUpdateStoreTaxRateRequest) =>
  await apiRequest.store.patch(
    `${API_SUFFIX.STORE_API}/${storeId}/tax-rates/${taxRateId}`,
    data
  );

export const storeApi = {
  getStores,
  getStoreById,
  getStoreDetail,
  getStoreMenusById,
  getStoreMenuByMenuId,
  updateStoreMutation,
  createStoreMutation,
  updateStoreMenuItem,
  getStoreProductsByStoreId,
  getStoreProductById,
  updateStoreProductPrice,
  updateStoreDetail,
  updateStatusStoreMenu,

  getStoreTaxRates,
  addStoreTaxRate,
  updateStoreTaxRate,
};
