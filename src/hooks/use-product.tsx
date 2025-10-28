import { productApi } from "@/apis/product.api";
import type { TAddProductVariantRequest } from "@/schema/product-variant.schema";
import type {
    TAddExtraProductRequest,
    TUpdateModifierGroupProductRequest,
    TUpdateModifierGroupRequest,
    TUpdateModifierOptionRequest,
} from "@/schema/product.schema";
import
{
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";

interface UseProductParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;
    name?: string;
    code?: string;
}

export const useProduct = () =>
{
    const queryClient = useQueryClient();


    const getProducts = ( params: UseProductParams = {} ) =>
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
            queryKey: [
                "products",
                {
                    page,
                    size,
                    sortBy,
                    isAsc,
                    name,
                    code,
                },
            ],
            queryFn: () =>
                productApi.getProducts( {
                    page: page,
                    size: size,
                    sortBy: sortBy,
                    isAsc: isAsc,
                    name: name,
                    code: code,
                } ),
        } );
    };

    const getProductById = ( id: string ) =>
    {
        return useSuspenseQuery( {
            queryKey: [ "product", id ],
            queryFn: () => productApi.getProductById( id ),
        } );
    };

    const createProductMutation = useMutation( {
        mutationFn: productApi.createProductApi,
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ "products" ] } );
        },
    } );

    const updateProductMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: FormData;
        } ) => productApi.updateProductApi( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "product", id ] } );
        },
    } );

    const inactivateVariantsMutation = useMutation( {
        mutationFn: ( productId: string ) => productApi.inactivateVariants( productId ),
    } );

    const addVariantIntoProductMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TAddProductVariantRequest;
        } ) => productApi.addVariantIntoProduct( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "product", id ] } );
        },
    } )

    const updateModifierGroupsIntoProductMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdateModifierGroupProductRequest;
        } ) => productApi.updateModifierGroupsIntoProduct( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "product", id ] } );
        },
    } );


    const getModifierGroups = ( params: UseProductParams = {} ) =>
    {
        const {
            page = params.page || 1,
            size = params.size || 10,
            sortBy = params.sortBy || "id",
            isAsc = params.isAsc || true,
        } = params;

        return useQuery( {
            queryKey: [
                "modifier-groups",
                {
                    page,
                    size,
                    sortBy,
                    isAsc,
                },
            ],
            queryFn: () =>
                productApi.getModifierGroups( {
                    page: page,
                    size: size,
                    sortBy: sortBy,
                    isAsc: isAsc,
                } ),
        } );
    };

    const getModifierOptionsByGroupId = ( groupId: string ) =>
        useSuspenseQuery( {
            queryKey: [ "modifier-options", groupId ],
            queryFn: () => productApi.getModifierOptionsByGroupId( groupId ),
        } );

    const getModifierOptionById = ( id: string ) =>
        useSuspenseQuery( {
            queryKey: [ "modifier-option", id ],
            queryFn: () => productApi.getModifierOptionById( id ),
        } );
    const createModifierGroupMutation = useMutation( {
        mutationFn: productApi.createModifierGroup,
        onSuccess: () =>
        {
            queryClient.invalidateQueries( { queryKey: [ "modifier-groups" ] } );
        },
    } );
    const updateModifierGroupMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdateModifierGroupRequest;
        } ) => productApi.updateModifierGroup( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "modifier-group", id ] } );
            queryClient.invalidateQueries( { queryKey: [ "modifier-groups" ] } );
        },
    } );
    const getModifierGroupById = ( id: string ) =>
        useSuspenseQuery( {
            queryKey: [ "modifier-group", id ],
            queryFn: () => productApi.getModifierGroupById( id ),
        } );
    const createModifierOptionMutation = useMutation( {
        mutationFn: ( {
            groupId,
            data,
        }: {
            groupId: string;
            data: TUpdateModifierOptionRequest;
        } ) => productApi.createModifierOption( groupId, data ),
        onSuccess: ( _res, { groupId } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "modifier-options", groupId ] } );
        },
    } );
    const updateModifierOptionMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TUpdateModifierOptionRequest;
        } ) => productApi.updateModifierOption( id, data ),
        onSuccess: ( _res, { id } ) =>
        {
            queryClient.invalidateQueries( { queryKey: [ "modifier-option", id ] } );
        },
    } );

    const addExtraProductIntoProductMutation = useMutation( {
        mutationFn: ( {
            id,
            data,
        }: {
            id: string;
            data: TAddExtraProductRequest;
        } ) => productApi.addExtraProductIntoProduct( id, data ),
    } );

    return {
        getProducts,
        getProductById,
        createProductMutation,
        updateProductMutation,
        inactivateVariantsMutation,
        addVariantIntoProductMutation,
        updateModifierGroupsIntoProductMutation,

        getModifierGroups,
        getModifierGroupById,
        // Mutations
        getModifierOptionsByGroupId,
        getModifierOptionById,
        createModifierGroupMutation,
        updateModifierGroupMutation,
        updateModifierOptionMutation,
        createModifierOptionMutation,
        addExtraProductIntoProductMutation,
    };
};
