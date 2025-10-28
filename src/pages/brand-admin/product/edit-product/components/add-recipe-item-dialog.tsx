import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useIngredient } from '@/hooks/use-ingredient';
import { useProductVariant } from '@/hooks/use-product-variant';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { RequestRecipeItemSchema, type TRequestRecipeItem } from '@/schema/product-variant.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ingredientColumns } from './column';

type Props = {
    productVariantId: string;
    children: ReactNode;
    existedIngredientIds?: string[];
}

const AddRecipeItemDialog = ( {
    productVariantId,
    children,
    existedIngredientIds = [],
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { addRecipeItemMutation } = useProductVariant();
    const [ isOpen, setIsOpen ] = useState( false );
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
                id: "code",
                value: "",
            },
        ]
    } );

    const { getIngredients } = useIngredient()
    const { data, isLoading, isError, error } = getIngredients( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
        code: filter.find( f => f.id === "code" )?.value as string || "",
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items.filter( item => !existedIngredientIds.includes( item.id ) ) || [];
    const total = data?.data.data.total || 0;
    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên thành phần" : f.id === "code" ? "Tìm kiếm theo mã thành phần" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const form = useForm<TRequestRecipeItem>( {
        resolver: zodResolver( RequestRecipeItemSchema ),
        defaultValues: {
            ingredientId: undefined,
            quantity: undefined,
        },
    } );

    useEffect( () =>
    {
        resetParams();
        form.reset();
    }, [ isOpen, form ] );

    const onSubmit = async ( data: TRequestRecipeItem ) =>
    {
        if ( !productVariantId )
        {
            return;
        }
        if ( data.ingredientId === undefined || data.ingredientId === "" )
        {
            form.setError( 'ingredientId', { type: 'manual', message: 'Vui lòng chọn thành phần' } );
            return;
        }
        if ( data.quantity === undefined || data.quantity <= 0 )
        {
            form.setError( 'quantity', { type: 'manual', message: 'Số lượng phải lớn hơn 0' } );
            return;
        }
        try
        {
            await addRecipeItemMutation.mutateAsync( {
                productVariantId: productVariantId,
                data: data,
            } );
            toast.success( "Thêm thành phần vào công thức thành công" );
            queryClient.invalidateQueries( {
                queryKey: [ 'recipeItems', productVariantId ],
            } );
            resetParams();
            form.reset();
            setIsOpen( false );
        }
        catch ( error )
        {
            handleApiError( error );
        }
    };

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
            form.setValue( 'ingredientId', newlySelectedId );
        } else
        {
            form.setValue( 'ingredientId', '' );
        }
    }


    return (
        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] rounded-3xl [&>button]:hidden">
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                    {
                        console.error( "Form validation errors:", errors );
                    } ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Thêm thành phần</DialogTitle>
                            <DialogDescription>
                                Thêm thành phần và số lượng cho công thức này.
                            </DialogDescription>
                        </DialogHeader>
                        <FormMessage>
                            { form.formState.errors.ingredientId?.message }
                        </FormMessage>
                        <div className='my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]'>
                            <DataTable
                                isShort
                                columns={ ingredientColumns }
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
                                rowSelection={
                                    items.reduce<Record<string, boolean>>( ( acc, item ) =>
                                    {
                                        acc[ item.id ] = form.watch( "ingredientId" ) as string === item.id;
                                        return acc;
                                    }, {} )
                                }
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
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            disabled={ addRecipeItemMutation.isPending || form.watch( 'ingredientId' ) === undefined || form.watch( 'ingredientId' ) === '' }
                                            placeholder="Nhập số lượng"
                                            { ...field }
                                            onChange={ ( e ) =>
                                            {
                                                const value = e.target.value;
                                                // Allow empty string and valid decimal patterns
                                                if ( value === '' || /^\d*\.?\d*$/.test( value ) )
                                                {
                                                    field.onChange( value === '' ? undefined : parseFloat( value ) || 0 );
                                                }
                                            } }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={ () =>
                            {
                                resetParams();
                                form.reset();
                                setIsOpen( false );
                            } }>Hủy</Button>
                            <Button type="button" disabled={ addRecipeItemMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddRecipeItemDialog