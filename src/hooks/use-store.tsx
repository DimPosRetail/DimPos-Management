import { storeApi } from "@/apis/store.api";
import type { TRole } from "@/schema/role.schema";
import type {
  TAddStoreTaxRateRequest,
  TCreateStoreRequest,
  TStore,
  TUpdateDetailStoreMenu,
  TUpdateStoreProductPrice,
  TUpdateStoreRequest,
  TUpdateStoreTaxRateRequest,
} from "@/schema/store.schema";
import
{
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface UseStoreParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  code?: string;
}

export const useStore = () =>
{
  const queryClient = useQueryClient();

  const getStores = ( params: UseStoreParams = {} ) =>
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
      queryKey: [ "stores", { page, size, sortBy, isAsc, name, code } ],
      queryFn: async () =>
        storeApi.getStores( {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          name: name,
          code: code,
        } ),
    } );
  };

  const getStoresByBrand = ( role: TRole, params: UseStoreParams = {} ) =>
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
      queryKey: [ "stores", { page, size, sortBy, isAsc, name, code } ],
      queryFn: async () =>
        storeApi.getStores( {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
          name: name,
          code: code,
        } ),
      enabled: role === "BrandAdmin",
    } );
  };

  const getStoreById = ( id: string ) =>
    useSuspenseQuery( {
      queryKey: [ "store", id ],
      queryFn: () => storeApi.getStoreById( id ),
    } );
  const getStoreMenusById = ( id: string, params: UseStoreParams = {} ) =>
  {
    const {
      page = 1,
      size = 10,
      sortBy = "createdDate",
      isAsc = true,
    } = params;
    return useQuery( {
      queryKey: [ "storeBrandMenus", id, { page, size, sortBy, isAsc } ],
      queryFn: () =>
        storeApi.getStoreMenusById( id, {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        } ),
    } );
  };

  const getStoreMenuByMenuId = ( id: string ) =>
    useSuspenseQuery( {
      queryKey: [ "detailStoreMenu", id ],
      queryFn: () => storeApi.getStoreMenuByMenuId( id ),
    } );
  const updateStoreMenuItemMutation = useMutation( {
    mutationFn: ( {
      storeMenuId,
      data,
    }: {
      storeMenuId: string;
      data: TUpdateDetailStoreMenu;
    } ) => storeApi.updateStoreMenuItem( storeMenuId, data ),
  } );

  const updateStatusStoreMenuMutation = useMutation( {
    mutationFn: ( {
      storeId,
      storeMenuId,
      isActiveAtStore,
    }: {
      storeId: string;
      storeMenuId: string;
      isActiveAtStore: boolean;
    } ) => storeApi.updateStatusStoreMenu( storeId, storeMenuId, isActiveAtStore ),
    onSuccess: ( _, { storeId } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "storeMenus", storeId ] } );
    },
  } );

  const getStoreProductsByStoreId = (
    storeId: string,
    params: UseStoreParams = {}
  ) =>
  {
    const { page = 1, size = 10, sortBy = "id", isAsc = true } = params;
    return useQuery( {
      queryKey: [ "storeProducts", storeId, { page, size, sortBy, isAsc } ],
      queryFn: () =>
        storeApi.getStoreProductsByStoreId( storeId, {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        } ),
    } );
  };

  const getStoreProductById = ( storeProductId: string ) =>
    useSuspenseQuery( {
      queryKey: [ "storeProduct", storeProductId ],
      queryFn: () => storeApi.getStoreProductById( storeProductId ),
    } );

  const updateStoreProductPriceMutation = useMutation( {
    mutationFn: ( {
      storeProductId,
      data,
    }: {
      storeProductId: string;
      data: TUpdateStoreProductPrice;
    } ) => storeApi.updateStoreProductPrice( storeProductId, data ),
  } );

  const createStoreMutation = useMutation( {
    mutationFn: ( data: TCreateStoreRequest ) =>
      storeApi.createStoreMutation( data ),
    onSuccess: () =>
    {
      queryClient.invalidateQueries( { queryKey: [ "store" ] } );
    },
  } );

  const updateStoreMutation = useMutation( {
    mutationFn: ( params: { id: string; data: Pick<TStore, "startingStoreCashLending" | "status"> } ) =>
      storeApi.updateStoreMutation( params.id, params.data ),
    onSuccess: ( _, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "store", id ] } );
      queryClient.invalidateQueries( { queryKey: [ "stores" ] } );
    },
  } );

  const getStoreDetail = () =>
    useSuspenseQuery( {
      queryKey: [ "store-detail" ],
      queryFn: () => storeApi.getStoreDetail(),
    } );
  const getBrandLogoImageFromStore = ( role: TRole ) =>
    useQuery( {
      queryKey: [ "store-logo-image" ],
      queryFn: () => storeApi.getStoreDetail(),
      select: ( data ) => data.data.data.pictureUrl,
      enabled: role === "StoreAdmin",
    } );
  const updateStoreDetailMutation = useMutation( {
    mutationFn: ( params: { id: string; data: TUpdateStoreRequest } ) =>
      storeApi.updateStoreDetail( params.data ),
    onSuccess: ( _, { id } ) =>
    {
      queryClient.invalidateQueries( { queryKey: [ "store", id ] } );
      queryClient.invalidateQueries( { queryKey: [ "stores" ] } );
    },
  } );

  const getStoreTaxRates = ( storeId: string, params: UseStoreParams = {} ) =>
  {
    const {
      page = 1,
      size = 10,
      sortBy = "createdDate",
      isAsc = false,
    } = params;
    return useQuery( {
      queryKey: [ "store-tax-rates", storeId, { page, size, sortBy, isAsc } ],
      queryFn: () =>
        storeApi.getStoreTaxRates( storeId, {
          page: page,
          size: size,
          sortBy: sortBy,
          isAsc: isAsc,
        } ),
    } );
  };

  const addStoreTaxRateMutation = useMutation( {
    mutationFn: ( {
      storeId,
      data,
    }: {
      storeId: string;
      data: TAddStoreTaxRateRequest;
    } ) => storeApi.addStoreTaxRate( storeId, data ),
  } );

  const updateStoreTaxRateMutation = useMutation( {
    mutationFn: ( {
      storeId,
      taxRateId,
      data,
    }: {
      storeId: string;
      taxRateId: string;
      data: TUpdateStoreTaxRateRequest;
    } ) => storeApi.updateStoreTaxRate( storeId, taxRateId, data )
  } );

  return {
    getStores,
    getStoresByBrand,
    getStoreById,
    getStoreMenusById,
    getStoreMenuByMenuId,
    createStoreMutation,
    updateStoreMutation,
    getStoreDetail,
    getBrandLogoImageFromStore,
    updateStoreMenuItemMutation,
    getStoreProductsByStoreId,
    getStoreProductById,
    updateStoreProductPriceMutation,
    updateStoreDetailMutation,
    updateStatusStoreMenuMutation,

    getStoreTaxRates,
    addStoreTaxRateMutation,
    updateStoreTaxRateMutation,
  };
};
