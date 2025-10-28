import { apiRequest } from "@/lib/http";
import type { TCreateProductExtra, TProductExtra, TUpdateProductExtra } from "@/schema/product-extra.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getExtraProducts = async (params? : any) => 
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TProductExtra>>>(
        API_SUFFIX.EXTRA_PRODUCT_API,
        {params}
    )
const getExtraProductById = async (extraProductId: string) =>
    await apiRequest.catalog.get<BaseResponse<TProductExtra>>(
        `${API_SUFFIX.EXTRA_PRODUCT_API}/${extraProductId}`
    );
const createExtraProduct = async (data: TCreateProductExtra) =>
    await apiRequest.catalog.post<BaseResponse<string>>(
        API_SUFFIX.EXTRA_PRODUCT_API,
        data,
    );
const updateExtraProduct = async (extraProductId: string, data: TUpdateProductExtra) =>
    await apiRequest.catalog.patch(
        `${API_SUFFIX.EXTRA_PRODUCT_API}/${extraProductId}`,
        data,
    );
export const extraProductApi = {
    getExtraProducts,
    getExtraProductById,
    createExtraProduct,
    updateExtraProduct,
}