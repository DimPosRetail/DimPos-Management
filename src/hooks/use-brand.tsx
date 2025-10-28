import { brandApi } from "@/apis/brand.api";
import type { TUpdateBrand } from "@/schema/brand.schema";
import type { TRole } from "@/schema/role.schema";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface UseBrandParams
{
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  name?: string;
  code?: string | null;
}

export const useBrand = () =>
{
  const queryClient = useQueryClient();

  const getBrands = ( params: UseBrandParams = {} ) =>
  {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sortBy = params.sortBy || "createdDate",
      isAsc = params.isAsc || true,
      name = params.name || null,
      code = params.code || null,
    } = params;

    return useQuery( {
      queryKey: [ "brands", { page, size, sortBy, isAsc, name, code } ],
      queryFn: () => brandApi.getAllBrands( { page, size, sortBy, isAsc, name, code } ),
    } );
  };

  const getBrandDetails = ( role: TRole ) =>
    useQuery( {
      queryKey: [ "brand-details" ],
      queryFn: () => brandApi.getBrandDetails(),
      enabled: role === "BrandAdmin",
    } );

  const getBrandById = ( id: string ) =>
    useSuspenseQuery( {
      queryKey: [ "brand", id ],
      queryFn: () => brandApi.getBrandById( id ),
    } );

  const changePasswordForBrandMutation = useMutation( {
    mutationFn: ( params: { id: string; data: { password: string } } ) => brandApi.changePasswordForBrand( params.id, params.data )
  } );

  const editBrandMutation = useMutation( {
    mutationFn: ( data: TUpdateBrand ) =>
    {
      const formData = new FormData();
      formData.append( "Name", data.name );
      formData.append( "Address", data.address );
      formData.append( "Phone", data.phone );
      if ( data.picture )
      {
        formData.append( "Picture", data.picture );
      }
      return brandApi.editBrand( formData );
    },
  } )

  const createBrand = () =>
    useMutation( {
      mutationFn: ( data: FormData ) => brandApi.createBrand( data ),
      onSuccess: () =>
      {
        queryClient.invalidateQueries( { queryKey: [ "brands" ] } );
      },
    } );

  const updateBrandMutation = () =>
    useMutation( {
      mutationFn: ( { id, data }: { id: string; data: TUpdateBrand } ) =>
      {
        const formData = new FormData();
        formData.append( "Name", data.name );
        formData.append( "Address", data.address );
        formData.append( "Phone", data.phone );
        if ( data.picture )
        {
          formData.append( "Picture", data.picture );
        }
        return brandApi.updateBrand( id, formData );
      },
    } );

  return {
    getBrands,
    getBrandDetails,
    getBrandById,
    changePasswordForBrandMutation,
    editBrandMutation,
    createBrand,
    updateBrandMutation,
  };
};
