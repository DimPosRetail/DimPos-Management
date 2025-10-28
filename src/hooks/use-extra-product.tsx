import { extraProductApi } from "@/apis/extra-product.api";
import type { TUpdateProductExtra } from "@/schema/product-extra.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface UseExtraProductParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
    sku?: string;
}

export const useExtraProduct = () =>
{
    const getExtraProductsQuery = ( params: UseExtraProductParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "displayOrder",
            isAsc = params.isAsc || true,
            name = params.name || "",
        } = params;
        return useQuery( {
            queryKey: [ "extra-products", {
                page,
                size,
                sortBy,
                isAsc,
                name,
            } ],
            queryFn: () => extraProductApi.getExtraProducts( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
                name: name,
            } ),
        } );
    }

    const getExtraProductByIdQuery = ( id: string ) =>
    {

        return useSuspenseQuery( {
            queryKey: [ "extra-product", id ],
            queryFn: () => extraProductApi.getExtraProductById( id ),
        } );
    }

    const createExtraProductMutation = useMutation( {
        mutationFn: extraProductApi.createExtraProduct,
    } );

    const updateExtraProductMutation = useMutation( {
        mutationFn: ( { extraProductId, data }: { extraProductId: string; data: TUpdateProductExtra } ) =>
            extraProductApi.updateExtraProduct( extraProductId, data ),
    } );

    return {
        getExtraProductsQuery,
        getExtraProductByIdQuery,
        createExtraProductMutation,
        updateExtraProductMutation,
    };
}