
import { campaignApi } from "@/apis/campaign.api";
import type { TUpdateCampaignRequest, TUpdatePromotionCampaignRequest, TUpdateStoreCampaignRequest } from "@/schema/campaign.schema";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UseCampaignParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
}

export const useCampaign = () =>
{
    const queryClient = useQueryClient();

    const getCampaigns = ( params: UseCampaignParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "displayOrder",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [ 'campaigns', {
                page,
                size,
                sortBy,
                isAsc,
            } ],
            queryFn: () => campaignApi.getCampaigns( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
            } ),
            placeholderData: keepPreviousData,
        } )
    }

    const getCampaignsStore = ( params: UseCampaignParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "displayOrder",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [ 'campaigns-store', {
                page,
                size,
                sortBy,
                isAsc,
            } ],
            queryFn: () => campaignApi.getCampaignsStore( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
            } ),
            placeholderData: keepPreviousData,
        } )
    }

    const getCampaignById = ( id: string ) =>
        useSuspenseQuery( {
            queryKey: [ 'campaign', id ],
            queryFn: () => campaignApi.getCampaignById( id ),
        } );

    const createCampaign = useMutation( {
        mutationFn: campaignApi.createCampaign,
    } );
    const updateCampaign = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdateCampaignRequest;
        } ) => campaignApi.updateCampaign( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "campaign", id ] } );
        },
    } );

    const updateStoreCampaignMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdateStoreCampaignRequest;
        } ) => campaignApi.updateStoreCampaign( id, data ),
    } );

    const updatePromotionCampaignMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdatePromotionCampaignRequest;
        } ) => campaignApi.updatePromotionCampaign( id, data ),
    } );

    return {
        getCampaigns,
        getCampaignsStore,
        getCampaignById,
        createCampaign,
        updateCampaign,
        updateStoreCampaignMutation,
        updatePromotionCampaignMutation,
    }
}