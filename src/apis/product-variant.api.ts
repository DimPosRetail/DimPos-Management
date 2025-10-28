import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

import type {
    TPriceProductHistory,
    TProductVariantResponse,
    TRecipeItemResponse,
    TRequestRecipeItem
} from "@/schema/product-variant.schema";

import type { BaseResponse, PaginationResponse } from "@/types/response.type";

const getProductVariants = async (params?: any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TProductVariantResponse>>>(
        API_SUFFIX.PRODUCT_VARIANT_API,
        { params }
    );
const getProductVariantsMenu = async (params?: any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TProductVariantResponse>>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/menu`,
        { params }
    );

const getProductVariantById = async (id: string) =>
    await apiRequest.catalog.get<BaseResponse<TProductVariantResponse>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}`
    );
const updateProductVariantApi = async (id: string, params?: any) =>
    await apiRequest.catalog.patch<BaseResponse<TProductVariantResponse>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}`,
        params
    );
const getRecipeItemsByProductVariantId = async (id: string, params?: any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TRecipeItemResponse>>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}/recipe-items`,
        { params }
    );
const addRecipeItemToProductVariant = async (id: string, data: TRequestRecipeItem) =>
    await apiRequest.catalog.post<BaseResponse<TRecipeItemResponse>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}/recipe-items`,
        data
    );
const deleteRecipeItemFromProductVariant = async (productVariantId: string, recipeItemId: string) =>
    await apiRequest.catalog.delete(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${productVariantId}/recipe-items/${recipeItemId}`
    );
const updateRecipeItemInProductVariant = async (productVariantId: string, recipeItemId: string, data: Pick<TRequestRecipeItem, "quantity">) =>
    await apiRequest.catalog.put(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${productVariantId}/recipe-items/${recipeItemId}`,
        data
    );

const updateStatusProductVariant = async (id: string, isActive: boolean ) =>
    await apiRequest.catalog.patch<BaseResponse<TProductVariantResponse>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}`,
        { isActive }
    );

const getBrandPriceHistory = async (id: string, params? : any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TPriceProductHistory>>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${id}/brand-price-histories`,
        { params }
    );

const getStorePriceHistory = async (productVariantId: string, storeId: string, params? : any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TPriceProductHistory>>>(
        `${API_SUFFIX.PRODUCT_VARIANT_API}/${productVariantId}/stores/${storeId}/store-price-histories`,
        { params }
    );

export const productVariantApi = {
    getProductVariants,
    getProductVariantsMenu,
    getProductVariantById,
    updateProductVariantApi,
    getRecipeItemsByProductVariantId,

    addRecipeItemToProductVariant,
    deleteRecipeItemFromProductVariant,
    updateRecipeItemInProductVariant,
    updateStatusProductVariant,

    getBrandPriceHistory,
    getStorePriceHistory,
}