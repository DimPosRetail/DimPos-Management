import { apiRequest } from "@/lib/http";
import type{ TAuthResponse,TLoginRequest } from "@/schema/auth.schema";
import { API_SUFFIX } from "./util.api";
import type { BaseResponse } from "@/types/response.type";

export const authApi = {
    login: async (request: TLoginRequest) => apiRequest.identity.post<BaseResponse<TAuthResponse>>( API_SUFFIX.AUTH_API, request)
}