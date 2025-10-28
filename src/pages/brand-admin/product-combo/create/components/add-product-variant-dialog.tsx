import { DataTable, type TProductDisplayOrder, type TProductQuantity } from "@/components/table/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormMessage } from "@/components/ui/form";
import { useProductVariant } from "@/hooks/use-product-variant";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { CreateItemProductVariantsSchema, type TCreateItemProductVariant, type TCreateItemProductVariants } from "@/schema/combo-product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./columns";

import { Button } from "@/components/ui/button";

type AddProductVariantDialogProps = {
    children: ReactNode;
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    isSubmitting?: boolean;
    initialData?: TCreateItemProductVariants;
    onSave: ( data: TCreateItemProductVariants ) => void;
}

const AddProductVariantDialog = ( {
    children,
    isOpen,
    onOpenChange,
    isSubmitting = false,
    initialData,
    onSave,
}: AddProductVariantDialogProps ) =>
{
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
            {
                id: "sku",
                value: "",
            },
        ]
    } );
    const form = useForm<TCreateItemProductVariants>( {
        resolver: zodResolver( CreateItemProductVariantsSchema ),
        defaultValues: initialData || {
            itemProductVariants: [],
        },
    } )

    const onSubmit = ( data: TCreateItemProductVariants ) =>
    {
        onSave( data );
        onOpenChange( false );
    }

    const { getProductVariants } = useProductVariant()
    const { data, isLoading, isError, error } = getProductVariants( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        sku: filter.find( f => f.id === "sku" )?.value as string || "",
    } );
    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "sku" ? "Tìm kiếm theo SKU" : "",
    } ) )

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }
    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const currentItems = form.getValues( "itemProductVariants" ) as TCreateItemProductVariant[];
        const currentProductVariantIds = currentItems.map( variant => variant.productVariantId );

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

        updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

        const itemProductVariants = updatedIds.map( id =>
        {
            const productVariant = items.find( item => item.id === id );
            // if ( !productVariant ) return null;
            // Keep old requestedQuantity if exists, otherwise default to 1
            const existing = currentItems.find( item => item.productVariantId === id );
            return {
                productVariantId: productVariant?.id || existing?.productVariantId,
                productVariantName: existing ? existing.productVariantName : ( productVariant?.name || "" ),
                quantity: existing ? existing.quantity : 1,
                displayOrder: existing ? existing.displayOrder : 0,
                unitPrice: existing ? existing.unitPrice : ( productVariant?.price || 0 ),
            };
        } ).filter( item => item !== null ) as TCreateItemProductVariant[];
        form.setValue( "itemProductVariants", itemProductVariants );
    }

    const quantityValues = useMemo( (): TProductQuantity[] =>
    {
        const value = form.watch( "itemProductVariants" );
        return ( value as TCreateItemProductVariant[] ).map( item => ( {
            productVariantId: item.productVariantId,
            quantity: item.quantity || 1,
        } ) );

    }, [ form.watch( "itemProductVariants" ) ] );

    const handleQuantityChange = ( productVariantId: string, quantity: number ) =>
    {
        const currentValue = form.getValues( "itemProductVariants" );
        const updatedValue = currentValue.map( item =>
        {
            if ( item.productVariantId === productVariantId )
            {
                return { ...item, quantity: quantity };
            }
            return item;
        } );
        form.setValue( "itemProductVariants", updatedValue );
    };

    const displayOrderValues = useMemo( (): TProductDisplayOrder[] =>
    {
        const value = form.watch( "itemProductVariants" );
        return ( value as TCreateItemProductVariant[] ).map( item => ( {
            productVariantId: item.productVariantId,
            displayOrder: item.displayOrder || 0,
        } ) );

    }, [ form.watch( "itemProductVariants" ) ] );


    const handleDisplayOrderChange = ( productVariantId: string, displayOrder: number ) =>
    {
        const currentValue = form.getValues( "itemProductVariants" );
        const updatedValue = currentValue.map( item =>
        {
            if ( item.productVariantId === productVariantId )
            {
                return { ...item, displayOrder: displayOrder };
            }
            return item;
        } );
        form.setValue( "itemProductVariants", updatedValue );
    };


    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] overflow-x-scroll rounded-3xl [&>button]:hidden">
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>{ initialData ? 'Chỉnh sửa' : 'Thêm' } sản phẩm trong combo</DialogTitle>
                            <DialogDescription>
                                Chọn sản phẩm để thêm vào combo.
                            </DialogDescription>
                        </DialogHeader>
                        <FormMessage className="mt-4">
                            { form.formState.errors.itemProductVariants?.message }
                        </FormMessage>
                        <div className="my-4">
                            <DataTable
                                isShort={ true }
                                columns={ columns }
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
                                    acc[ item.id ] = ( form.watch( "itemProductVariants" ) as TCreateItemProductVariant[] ).map( variant => variant.productVariantId ).includes( item.id );
                                    return acc;
                                }, {} ) }
                                onRowSelectionChange={ handleRowSelectionChange }
                                meta={ {
                                    onQuantityChange: handleQuantityChange,
                                    quantityValues: quantityValues,
                                    displayOrderValues: displayOrderValues,
                                    onDisplayOrderChange: handleDisplayOrderChange,
                                } }
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                    <Button type="button" form="add-condition-form" disabled={ isSubmitting } onClick={ form.handleSubmit( onSubmit ) }>
                        Thêm sản phẩm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddProductVariantDialog