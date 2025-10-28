import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductVariant } from '@/hooks/use-product-variant';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { EditRuleActionSchema, type TEditRuleAction, type TRuleActions } from '@/schema/promotion-rule.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { columns } from './column';

interface RuleConditionDialogProps
{
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: TRuleActions;
    onSave: ( data: TRuleActions ) => Promise<void>;
    isSubmitting?: boolean;
}

const RuleActionDialog = ( {
    children,
    isSubmitting = false,
    isOpen,
    onOpenChange,
    initialData,
    onSave,
}: RuleConditionDialogProps ) =>
{
    console.log( "RuleActionDialog initialData:", initialData );
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


    const form = useForm<TEditRuleAction>( {
        resolver: zodResolver( EditRuleActionSchema ),
        defaultValues: {
            actionType: 0,
            value: "",
            targetCriteriaForItemAction: null,
            maxDiscountAmountForPercentage: 0,
        }
    } );

    useEffect( () =>
    {
        if ( isOpen )
        {
            form.reset( initialData ? {
                id: initialData.id,
                actionType: initialData.actionType,
                value: initialData.value,
                targetCriteriaForItemAction: JSON.parse( initialData.targetCriteriaForItemAction || "[]" ) as string[] | null,
                maxDiscountAmountForPercentage: initialData.maxDiscountAmountForPercentage || 0,
            } : {
                actionType: 0,
                value: "",
                targetCriteriaForItemAction: null,
                maxDiscountAmountForPercentage: 0,
            } );
        }
    }, [ isOpen, initialData, form ] );
    const watchedActionType = form.watch( 'actionType' );
    const handleFormSubmit = async ( data: TEditRuleAction ) =>
    {
        console.log( "Form submitted with data:", data );
        if ( data.actionType === 0 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 || numericValue > 100 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải nằm trong khoảng từ 0 đến 100.' } );
                return;
            }
            if ( !data.maxDiscountAmountForPercentage && data.maxDiscountAmountForPercentage! > 0 )
            {
                form.setError( 'maxDiscountAmountForPercentage', { type: 'manual', message: 'Bạn phải nhập giảm giá tối đa cho khuyến mãi.' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.actionType === 1 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải lớn hơn hoặc bằng 0.' } );
                return;
            }
            if ( !data.targetCriteriaForItemAction && data.targetCriteriaForItemAction!.length <= 0 )
            {
                form.setError( 'targetCriteriaForItemAction', { type: 'manual', message: 'Bạn phải chọn ít nhất một sản phẩm để áp dụng khuyến mãi cố định.' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.actionType === 2 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 || numericValue > 100 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải lớn hơn hoặc bằng 0.' } );
                return;
            }
            if ( !data.targetCriteriaForItemAction && data.targetCriteriaForItemAction!.length <= 0 )
            {
                form.setError( 'targetCriteriaForItemAction', { type: 'manual', message: 'Bạn phải chọn ít nhất một sản phẩm để áp dụng khuyến mãi theo phần trăm cho từng sản phẩm' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.actionType === 3 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 || numericValue > 100 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải lớn hơn hoặc bằng 0.' } );
                return;
            }
            if ( !data.targetCriteriaForItemAction && data.targetCriteriaForItemAction!.length !== 1 )
            {
                form.setError( 'targetCriteriaForItemAction', { type: 'manual', message: 'Bạn phải chọn một sản phẩm để áp dụng khuyến mãi theo phần trăm cho một sản phẩm' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.actionType === 4 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải lớn hơn hoặc bằng 0.' } );
                return;
            }
            if ( !data.targetCriteriaForItemAction && data.targetCriteriaForItemAction!.length <= 0 )
            {
                form.setError( 'targetCriteriaForItemAction', { type: 'manual', message: 'Bạn phải chọn ít nhất một sản phẩm để áp dụng khuyến mãi cố định cho từng sản phẩm.' } );
                return;
            }
            data.value = numericValue.toString();
        }
        if ( data.actionType === 5 )
        {
            const numericValue = parseFloat( data.value );
            if ( isNaN( numericValue ) || numericValue < 0 )
            {
                form.setError( 'value', { type: 'manual', message: 'Giá trị phải là một số hợp lệ và phải lớn hơn hoặc bằng 0.' } );
                return;
            }
            if ( !data.targetCriteriaForItemAction && data.targetCriteriaForItemAction!.length !== 1 )
            {
                form.setError( 'targetCriteriaForItemAction', { type: 'manual', message: 'Bạn phải chọn một sản phẩm để áp dụng khuyến mãi cố định cho một sản phẩm.' } );
                return;
            }
            data.value = numericValue.toString();
        }
        form.reset();
        await onSave( {
            ...data,
            targetCriteriaForItemAction: data.targetCriteriaForItemAction ? JSON.stringify( data.targetCriteriaForItemAction ) : null,
        } ); // Call generic save handler
        onOpenChange( false );
    };

    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const isSingleSelectMode = [ 3, 5 ].includes( watchedActionType );
        if ( isSingleSelectMode )
        {
            const newlySelectedId = Object.keys( newSelection ).find(
                ( id ) => newSelection[ id ] && !oldSelection[ id ]
            );

            if ( newlySelectedId )
            {
                form.setValue( "targetCriteriaForItemAction", [ newlySelectedId ], { shouldDirty: true } );
            } else
            {
                const remainingSelection = Object.keys( newSelection ).filter( id => newSelection[ id ] );
                form.setValue( "targetCriteriaForItemAction", remainingSelection, { shouldDirty: true } );
            }
        } else
        {
            const allSelectedIds = Object.keys( newSelection ).filter( id => newSelection[ id ] );
            form.setValue( "targetCriteriaForItemAction", allSelectedIds, { shouldDirty: true } );
        }
    };

    const rowSelection = useMemo( () =>
    {
        const selectedIds = form.watch( "targetCriteriaForItemAction" ) || [];
        return selectedIds.reduce<Record<string, boolean>>( ( acc, id ) =>
        {
            acc[ id ] = true;
            return acc;
        }, {} );
    }, [ form.watch( "targetCriteriaForItemAction" ) ] );


    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{ initialData ? 'Chỉnh sửa' : 'Thêm' } hành động khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Điền thông tin cho hành động mới.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form id="add-action-form" className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={ form.control }
                                name="actionType"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Loại hành động *</FormLabel>
                                        <Select
                                            disabled={ isSubmitting }
                                            onValueChange={ ( value ) =>
                                            {
                                                field.onChange( Number( value ) );
                                                if ( value !== "0" )
                                                {
                                                    form.setValue( "targetCriteriaForItemAction", [] );
                                                } else
                                                {
                                                    form.setValue( "targetCriteriaForItemAction", null );
                                                }
                                                form.setValue( "value", "" );
                                            } }
                                            value={ field.value?.toString() }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">Khuyến mãi theo phần trăm toàn giỏ hàng</SelectItem>
                                                <SelectItem value="1">Khuyến mãi cố định toàn giỏ hàng</SelectItem>
                                                <SelectItem value="2">Khuyến mãi theo phần trăm cho từng sản phẩm</SelectItem>
                                                <SelectItem value="3">Khuyến mãi theo phần trăm cho một sản phẩm</SelectItem>
                                                <SelectItem value="4">Khuyến mãi cố định cho từng sản phẩm</SelectItem>
                                                <SelectItem value="5">Khuyến mãi cố định cho một sản phẩm</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="maxDiscountAmountForPercentage"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Giảm giá tối đa</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={ isSubmitting || watchedActionType !== 0 }
                                                placeholder="Nhập số tiền tối đa cho giảm giá phần trăm"
                                                { ...field }
                                                value={ field.value ?? '' }
                                                onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>


                        <FormField
                            key={ form.watch( 'actionType' ) }
                            control={ form.control }
                            name="value"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>
                                        {
                                            ( watchedActionType === 0 || watchedActionType === 2 || watchedActionType === 3 ) && "Phần trăm giảm giá *"
                                        }
                                        {
                                            ( watchedActionType === 1 || watchedActionType === 4 || watchedActionType === 5 ) && "Giá tiền giảm giá *"
                                        }
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={ isSubmitting }
                                            placeholder=""
                                            { ...field }
                                            value={ field.value ?? '' }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        {
                            ( watchedActionType === 2 || watchedActionType === 3 || watchedActionType === 4 || watchedActionType === 5 ) &&
                            <div className='space-x-2'>
                                <label className="block text-sm font-medium">
                                    Chọn sản phẩm áp dụng *
                                </label>
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
                                    />
                                </div>
                            </div>
                        }
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                    <Button type="button" form="add-condition-form" disabled={ isSubmitting } onClick={ form.handleSubmit( handleFormSubmit ) }>Cập nhập</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RuleActionDialog