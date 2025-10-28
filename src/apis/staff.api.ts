import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TCreateAccount, TStaff, TUpdateStaff } from "@/schema/staff.schema";

const getStaffsByStore = async (params?: any) =>
  await apiRequest.store.get<BaseResponse<PaginationResponse<TStaff>>>(
    API_SUFFIX.STAFF_API,
    { params }
  );

const getStaffById = async (id: string) =>
  await apiRequest.store.get<BaseResponse<TStaff>>(
    `${API_SUFFIX.STAFF_API}/${id}`
  );

const createStaffsByStore = async (data: TCreateAccount) =>
  await apiRequest.store.post<BaseResponse<TStaff>>(
    API_SUFFIX.STAFF_API,
    data
  );

const updateStaffById = async (id: string, data: TUpdateStaff) =>
  await apiRequest.store.patch<BaseResponse<TStaff>>(
    `${API_SUFFIX.STAFF_API}/${id}`,
    data
  );


export const staffApi = {
  getStaffsByStore,
  createStaffsByStore,
  getStaffById,
  updateStaffById,
};
