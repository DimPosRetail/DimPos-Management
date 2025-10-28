import { apiRequest } from "@/lib/http";

import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type {TPurchasableProduct } from "@/schema/purchasable-product.schema";

const getPurchasableProducts = async (params?: any) =>
  await apiRequest.catalog.get<BaseResponse<PaginationResponse<TPurchasableProduct>>>(API_SUFFIX.INTERNAL_PRODUCT_API, { params });
const getPurchasableProductById = async (id: string) =>
  await apiRequest.catalog.get<BaseResponse<TPurchasableProduct>>(`${API_SUFFIX.INTERNAL_PRODUCT_API}/${id}`);
const createPurchasableProduct = async (request: FormData) =>
  await apiRequest.catalog.post<BaseResponse<TPurchasableProduct>>(API_SUFFIX.INTERNAL_PRODUCT_API, request);
const updatePurchasableProduct = async (id: string, request: FormData) =>
  await apiRequest.catalog.patch<BaseResponse<TPurchasableProduct>>(
    `${API_SUFFIX.INTERNAL_PRODUCT_API}/${id}`,
    request
  );
export const purchasableProductApi = {
  getPurchasableProducts,
  getPurchasableProductById,
  createPurchasableProduct,
  updatePurchasableProduct,
};