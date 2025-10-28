import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";
import {type BaseResponse } from "@/types/response.type";
import type { TDashboardResponse } from "@/schema/dashboard.schema";

const getDashboardBrand = async (params?: any) =>
    await apiRequest.order.get<BaseResponse<TDashboardResponse>>(`${API_SUFFIX.DASHBOARD_API}/brands`, { params });

const getDashboardStore = async (params?: any) =>
    await apiRequest.order.get<BaseResponse<TDashboardResponse>>(`${API_SUFFIX.DASHBOARD_API}/stores`, { params });
const exportDashboardBrandReport = async (params?: any) =>
    await apiRequest.order.get<BaseResponse<string>>(`${API_SUFFIX.DASHBOARD_API}/brands/export`, { params });
const exportDashboardStoreReport = async (params?: any) =>
    await apiRequest.order.get<BaseResponse<string>>(`${API_SUFFIX.DASHBOARD_API}/stores/export`, { params });

export const dashboardApi = {
    getDashboardBrand,
    getDashboardStore,

    exportDashboardBrandReport,
    exportDashboardStoreReport,
};

