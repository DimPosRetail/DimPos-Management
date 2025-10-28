import { brandMenuApi, storeMenuApi } from "@/apis/menu.api";
import type { TUpdateBrandMenu, TUpdateBrandProduct, TUpdateBrandStore } from "@/schema/menu.schema";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UseMenuParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
    code?: string;
}

export const useMenu = () =>
{
    const queryClient = useQueryClient();
    const getBrandMenu = ( params: UseMenuParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [ 'brandMenus', {
                page,
                size,
                sortBy,
                isAsc,
            } ],
            queryFn: () => brandMenuApi.getBrandMenu( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
            } ),
        } )
    }

    const getStoreMenu = ( params: UseMenuParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [ 'storeMenus', {
                page,
                size,
                sortBy,
                isAsc,
            } ],
            queryFn: () => storeMenuApi.getStoreMenu( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
            } ),
        } )
    }

    const getBrandMenuById = ( id: string ) =>
    {
        return useSuspenseQuery( {
            queryKey: [ 'brandMenu', id ],
            queryFn: () => brandMenuApi.getBrandMenuById( id ),
        } )
    }

    const getProductsByBrandMenuId = ( id: string, params: UseMenuParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [ 'brandMenuProducts', id, {
                page,
                size,
                sortBy,
                isAsc,
            } ],
            queryFn: () => brandMenuApi.getProductsByBrandMenuId( id, {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
            } ),
        } )
    }

    const updateBrandMenuMutation = useMutation( {
        mutationFn: ( { id, data }: { id: string; data: TUpdateBrandMenu } ) =>
            brandMenuApi.updateBrandMenu( id, data ),
    } )

    const updateProductsByBrandMenuId = useMutation( {
        mutationFn: ( data: TUpdateBrandProduct ) => brandMenuApi.updateProductsByBrandMenuId(
            data.brandMenuId,
            { productVariantIds: data.productVariantIds || [] }
        ),
    } )

    const updateStoresByBrandMenuId = useMutation( {
        mutationFn: ( { id, data }: { id: string, data: TUpdateBrandStore } ) => brandMenuApi.updateStoresByBrandMenuId(
            id,
            data
        ),
    } )



    const getStoresByBrandMenuId = ( id: string, params: UseMenuParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
            name = params.name || "",
            code = params.code || "",
        } = params;

        return useQuery( {
            queryKey: [ 'brandMenuStores', id, {
                page,
                size,
                sortBy,
                isAsc,
                name,
                code,
            } ],
            queryFn: () => brandMenuApi.getStoresByBrandMenuId( id, {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
                name: name,
                code: code,
            } ),
        } )

    }

    const createBrandMenuMutation = useMutation( {
        mutationFn: brandMenuApi.createBrandMenu,
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ 'brandMenus' ] } )
        }
    } )

    return {
        getBrandMenu,
        getStoreMenu,
        createBrandMenuMutation,
        getBrandMenuById,
        getProductsByBrandMenuId,
        getStoresByBrandMenuId,
        updateBrandMenuMutation,
        updateProductsByBrandMenuId,
        updateStoresByBrandMenuId,
    }
}