import { apiRequest } from "@/lib/http";
import type { TCreateIngredientRequest, TIngredientResponse, TUpdateIngredientRequest } from "@/schema/ingredients.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getIngredients = async (params: any) =>
    await apiRequest.catalog.get<BaseResponse<PaginationResponse<TIngredientResponse>>>(
        API_SUFFIX.INGREDIENT_API,
        { params }
    );
const getIngredientById = async (id: string) =>
    await apiRequest.catalog.get<BaseResponse<TIngredientResponse>>(
        `${API_SUFFIX.INGREDIENT_API}/${id}`
    );
const createIngredient = async (data: TCreateIngredientRequest) =>
    await apiRequest.catalog.post<BaseResponse<string>>(
        API_SUFFIX.INGREDIENT_API,
        data
    );
const updateIngredient = async (id: string, data: Omit<TUpdateIngredientRequest, "code" | "sku">) =>
    await apiRequest.catalog.patch(
        `${API_SUFFIX.INGREDIENT_API}/${id}`,
        data
    );
export const ingredientApi = {
    getIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
};