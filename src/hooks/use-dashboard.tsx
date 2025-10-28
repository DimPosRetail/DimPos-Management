import { dashboardApi } from "@/apis/dashboard.api";
import type { TRole } from "@/schema/role.schema";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

interface UseDashboardParams
{
    storeId?: string | null;
    fromDate: string;
    toDate: string;
}

export const useDashboard = () =>
{
    const getDashboardBrand = ( role: TRole, params: UseDashboardParams ) =>
    {
        const {
            storeId = params.storeId || null,
            fromDate = params.fromDate,
            toDate = params.toDate,
        } = params;

        return useQuery( {
            queryKey: [ 'dashboard-brand', {
                storeId,
                fromDate,
                toDate,
            } ],
            queryFn: () => dashboardApi.getDashboardBrand( {
                storeId,
                fromDate,
                toDate,
            } ),
            placeholderData: keepPreviousData,
            enabled: role === 'BrandAdmin',
        } )
    }
    const getDashboardStore = ( role: TRole, params: UseDashboardParams ) =>
    {
        const {
            fromDate = params.fromDate,
            toDate = params.toDate,
        } = params;

        return useQuery( {
            queryKey: [ 'dashboard-store', {
                fromDate,
                toDate,
            } ],
            queryFn: () => dashboardApi.getDashboardStore( {
                fromDate,
                toDate,
            } ),
            placeholderData: keepPreviousData,
            enabled: role === 'StoreAdmin',
        } )
    }

    const exportDashboardBrandReport = useMutation( {
        mutationFn: ( params: UseDashboardParams ) =>
        {
            const {
                fromDate = params.fromDate,
                toDate = params.toDate,
            } = params;
            return dashboardApi.exportDashboardBrandReport( {
                fromDate,
                toDate,
            } )
        }
    } )

    const exportDashboardStoreReport = useMutation( {
        mutationFn: ( params: UseDashboardParams ) =>
        {
            const {
                fromDate = params.fromDate,
                toDate = params.toDate,
            } = params;
            return dashboardApi.exportDashboardStoreReport( {
                fromDate,
                toDate,
            } )
        }
    } )
    return {
        getDashboardBrand,
        getDashboardStore,

        exportDashboardBrandReport,
        exportDashboardStoreReport,
    }
}