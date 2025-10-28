import { purchasableProductApi } from "@/apis/internal-product.api";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UseInternalProductParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  sku?: string | null;
  code?: string;
}

export const useInternalProduct = () =>
{
  const queryClient = useQueryClient();

  const getInternalProducts = ( params: UseInternalProductParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "name",
      isAsc = params.isAsc || true,
      name = params.name || "",
      code = params.code || "",
      sku = params.sku || null,
    } = params;

    return useQuery( {
      queryKey: [
        "internal-products",
        { page, size, sortBy, isAsc, name, sku, code },
      ],
      queryFn: async () =>
        purchasableProductApi.getPurchasableProducts( {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          name: name,
          sku: sku,
          code: code,
        } ),
    } );
  };

  const getInternalProductById = ( id: string ) =>
    useSuspenseQuery( {
      queryKey: [ "internal-product", id ],
      queryFn: () => purchasableProductApi.getPurchasableProductById( id ),
    } );

  const createInternalProductMutation = useMutation( {
    mutationFn: purchasableProductApi.createPurchasableProduct,
    onSuccess: () =>
    {
      queryClient.invalidateQueries( { queryKey: [ "internal-products" ] } );
    },
  } );

  const updateInternalProductMutation = useMutation( {
    mutationFn: ( params: { id: string; data: FormData } ) =>
      purchasableProductApi.updatePurchasableProduct( params.id, params.data ),
    onSuccess: ( _, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "internal-product", id ] } );
      queryClient.invalidateQueries( { queryKey: [ "internal-products" ] } );
    },
  } );

  return {
    getInternalProducts,
    getInternalProductById,
    createInternalProductMutation,
    updateInternalProductMutation,
  };
};
export const useInternalProductQuery = ( params: UseInternalProductParams = {} ) =>
{
  const {
    page = 1,
    size = 1000,
    sortBy = "name",
    isAsc = true,
    name = "",
    code = "",
    sku = "",
  } = params;

  return useQuery( {
    queryKey: [ "internal-products", { page, size, sortBy, isAsc, name, sku, code } ],
    queryFn: () =>
      purchasableProductApi.getPurchasableProducts( {
        page,
        size,
        sortBy,
        isAsc,
        name,
        code,
        sku,
      } ),
  } );
};