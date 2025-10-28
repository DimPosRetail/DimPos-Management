import { apiRequest } from "@/lib/http";
import type {
  TBrandResponse
} from "@/schema/brand-management.schema";
import type { TBrand } from "@/schema/brand.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

// GET all brands
const getAllBrands = async (params?: any) =>
  await apiRequest.brand.get<BaseResponse<TBrandResponse[]>>(API_SUFFIX.BRAND_API.BRAND, { params });

// GET brand by id
const getBrandById = async (id: string) =>
  await apiRequest.brand.get<BaseResponse<TBrand>>(`${API_SUFFIX.BRAND_API.BRAND}/${id}`);

const changePasswordForBrand = async (id: string, data: { password: string }) =>
  await apiRequest.brand.put<BaseResponse<TBrandResponse>>(
    `${API_SUFFIX.BRAND_API.BRAND}/${id}/passwords`,
    data
  );
const editBrand = async (data: FormData) => 
  await apiRequest.brand.patch<BaseResponse<TBrandResponse>>(
    API_SUFFIX.BRAND_API.BRAND,
    data,
  );

// GET current brand details
const getBrandDetails = async () =>
  await apiRequest.brand.get<BaseResponse<TBrand>>(API_SUFFIX.BRAND_API.BRAND_DETAIL);

// POST create brand
const createBrand = async (data: FormData) =>
  await apiRequest.brand.post<BaseResponse<TBrandResponse>>(
    API_SUFFIX.BRAND_API.BRAND,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
// PUT update brand
const updateBrand = async (id: string, data: FormData) =>
  await apiRequest.brand.patch(`${API_SUFFIX.BRAND_API.BRAND}/${id}`, data);

export const brandApi = {
  getAllBrands,
  getBrandById,
  changePasswordForBrand,      
  editBrand,
  getBrandDetails,   
  createBrand,
  updateBrand,
};
