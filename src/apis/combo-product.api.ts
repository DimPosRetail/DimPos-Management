import { apiRequest } from "@/lib/http";
import type { TAddItemToComboProduct, TComboProduct, TUpdateComboProductItem } from "@/schema/combo-product.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getComboProducts = async (params? : any) => 
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TComboProduct>>>(
        API_SUFFIX.COMBO_PRODUCT_API,
        {params}
    )
const getComboProductById = async (comboProductId: string) =>
    await apiRequest.catalog.get<BaseResponse<TComboProduct>>(
        `${API_SUFFIX.COMBO_PRODUCT_API}/${comboProductId}`
    );
const createComboProduct = async (data: FormData) =>
    await apiRequest.catalog.post<BaseResponse<string>>(
        API_SUFFIX.COMBO_PRODUCT_API,
        data,
    );
const updateComboProduct = async (comboProductId: string, data: FormData) =>
    await apiRequest.catalog.patch<BaseResponse<string>>(
        `${API_SUFFIX.COMBO_PRODUCT_API}/${comboProductId}`,
        data,
    );
const addItemToComboProduct = async (comboProductId: string, data: TAddItemToComboProduct) =>
    await apiRequest.catalog.post<BaseResponse<string>>(
        `${API_SUFFIX.COMBO_PRODUCT_API}/${comboProductId}/product-combo-items`,
        data,
    );

const deleteComboProductItem = async (productId: string, comboProductItemId: string) =>
    await apiRequest.catalog.delete<BaseResponse<string>>(
        `${API_SUFFIX.COMBO_PRODUCT_API}/${productId}/product-combo-items/${comboProductItemId}`
    );

const updateComboProductItem = async (comboProductItemId: string, data: TUpdateComboProductItem) =>
    await apiRequest.catalog.patch<BaseResponse<string>>(
        `${API_SUFFIX.COMBO_PRODUCT_ITEM_API}/${comboProductItemId}`,
        data,
    );

export const comboProductApi = {
    getComboProducts,
    getComboProductById,
    createComboProduct,
    updateComboProduct,
    addItemToComboProduct,
    deleteComboProductItem,
    updateComboProductItem,
}