import { inventoryApi } from "@/apis/inventory.api";
import type { TUpdateInventoryStockRequest } from "@/schema/inventory.schema";
import { keepPreviousData, useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface UseInventoryParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    fromDate?: string | null;
    toDate?: string | null;
}

export const useInventory = () =>
{
    const getInventoryStocks = ( params: UseInventoryParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "createdDate",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [
                "inventory-stocks",
                {
                    page,
                    size,
                    sortBy,
                    isAsc,
                },
            ],
            queryFn: () =>
                inventoryApi.getInventoryStocks( {
                    page,
                    size,
                    sortBy,
                    isAsc,
                } ),
            placeholderData: keepPreviousData,
        } );
    }

    const getInventoryStockById = ( id: string ) =>
    {
        return useSuspenseQuery( {
            queryKey: [ "inventory-stock", id ],
            queryFn: () => inventoryApi.getInventoryStockById( id ),
        } );
    }

    const getInventoryTransactions = ( id: string, params: UseInventoryParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "createdDate",
            isAsc = params.isAsc || true,
            fromDate = params.fromDate || null,
            toDate = params.toDate || null,
        } = params;
        return useQuery( {
            queryKey: [
                "inventory-transactions",
                {
                    page,
                    size,
                    sortBy,
                    isAsc,
                    fromDate,
                    toDate,
                },
            ],
            queryFn: () =>
                inventoryApi.getInventoryTransactions( id, {
                    page,
                    size,
                    sortBy,
                    isAsc,
                    fromDate,
                    toDate,
                } ),
            placeholderData: keepPreviousData,
        } );
    }

    const updateQuantityInventoryStockMutation = useMutation( {
        mutationFn: ( { id, data }: { id: string; data: TUpdateInventoryStockRequest } ) =>
            inventoryApi.updateQuantityInventoryStock( id, data ),
    } )

    const exportStockReportMutation = useMutation( {
        mutationFn: inventoryApi.exportStockReport,
    } )

    return {
        getInventoryStocks,
        getInventoryStockById,
        getInventoryTransactions,
        updateQuantityInventoryStockMutation,

        exportStockReportMutation,
    };
}