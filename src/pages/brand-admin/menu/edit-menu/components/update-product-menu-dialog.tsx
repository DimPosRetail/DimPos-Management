import { DataTable } from '@/components/table/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useMenu } from '@/hooks/use-menu';
import { useProductVariant } from '@/hooks/use-product-variant';
import { getFilterValue, useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { UpdateBrandProductSchema, type TUpdateBrandProduct } from '@/schema/menu.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { selectColumns } from './product/column';
import { Button } from '@/components/ui/button';

type Props = {
    brandMenuId: string;
    productVariantIds: string[];
    children: ReactNode;
}

const UpdateProductMenuDialog = ( { brandMenuId, productVariantIds, children }: Props ) =>
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
                id: "code",
                value: "",
            },
            {
                id: "sku",
                value: null,
            },
            {
                id: "type",
                value: null,
            },
        ]
    } );
    const [ open, setOpen ] = useState( false );
    const { updateProductsByBrandMenuId } = useMenu()
    const { getProductVariantsMenu } = useProductVariant();
    const { data: productsData, isLoading: productsLoading, isError: isProductsError, error: productsError } =
        getProductVariantsMenu(
            {
                size: pageSize,
                page: currentPage,
                sortBy: sortBy,
                isAsc: isAsc,
                code: filter.find( f => f.id === "code" )?.value as string || "",
                sku: filter.find( f => f.id === "sku" )?.value as string || null,
                type: getFilterValue( {
                    id: "type",
                    columnFilters: filter,
                } ) === "All" ? null : getFilterValue( {
                    id: "type",
                    columnFilters: filter,
                } ),
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
        value: f.value ?? ( f.id === "type" ? "All" : "" ),
        searchPlaceholder: f.id === "code" ? "Tìm kiếm theo mã sản phẩm" : f.id === "sku" ? "Tìm kiếm theo mã SKU" : f.id === "type" ? "Loại sản phẩm" : "",
        isSelect: f.id === "type",
        options: f.id === "type" ? [
            { label: "Tất cả", value: "All" },
            { label: "Sản phẩm đơn", value: 'Single' },
            { label: "Combo", value: 'Combo' },
            { label: "Sản phẩm phụ", value: 'Extra' },
        ] : [],
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const form = useForm<TUpdateBrandProduct>( {
        resolver: zodResolver( UpdateBrandProductSchema ),
        defaultValues: {
            brandMenuId: brandMenuId,
            productVariantIds: productVariantIds,
        }
    } )
    useEffect( () =>
    {
        form.setValue( "productVariantIds", productVariantIds );
        resetParams();
    }, [ open, setOpen ] );


    const onSubmit = async ( data: TUpdateBrandProduct ) =>
    {
        try
        {
            await updateProductsByBrandMenuId.mutateAsync( data )
            queryClient.invalidateQueries( { queryKey: [ 'brandMenu', brandMenuId ] } );
            setOpen( false );
            toast.success( "Cập nhật sản phẩm trong thực đơn thành công!" );
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
        const currentProductVariantIds = form.getValues( "productVariantIds" ) as string[];

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
        form.setValue( "productVariantIds", updatedIds );
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
                            <DialogTitle>Chỉnh sửa sản phẩm trong thực đơn</DialogTitle>
                            <DialogDescription>
                                Chọn sản phẩm để thêm vào thực đơn.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]">
                            <DataTable
                                columns={ selectColumns }
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
                                        acc[ item.id ] = ( form.watch( "productVariantIds" ) as string[] ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="button" disabled={ updateProductsByBrandMenuId.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                                Cập nhật thực đơn
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProductMenuDialog