import { apiRequest } from "@/lib/http";
import type { TBrandMenu, TBrandStore, TCreateBrandMenu, TStoreMenu, TUpdateBrandMenu, TUpdateBrandStore } from "@/schema/menu.schema";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getBrandMenu = async (params: any) => 
    await apiRequest.menu.get<BaseResponse<PaginationResponse<TBrandMenu>>>(`${API_SUFFIX.BRAND_MENU_API}`, {params});
const getStoreMenu = async (params?: any) =>
    await apiRequest.menu.get<BaseResponse<PaginationResponse<TStoreMenu>>>(`${API_SUFFIX.STORE_MENU_API}`, {params});
const createBrandMenu = async (data: TCreateBrandMenu) =>
    await apiRequest.menu.post<BaseResponse<string>>(`${API_SUFFIX.BRAND_MENU_API}`, data);
const getBrandMenuById = async (id: string) =>
    await apiRequest.menu.get<BaseResponse<TBrandMenu>>(`${API_SUFFIX.BRAND_MENU_API}/${id}`);
const updateBrandMenu = async (id: string, data: TUpdateBrandMenu) =>
    await apiRequest.menu.patch<BaseResponse<TBrandMenu>>(`${API_SUFFIX.BRAND_MENU_API}/${id}`, data);
const getProductsByBrandMenuId = async (id: string, params?: any) =>
    await apiRequest.menu.get<BaseResponse<PaginationResponse<TProductVariantResponse>>>(`${API_SUFFIX.BRAND_MENU_API}/${id}/product-variants`, {params});
const updateProductsByBrandMenuId = async (id: string, data: { productVariantIds: string[] }) =>
    await apiRequest.menu.patch<BaseResponse<TBrandMenu>>(`${API_SUFFIX.BRAND_MENU_API}/${id}/product-variants`, data);
const getStoresByBrandMenuId = async (id: string, params?: any) =>
    await apiRequest.menu.get<BaseResponse<PaginationResponse<TBrandStore>>>(`${API_SUFFIX.BRAND_MENU_API}/${id}/stores`, {params});
const updateStoresByBrandMenuId = async (id: string, data: TUpdateBrandStore) =>
    await apiRequest.menu.patch<BaseResponse<TBrandMenu>>(`${API_SUFFIX.BRAND_MENU_API}/${id}/stores`, data.data);

export const brandMenuApi = {
    getBrandMenu,
    createBrandMenu,
    getBrandMenuById,
    updateBrandMenu,
    getProductsByBrandMenuId,
    getStoresByBrandMenuId,
    updateProductsByBrandMenuId,
    updateStoresByBrandMenuId,
};

export const storeMenuApi = {
    getStoreMenu,
};