import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TInventoryStock, TInventoryTransaction, TUpdateInventoryStockRequest } from "@/schema/inventory.schema";

const getInventoryStocks = async (params?: any) => 
    await apiRequest.inventory.get<BaseResponse<PaginationResponse<TInventoryStock>>>(API_SUFFIX.INVENTORY_API, { params });
const getInventoryStockById = async (id: string) =>
    await apiRequest.inventory.get<BaseResponse<TInventoryStock>>(`${API_SUFFIX.INVENTORY_API}/${id}`);
const getInventoryTransactions = async (id: string, params?: any) =>
    await apiRequest.inventory.get<BaseResponse<PaginationResponse<TInventoryTransaction>>>(`${API_SUFFIX.INVENTORY_API}/${id}/inventory-transactions`, { params });
const updateQuantityInventoryStock = async (id: string, data: TUpdateInventoryStockRequest) =>
    await apiRequest.inventory.put(`${API_SUFFIX.INVENTORY_API}/${id}/quantity`, data);
const exportStockReport = async () =>
    await apiRequest.inventory.get<BaseResponse<string>>(`${API_SUFFIX.INVENTORY_API}/export/excel`);

export const inventoryApi = {
    getInventoryStocks,
    getInventoryStockById,
    getInventoryTransactions,
    updateQuantityInventoryStock,

    exportStockReport,
};