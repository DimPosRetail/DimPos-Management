import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

import type {
  TProductResponse,
  TModifierGroupResponse,
  TModifierOptionResponse,
  TCreateModifierGroupRequest,
  TUpdateModifierGroupRequest,
  TUpdateModifierOptionRequest,
  TUpdateModifierGroupProductRequest,
  TAddExtraProductRequest,
} from "@/schema/product.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TAddProductVariantRequest } from "@/schema/product-variant.schema";

// ==== PRODUCT ====
const getProducts = async (params?: any) =>
  await apiRequest.catalog.get<BaseResponse<PaginationResponse<TProductResponse>>>(
    API_SUFFIX.PRODUCT_API,
    { params }
  );

const getProductById = async (id: string) =>
  await apiRequest.catalog.get<BaseResponse<TProductResponse>>(
    `${API_SUFFIX.PRODUCT_API}/${id}`
  );

const updateProductApi = async (id: string, data: FormData) =>
  await apiRequest.catalog.patch<BaseResponse<TProductResponse>>(
    `${API_SUFFIX.PRODUCT_API}/${id}`,
    data
  );
const updateModifierGroupsIntoProduct = async (id: string, data: TUpdateModifierGroupProductRequest) =>
  await apiRequest.catalog.put<BaseResponse<TProductResponse>>(
    `${API_SUFFIX.PRODUCT_API}/${id}/modifier-groups`,
    data
  );
const addVariantIntoProduct = async (id: string, data: TAddProductVariantRequest) =>
  await apiRequest.catalog.post(
    `${API_SUFFIX.PRODUCT_API}/${id}/product-variants`,
    data
  );

const addExtraProductIntoProduct = async (id: string, data: TAddExtraProductRequest) =>
  await apiRequest.catalog.put(
    `${API_SUFFIX.PRODUCT_API}/${id}/extra-items`,
    data
  );

const createProductApi = async (data: FormData) =>
  await apiRequest.catalog.post<BaseResponse<TProductResponse>>(
    API_SUFFIX.PRODUCT_API,
    data
  );

const inactivateVariants = async (productId: string) =>
  await apiRequest.catalog.put(
    `${API_SUFFIX.PRODUCT_API}/${productId}/product-variants/inactive`
  );

// ==== MODIFIER GROUP ====
const getModifierGroups = async (params?: any) =>
  await apiRequest.catalog.get<BaseResponse<PaginationResponse<TModifierGroupResponse>>>(
    API_SUFFIX.MODIFIER_GROUP_API,
    { params }
  );

const getModifierGroupById = async (id: string) =>
  await apiRequest.catalog.get<BaseResponse<TModifierGroupResponse>>(
    `${API_SUFFIX.MODIFIER_GROUP_API}/${id}`
  );

const createModifierGroup = async (data: TCreateModifierGroupRequest) =>
  await apiRequest.catalog.post<BaseResponse<TModifierGroupResponse>>(
    API_SUFFIX.MODIFIER_GROUP_API,
    data
  );

const updateModifierGroup = async (id: string, data: TUpdateModifierGroupRequest) =>
  await apiRequest.catalog.patch<BaseResponse<TModifierGroupResponse>>(
    `${API_SUFFIX.MODIFIER_GROUP_API}/${id}`,
    data
  );

// ==== MODIFIER OPTIONS ====
const getModifierOptionsByGroupId = async (groupId: string) =>
  await apiRequest.catalog.get<BaseResponse<PaginationResponse<TModifierOptionResponse>>>(
    `${API_SUFFIX.MODIFIER_GROUP_API}/${groupId}/modifier-options`
  );

const getModifierOptionById = async (id: string) =>
  await apiRequest.catalog.get<BaseResponse<TModifierOptionResponse>>(
    `${API_SUFFIX.MODIFIER_OPTION_API}/${id}`
  );

const updateModifierOption = async (id: string, data: TUpdateModifierOptionRequest) =>
  await apiRequest.catalog.patch<BaseResponse<TModifierOptionResponse>>(
    `${API_SUFFIX.MODIFIER_OPTION_API}/${id}`,
    data
  );
const createModifierOption = async (groupId: string, data: TUpdateModifierOptionRequest) =>
  await apiRequest.catalog.post<BaseResponse<TModifierOptionResponse>>(
    `${API_SUFFIX.MODIFIER_GROUP_API}/${groupId}/modifier-options`,
    data
  );

export const productApi = {
  getProducts,
  getProductById,
  createProductApi,
  updateProductApi,
  inactivateVariants,
  addVariantIntoProduct,
  getModifierGroups,
  getModifierGroupById,
  createModifierGroup,
  updateModifierGroup,
  createModifierOption,
  getModifierOptionsByGroupId,
  getModifierOptionById,
  updateModifierOption,
  updateModifierGroupsIntoProduct,
  addExtraProductIntoProduct,
};
