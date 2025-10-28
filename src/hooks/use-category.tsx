import { categoryApi } from "@/apis/category.api";
import { keepPreviousData, useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

interface UseCategoryParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
    type?: string | null;
}

export const useCategory = () =>
{
    const getCategories = ( params: UseCategoryParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "displayOrder",
            isAsc = params.isAsc || true,
            name = params.name || "",
            type = params.type || null,
        } = params;

        return useQuery( {
            queryKey: [ 'categories', {
                page,
                size,
                sortBy,
                isAsc,
                name,
                type,
            } ],
            queryFn: () => categoryApi.getCategories( {
                page: page,
                size: size,
                sortBy: sortBy,
                isAsc: isAsc,
                name: name,
                type
            } ),
            placeholderData: keepPreviousData,
        } )
    }

    const getCategoryById = ( id: string ) =>
        useSuspenseQuery( {
            queryKey: [ 'category', id ],
            queryFn: () => categoryApi.getCategoryById( id ),
        } );

    const createCategory = () =>
        useMutation( {
            mutationFn: ( request: FormData ) => categoryApi.createCategory( request ),
        } );
    const updateCategory = () =>
        useMutation( {
            mutationFn: ( params: { id: string; data: FormData } ) =>
                categoryApi.updateCategory( params.id, params.data ),
        } );
    const getParentCategories = () =>
        useQuery( {
            queryKey: [ 'parentCategories' ],
            queryFn: () =>
                categoryApi.getCategories( { type: 1, size: 1000 } ),
        } );
    return {
        getCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        getParentCategories,
    }
}