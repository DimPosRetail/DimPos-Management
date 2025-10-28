import { apiRequest } from "@/lib/http";
import type { TCategoryResponse } from "@/schema/category.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getCategories = async (params?: any) => 
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TCategoryResponse>>>(API_SUFFIX.CATEGORY_API, {params});
const getCategoryById = async (id: string) => 
    await apiRequest.catalog.get<BaseResponse<TCategoryResponse>>(`${API_SUFFIX.CATEGORY_API}/${id}`);
const createCategory = async (request: FormData) => 
    await apiRequest.catalog.post<BaseResponse<string>>(API_SUFFIX.CATEGORY_API, request);
const updateCategory = async (id: string, request: FormData) =>
  await apiRequest.catalog.patch<BaseResponse<TCategoryResponse>>(
    `${API_SUFFIX.CATEGORY_API}/${id}`,
    request
  );
export const categoryApi = {
    getCategories,
    getCategoryById,
    createCategory,
     updateCategory,
};