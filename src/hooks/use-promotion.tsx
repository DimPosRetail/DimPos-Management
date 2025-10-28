import { promotionApi } from "@/apis/promotion.api";
import type { TCreateRuleCondition, TEditRuleCondition, TUpdatePromotionRule, TUpdateRuleAction } from "@/schema/promotion-rule.schema";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

interface UsePromotionParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
}

export const usePromotion = () =>
{
    const queryClient = useQueryClient();
    const getPromotions = ( params: UsePromotionParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
            name = params.name || "",
        } = params;

        return useQuery( {
            queryKey: [
                "promotion-rules",
                {
                    page,
                    size,
                    sortBy,
                    isAsc,
                    name,
                },
            ],
            queryFn: () =>
                promotionApi.getPromotionRules( {
                    page: page,
                    size: size,
                    sortBy: sortBy,
                    isAsc: isAsc,
                    name: name,
                } ),
            placeholderData: keepPreviousData,
        } );
    }

    const getPromotionById = ( id: string ) =>
    {
        return useSuspenseQuery( {
            queryKey: [ "promotion-rule", id ],
            queryFn: () => promotionApi.getPromotionRulesById( id ),
        } );
    }

    const createPromotionMutation = useMutation( {
        mutationFn: promotionApi.createPromotionRule,
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        },
    } )

    const updatePromotionMutation = useMutation( {
        mutationFn: ( { id, data }: { id: string; data: TUpdatePromotionRule } ) => promotionApi.updatePromotionRule( id, data ),
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        },
    } );

    const createConditionRuleMutation = useMutation( {
        mutationFn: ( { promotionRuleId, data }: { promotionRuleId: string; data: TCreateRuleCondition } ) =>
            promotionApi.createConditionRule( promotionRuleId, data ),
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        }
    } );

    const updateConditionRuleMutation = useMutation( {
        mutationFn: ( { promotionRuleId, conditionRuleId, data }: { promotionRuleId: string; conditionRuleId: string; data: TEditRuleCondition } ) =>
            promotionApi.updateConditionRule( promotionRuleId, conditionRuleId, data ),
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        },
    } );
    const deleteConditionRuleMutation = useMutation( {
        mutationFn: ( { promotionRuleId, conditionRuleId }: { promotionRuleId: string; conditionRuleId: string } ) =>
            promotionApi.deleteConditionRule( promotionRuleId, conditionRuleId ),
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        },
    } );

    const updateActionRuleMutation = useMutation( {
        mutationFn: ( { promotionRuleId, actionRuleId, data }: { promotionRuleId: string; actionRuleId: string; data: TUpdateRuleAction } ) =>
            promotionApi.updateActionRule( promotionRuleId, actionRuleId, data ),
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'promotion-rules' ] } );
        },
    } );
    return {
        getPromotions,
        getPromotionById,
        createPromotionMutation,
        updatePromotionMutation,

        createConditionRuleMutation,
        updateConditionRuleMutation,
        deleteConditionRuleMutation,

        updateActionRuleMutation,
    }
}