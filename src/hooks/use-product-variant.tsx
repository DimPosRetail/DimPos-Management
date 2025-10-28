import { productVariantApi } from "@/apis/product-variant.api";
import type { TRequestRecipeItem } from "@/schema/product-variant.schema";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UseProductVariantParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  code?: string;
  sku?: string | null;
  type?: string | null;
  isActive?: boolean | null;
}

export const useProductVariant = () =>
{
  const queryClient = useQueryClient();
  const getProductVariants = ( params: UseProductVariantParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "id",
      isAsc = params.isAsc || true,
      code = params.code || "",
      sku = params.sku || null,
      isActive = params.isActive || null,
    } = params;

    return useQuery( {
      queryKey: [
        "product-variants",
        {
          page,
          size,
          sortBy,
          isAsc,
          code,
          sku,
          isActive,
        },
      ],
      queryFn: () =>
        productVariantApi.getProductVariants( {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          code: code,
          sku: sku,
          isActive: isActive,
        } ),
      placeholderData: keepPreviousData,
    } );
  };

  const getProductVariantsMenu = ( params: UseProductVariantParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "id",
      isAsc = params.isAsc || true,
      code = params.code || "",
      sku = params.sku || null,
      type = params.type || null,
    } = params;

    return useQuery( {
      queryKey: [
        "product-variants-menu",
        {
          page,
          size,
          sortBy,
          isAsc,
          code,
          sku,
          type,
        },
      ],
      queryFn: () =>
        productVariantApi.getProductVariantsMenu( {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          code: code,
          sku: sku,
          isCombo: type === "All" ? null : type === "Combo" ? true : type === "Single" ? false : null,
          isExtra: type === "All" ? null : type === "Extra" ? true : type === "Single" ? false : null,
        } ),
      placeholderData: keepPreviousData,
    } );
  };

  const getProductVariantById = ( id: string ) =>
  {
    return useSuspenseQuery( {
      queryKey: [ "product-variant", id ],
      queryFn: () => productVariantApi.getProductVariantById( id ),
    } );
  };
  const getRecipeItemsByProductVariantId = ( id: string, params: UseProductVariantParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "id",
      isAsc = params.isAsc || true,
    } = params;
    return useQuery( {
      queryKey: [ "recipeItems", id, {
        page,
        size,
        sortBy,
        isAsc,
      } ],
      queryFn: () => productVariantApi.getRecipeItemsByProductVariantId( id, {
        page: page,
        size: size,
        sortBy: sortBy,
        isAsc: isAsc,
      } ),
    } );
  }
  const updateProductVariantMutation = useMutation( {
    mutationFn: ( {
      id,
      data,
    }: {
      id: string;
      data: { name: string; displayOrder?: number; isActive: boolean; sku?: string; price: number };
    } ) => productVariantApi.updateProductVariantApi( id, data ),
    onSuccess: ( _res, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "productVariant", id ] } );
    },
  } );

  const updateStatusProductVariantMutation = useMutation( {
    mutationFn: ( { id, isActive }: { id: string, isActive: boolean } ) => productVariantApi.updateStatusProductVariant( id, isActive ),
  } );

  const addRecipeItemMutation = useMutation( {
    mutationFn: ( {
      productVariantId,
      data
    }: {
      productVariantId: string;
      data: TRequestRecipeItem;
    } ) => productVariantApi.addRecipeItemToProductVariant( productVariantId, data ),
  } );

  const updateRecipeItemMutation = useMutation( {
    mutationFn: ( {
      productVariantId,
      recipeItemId,
      data
    }: {
      productVariantId: string;
      recipeItemId: string;
      data: Pick<TRequestRecipeItem, "quantity">;
    } ) => productVariantApi.updateRecipeItemInProductVariant( productVariantId, recipeItemId, data ),
  } );

  const deleteRecipeItemMutation = useMutation( {
    mutationFn: ( {
      productVariantId,
      recipeItemId
    }: {
      productVariantId: string;
      recipeItemId: string;
    } ) => productVariantApi.deleteRecipeItemFromProductVariant( productVariantId, recipeItemId ),
  } );


  const getBrandPriceHistory = ( id: string, params: UseProductVariantParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "changedAt",
      isAsc = params.isAsc || false,
    } = params;

    return useQuery( {
      queryKey: [
        "brand-price-history",
        id,
        {
          page,
          size,
          sortBy,
          isAsc,
        },
      ],
      queryFn: () =>
        productVariantApi.getBrandPriceHistory( id, {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        } ),
      placeholderData: keepPreviousData,
    } );
  }

  const getStorePriceHistory = ( productVariantId: string, storeId: string, params: UseProductVariantParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "changedAt",
      isAsc = params.isAsc || false,
    } = params;

    return useQuery( {
      queryKey: [
        "store-price-history",
        productVariantId,
        storeId,
        {
          page,
          size,
          sortBy,
          isAsc,
        },
      ],
      queryFn: () =>
        productVariantApi.getStorePriceHistory( productVariantId, storeId, {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        } ),
      placeholderData: keepPreviousData,
    } );
  }

  return {
    getProductVariants,
    getProductVariantsMenu,
    getProductVariantById,
    updateProductVariantMutation,
    updateStatusProductVariantMutation,

    getRecipeItemsByProductVariantId,
    addRecipeItemMutation,
    updateRecipeItemMutation,
    deleteRecipeItemMutation,

    getBrandPriceHistory,
    getStorePriceHistory,
  };
};
