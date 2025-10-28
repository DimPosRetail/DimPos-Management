import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useComboProduct } from '@/hooks/use-combo-product';
import { useProductVariant } from '@/hooks/use-product-variant';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { AddItemToComboProductSchema, type TAddItemToComboProduct } from '@/schema/combo-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { columnsForCreate } from './columns';

type Props = {
    productComboId: string;
    children: ReactNode;
    existedProductVariantIds?: string[];
}

const AddComboProductItemDialog = ( {
    productComboId,
    children,
    existedProductVariantIds = [],
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { addItemToComboProductMutation } = useComboProduct();
    const [ isOpen, setIsOpen ] = useState( false );
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
        filter,
        setFilter,
    } = useQueryParams( {
        defaultFilter: [
            { id: "sku", value: "" },
        ]
    } );
    const form = useForm<TAddItemToComboProduct>( {
        resolver: zodResolver( AddItemToComboProductSchema ),
    } )

    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset();
        }
    }, [ isOpen, form ] );

    const onSubmit = async ( data: TAddItemToComboProduct ) =>
    {
        if ( !productComboId )
        {
            return;
        }
        if ( data.productVariantItemId === undefined || data.productVariantItemId === "" )
        {
            form.setError( 'productVariantItemId', { type: 'manual', message: 'Vui lòng chọn sản phẩm' } );
            return;
        }
        try
        {
            await addItemToComboProductMutation.mutateAsync( {
                comboProductId: productComboId,
                data: data,
            } );
            queryClient.invalidateQueries( { queryKey: [ "combo-product", productComboId ] } );
            toast.success( "Thêm sản phẩm vào combo thành công!" );
            setIsOpen( false );
        } catch ( error )
        {
            handleApiError( error );
        }
    }

    const { getProductVariants } = useProductVariant()
    const { data, isLoading, isError, error } = getProductVariants( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        sku: filter.find( f => f.id === "sku" )?.value as string || "",
        isActive: true,
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items.filter( item => !existedProductVariantIds.includes( item.id ) ) || [];
    const total = data?.data.data.total || 0;

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "sku" ? "Tìm kiếm theo SKU" : "",
    } ) );
    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const newlySelectedId = Object.keys( newSelection ).find(
            ( id ) => newSelection[ id ] && !oldSelection[ id ]
        );
        if ( newlySelectedId )
        {
            form.setValue( 'productVariantItemId', newlySelectedId );
        } else
        {
            form.setValue( 'productVariantItemId', '' );
        }
    }
    return (
        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] overflow-x-scroll rounded-3xl [&>button]:hidden">
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Thêm sản phẩm trong combo</DialogTitle>
                            <DialogDescription>
                                Chọn sản phẩm để thêm vào combo.
                            </DialogDescription>
                        </DialogHeader>
                        <FormMessage className="mt-4">
                            { form.formState.errors.productVariantItemId?.message }
                        </FormMessage>
                        <div className='my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]'>
                            <DataTable
                                isShort={ true }
                                columns={ columnsForCreate }
                                data={ items }
                                totalItems={ total }
                                currentPage={ currentPage }
                                pageSize={ pageSize }
                                onPageChange={ setPage }
                                onPageSizeChange={ setPageSize }
                                isLoading={ isLoading }
                                onSearchChange={ setFilter }
                                searchValues={ searchValues }
                                sortValues={ [ sortValue ] }
                                onSortChange={ ( newSort ) =>
                                {
                                    setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
                                } }
                                rowSelection={ items.reduce<Record<string, boolean>>( ( acc, item ) =>
                                {
                                    acc[ item.id ] = ( form.watch( "productVariantItemId" ) === item.id );
                                    return acc;
                                }, {} ) }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <FormField
                            control={ form.control }
                            name="quantity"
                            render={ ( { field } ) => (
                                <FormItem className='mt-4'>
                                    <FormLabel>Số lượng *</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={ addItemToComboProductMutation.isPending || form.watch( 'productVariantItemId' ) === undefined || form.watch( 'productVariantItemId' ) === '' }
                                            placeholder="Nhập số lượng"
                                            { ...field }
                                            onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="displayOrder"
                            render={ ( { field } ) => (
                                <FormItem className='mt-4'>
                                    <FormLabel>Thứ tự hiển thị *</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={ addItemToComboProductMutation.isPending || form.watch( 'productVariantItemId' ) === undefined || form.watch( 'productVariantItemId' ) === '' }
                                            placeholder="Nhập thứ tự hiển thị"
                                            { ...field }
                                            onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () =>
                    {
                        form.reset();
                        setIsOpen( false );
                    } }>Hủy</Button>
                    <Button type="button" form="add-condition-form" disabled={ addItemToComboProductMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                        Thêm sản phẩm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddComboProductItemDialog