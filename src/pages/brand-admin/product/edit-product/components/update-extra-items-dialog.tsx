import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useExtraProduct } from '@/hooks/use-extra-product';
import { useProduct } from '@/hooks/use-product';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { AddExtraProductSchema, type TAddExtraProductRequest } from '@/schema/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { selectedExtraProductColumns } from './column';

type Props = {
  productId: string;
  existingExtraItemIds: string[];
  children: ReactNode;
}

const UpdateExtraItemsDialog = ( {
  productId,
  existingExtraItemIds,
  children
}: Props ) =>
{
  const queryClient = useQueryClient();
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    filter,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetParams,
  } = useQueryParams( {
    defaultSortBy: "isActive",
    defaultIsAsc: false,
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
      {
        id: "sku",
        value: "",
      },
    ]
  } );
  const [ open, setOpen ] = useState( false );
  const { addExtraProductIntoProductMutation } = useProduct();
  const { getExtraProductsQuery } = useExtraProduct()
  const { data: productsData, isLoading: productsLoading, isError: isProductsError, error: productsError } =
    getExtraProductsQuery(
      {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "code" )?.value as string || "",
        sku: filter.find( f => f.id === "sku" )?.value as string || "",
      }
    );
  const items = productsData?.data.data.items || [];
  const total = productsData?.data.data.total || 0;
  if ( isProductsError && productsError )
  {
    handleApiError( productsError );
  }
  const searchValues = filter.map( f => ( {
    ...f,
    searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên sản phẩm phụ" : f.id === "sku" ? "Tìm kiếm theo mã SKU" : "",
  } ) )

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  }

  const form = useForm<TAddExtraProductRequest>( {
    resolver: zodResolver( AddExtraProductSchema ),
    defaultValues: {
      productVariantItemIds: existingExtraItemIds,
    }
  } );

  useEffect( () =>
  {
    form.setValue( "productVariantItemIds", existingExtraItemIds );
    resetParams();
  }, [ open, setOpen ] );
  const onSubmit = async ( data: TAddExtraProductRequest ) =>
  {
    try
    {
      await addExtraProductIntoProductMutation.mutateAsync( {
        id: productId,
        data
      } )
      queryClient.invalidateQueries( { queryKey: [ 'product', productId ] } );
      setOpen( false );
      toast.success( "Cập nhật sản phẩm phụ thành công!" );
    } catch ( error )
    {
      handleApiError( error );
    }
  }

  const handleRowSelectionChange = (
    newSelection: Record<string, boolean>,
    oldSelection: Record<string, boolean>
  ) =>
  {
    const currentProductVariantIds = form.getValues( "productVariantItemIds" ) as string[];

    const newlySelected = Object.entries( newSelection )
      .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
      .map( ( [ rowId ] ) => rowId );

    const newlyDeselected = Object.entries( oldSelection )
      .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
      .map( ( [ rowId ] ) => rowId );

    let updatedIds = [ ...currentProductVariantIds ];

    newlySelected.forEach( id =>
    {
      if ( !updatedIds.includes( id ) )
      {
        updatedIds.push( id );
      }
    } );

    // Xóa những item được deselect
    updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

    // Set form value
    form.setValue( "productVariantItemIds", updatedIds );
  }
  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] rounded-3xl [&>button]:hidden">
        <Form { ...form } >
          <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm phụ trong sản phẩm gốc</DialogTitle>
              <DialogDescription>
                Chọn sản phẩm phụ để thêm vào sản phẩm gốc.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]">
              <DataTable
                columns={ selectedExtraProductColumns }
                data={ items }
                totalItems={ total }
                currentPage={ currentPage }
                pageSize={ pageSize }
                onPageChange={ setPage }
                onPageSizeChange={ setPageSize }
                isLoading={ productsLoading }
                onSearchChange={ setFilter }
                searchValues={ searchValues }
                sortValues={ [ sortValue ] }
                onSortChange={ ( newSort ) =>
                {
                  setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
                } }
                rowSelection={
                  items.reduce<Record<string, boolean>>( ( acc, item ) =>
                  {
                    acc[ item.id ] = ( form.watch( "productVariantItemIds" ) as string[] ).includes( item.id );
                    return acc;
                  }, {} )
                }
                onRowSelectionChange={ handleRowSelectionChange }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
              <Button type="button" disabled={ addExtraProductIntoProductMutation.isPending || ( form.watch( "productVariantItemIds" ) as string[] ).length === existingExtraItemIds.length &&
                JSON.stringify( [ ...( form.watch( "productVariantItemIds" ) as string[] ) ].sort() ) === JSON.stringify( [ ...existingExtraItemIds ].sort() ) } onClick={ form.handleSubmit( onSubmit ) }>
                Cập nhật sản phẩm phụ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateExtraItemsDialog