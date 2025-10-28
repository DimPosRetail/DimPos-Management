import { DataTable, type TProductQuantity } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductVariant } from "@/hooks/use-product-variant";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { CreateRuleConditionSchema, type TCreateRuleCondition } from "@/schema/promotion-rule.schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./column";

interface RuleConditionDialogProps
{
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: TCreateRuleCondition;
    onSave: ( data: TCreateRuleCondition ) => void;
    isSubmitting?: boolean;
}

export const RuleConditionDialog = (
    { children,
        isSubmitting = false,
        isOpen,

        onOpenChange,
        initialData,
        onSave,
    }: RuleConditionDialogProps ) =>
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


    const form = useForm<TCreateRuleCondition>( {
        resolver: zodResolver( CreateRuleConditionSchema ),
        defaultValues: {
            conditionType: 0,
            operator: 0,
            value: "",
        }
    } );

    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset( initialData || {
                conditionType: 0,
                operator: 0,
                value: "",
            } );
        }
    }, [ isOpen, initialData, form ] );
    const watchedConditionType = form.watch( 'conditionType' );
    const handleFormSubmit = ( data: TCreateRuleCondition ) =>
    {
        console.log( "Form submitted with data:", data );
        if ( data.conditionType === 0 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.conditionType === 1 )
        {
            try
            {
                const productIds: string[] = JSON.parse( data.value );
                if ( productIds.length === 0 )
                {
                    form.setError( 'value', { type: 'manual', message: 'Bạn phải chọn ít nhất một sản phẩm.' } );
                    return;
                }
                const hasInvalidId = productIds.some( id => typeof id !== 'string' || id.trim() === '' );
                if ( hasInvalidId )
                {
                    form.setError( 'value', { type: 'manual', message: 'Danh sách sản phẩm không hợp lệ.' } );
                    return;
                }
            } catch
            {
                form.setError( 'value', { type: 'manual', message: 'Dữ liệu sản phẩm không hợp lệ.' } );
                return;
            }
        }
        if ( data.conditionType === 2 )
        {
            if ( !data.value || typeof data.value !== 'string' )
            {
                form.setError( 'value', { type: 'manual', message: 'Bạn phải chọn một sản phẩm.' } );
                return;
            }
            try
            {
                // We now expect a single object, not an array
                const quantity: TProductQuantity = JSON.parse( data.value );
                if ( !quantity.productVariantId || !Number.isInteger( quantity.quantity ) || quantity.quantity < 1 )
                {
                    form.setError( 'value', { type: 'manual', message: 'Dữ liệu sản phẩm hoặc số lượng không hợp lệ.' } );
                    return;
                }
            } catch
            {
                form.setError( 'value', { type: 'manual', message: 'Dữ liệu sản phẩm không hợp lệ.' } );
                return;
            }
        }
        form.reset();
        onSave( data );
        onOpenChange( false );
    };


    const handleQuantityChange = ( productVariantId: string, quantity: number ) =>
    {
        // === CHANGE: This handler needs to work with a single object ===
        const currentValue = form.getValues( "value" );
        if ( typeof currentValue !== 'string' || currentValue.trim() === '' ) return;

        try
        {
            const currentQuantity: TProductQuantity = JSON.parse( currentValue );
            // Only update if the product ID matches
            if ( currentQuantity.productVariantId === productVariantId )
            {
                currentQuantity.quantity = Math.max( 1, quantity );
                form.setValue( "value", JSON.stringify( currentQuantity ), { shouldDirty: true } );
            }
        } catch
        {
            // Do nothing if parsing fails
            return;
        }
    };

    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const isSingleSelectModeForCondition = watchedConditionType === 2;

        if ( isSingleSelectModeForCondition )
        {
            const newlySelectedId = Object.keys( newSelection ).find(
                ( id ) => newSelection[ id ] && !oldSelection[ id ]
            );

            if ( newlySelectedId )
            {
                // === CHANGE: Create and stringify a SINGLE object, not an array ===
                const newQuantity: TProductQuantity = { productVariantId: newlySelectedId, quantity: 1 };
                form.setValue( "value", JSON.stringify( newQuantity ), { shouldDirty: true } );
            } else
            {
                // === CHANGE: When deselected, set value to an empty string ===
                form.setValue( "value", "", { shouldDirty: true } );
            }
        } else
        {
            const currentIds: string[] = JSON.parse( form.getValues( "value" ) ) || [];
            const newlySelected = Object.keys( newSelection ).filter( id => newSelection[ id ] && !oldSelection[ id ] );
            const newlyDeselected = Object.keys( oldSelection ).filter( id => oldSelection[ id ] && !newSelection[ id ] );

            let updatedIds = [ ...currentIds, ...newlySelected ];
            updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

            form.setValue( "value", JSON.stringify( Array.from( new Set( updatedIds ) ) ) );
        }
    };


    // In RuleConditionDialog.tsx

    const quantityValues = useMemo( (): TProductQuantity[] =>
    {
        if ( watchedConditionType !== 2 ) return [];
        const value = form.watch( "value" );
        if ( typeof value !== 'string' || value.trim() === '' ) return [];

        try
        {
            const parsed = JSON.parse( value );
            // === CHANGE: Wrap the single object in an array for the DataTable ===
            // This is the key part: the component's internal state is a single object,
            // but we provide an array to the child component (DataTable) that expects one.
            if ( parsed && typeof parsed === 'object' && !Array.isArray( parsed ) )
            {
                return [ parsed ]; // Return an array with the single object
            }
            return []; // Return empty if it's not a valid object
        } catch
        {
            return [];
        }
    }, [ form.watch( "value" ), watchedConditionType ] );

    const rowSelection = useMemo( () =>
    {
        const value = form.watch( "value" );
        if ( typeof value !== 'string' || value.trim() === '' ) return {};

        try
        {
            const parsed = JSON.parse( value );

            if ( watchedConditionType === 1 )
            {
                // This logic is for an array
                if ( Array.isArray( parsed ) )
                {
                    return parsed.reduce<Record<string, boolean>>( ( acc, id ) =>
                    {
                        acc[ id ] = true;
                        return acc;
                    }, {} );
                }
            }

            if ( watchedConditionType === 2 )
            {
                // === CHANGE: This logic is now for a single object ===
                if ( parsed && typeof parsed === 'object' && !Array.isArray( parsed ) && parsed.productVariantId )
                {
                    return { [ parsed.productVariantId ]: true };
                }
            }
        } catch
        {
            return {};
        }
        return {};
    }, [ form.watch( "value" ), watchedConditionType ] );


    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{ initialData ? 'Chỉnh sửa' : 'Thêm' } điều kiện khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Điền thông tin cho điều kiện mới. Điều kiện này sẽ được thêm vào danh sách.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form id="add-condition-form" className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={ form.control }
                                name="conditionType"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Loại điều kiện *</FormLabel>
                                        <Select
                                            disabled={ isSubmitting }
                                            onValueChange={ ( value ) =>
                                            {
                                                field.onChange( Number( value ) );
                                                if ( value === '0' )
                                                {
                                                    form.setValue( 'operator', 0 );
                                                    form.setValue( 'value', '' ); // Reset value for cart value condition
                                                }
                                                if ( value === '1' )
                                                {
                                                    form.setValue( 'operator', 3 );
                                                    form.setValue( 'value', JSON.stringify( [] ) ); // Reset value for product selection
                                                }
                                                if ( value === '2' )
                                                {
                                                    form.setValue( 'operator', 1 );
                                                    form.setValue( 'value', JSON.stringify( [] ) ); // Reset value for product selection
                                                }
                                            } }
                                            value={ field.value?.toString() }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">Giá trị tối thiểu của giỏ hàng</SelectItem>
                                                <SelectItem value="1">Giỏ hàng chứa sản phẩm</SelectItem>
                                                <SelectItem value="2">Số lượng của sản phẩm trong giỏ hàng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="operator"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Toán tử *</FormLabel>
                                        <Select
                                            key={ form.watch( 'conditionType' ) } // Re-render when conditionType changes
                                            disabled={ isSubmitting }
                                            onValueChange={ ( value ) => field.onChange( Number( value ) ) }
                                            value={ field.value?.toString() }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn toán tử so sánh" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                { form.watch( 'conditionType' ) === 0 && (
                                                    <>
                                                        <SelectItem value="0">{ 'Lớn hơn hoặc bằng (≥) ' }</SelectItem>
                                                        <SelectItem value="2">{ "Lớn hơn (>)" }</SelectItem>
                                                    </>
                                                ) }
                                                { form.watch( 'conditionType' ) === 1 && (
                                                    <>
                                                        <SelectItem value="3">{ "Chứa bất kì sản phẩm trong danh sách" }</SelectItem>
                                                        <SelectItem value="4">{ "Chứa tất cả sản phẩm trong danh sách" }</SelectItem>
                                                        <SelectItem value="5">{ "Chứa chính xác sản phẩm trong danh sách" }</SelectItem>
                                                    </>
                                                ) }
                                                { form.watch( 'conditionType' ) === 2 && (
                                                    <>
                                                        <SelectItem value="1">{ "Bằng nhau (=)" }</SelectItem>
                                                        <SelectItem value="2">{ "Lớn hơn (>)" }</SelectItem>
                                                    </>
                                                ) }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>

                        {
                            form.watch( 'conditionType' ) === 0 &&
                            <FormField
                                key={ form.watch( 'conditionType' ) }
                                control={ form.control }
                                name="value"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Giá trị *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ isSubmitting }
                                                placeholder="Vd: 500000"
                                                { ...field }
                                                value={ field.value ?? '' }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        }
                        {
                            ( watchedConditionType === 1 || watchedConditionType === 2 ) &&
                            <div className="space-x-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium">
                                        Chọn sản phẩm áp dụng *
                                    </label>
                                    <FormMessage>
                                        { form.formState.errors.value?.message }
                                    </FormMessage>
                                </div>
                                <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]">
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
                                        rowSelection={ rowSelection }
                                        onRowSelectionChange={ handleRowSelectionChange }
                                        meta={ {
                                            conditionType: watchedConditionType,
                                            onQuantityChange: handleQuantityChange,
                                            quantityValues: quantityValues,
                                        } }
                                    />
                                </div>
                            </div>
                        }
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                    <Button type="button" form="add-condition-form" disabled={ isSubmitting } onClick={ form.handleSubmit( handleFormSubmit ) }>Thêm điều kiện</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}