import { comboProductApi } from "@/apis/combo-product.api";
import type { TAddItemToComboProduct, TUpdateComboProductItem } from "@/schema/combo-product.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface UseComboProductParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
    sku?: string;
}

export const useComboProduct = () =>
{
    const getComboProductsQuery = ( params: UseComboProductParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "displayOrder",
            isAsc = params.isAsc || true,
            name = params.name || "",
        } = params;
        return useQuery( {
            queryKey: [ "combo-products", {
                page,
                size,
                sortBy,
                isAsc,
                name,
            } ],
            queryFn: () => comboProductApi.getComboProducts( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
                name: name,
            } ),
        } );
    }

    const getComboProductByIdQuery = ( id: string ) =>
    {

        return useSuspenseQuery( {
            queryKey: [ "combo-product", id ],
            queryFn: () => comboProductApi.getComboProductById( id ),
        } );
    }

    const createComboProductMutation = useMutation( {
        mutationFn: comboProductApi.createComboProduct,
    } );

    const updateComboProductMutation = useMutation( {
        mutationFn: ( { comboProductId, data }: { comboProductId: string; data: FormData } ) =>
            comboProductApi.updateComboProduct( comboProductId, data ),
    } );

    const addItemToComboProductMutation = useMutation( {
        mutationFn: ( { comboProductId, data }: { comboProductId: string; data: TAddItemToComboProduct } ) =>
            comboProductApi.addItemToComboProduct( comboProductId, data ),
    } );

    const deleteComboProductItemMutation = useMutation( {
        mutationFn: ( { productId, comboProductItemId }: { productId: string, comboProductItemId: string } ) =>
            comboProductApi.deleteComboProductItem( productId, comboProductItemId ),
    } );

    const updateComboProductItemMutation = useMutation( {
        mutationFn: ( { comboProductItemId, data }: { comboProductItemId: string; data: TUpdateComboProductItem } ) =>
            comboProductApi.updateComboProductItem( comboProductItemId, data ),
    } );

    return {
        getComboProductsQuery,
        getComboProductByIdQuery,
        createComboProductMutation,
        updateComboProductMutation,
        addItemToComboProductMutation,
        deleteComboProductItemMutation,
        updateComboProductItemMutation,
    };
}