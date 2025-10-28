import { DataTable } from '@/components/table/data-table';
import { usePaymentMethodConfig, useSystemPaymentMethod } from '@/hooks/use-payment-method-config';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { useEffect, useState, type ReactNode } from 'react'
import { columns } from './column';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { CreatePaymentMethodConfigSchema, type TCreatePaymentMethodConfig } from '@/schema/payment-method-config.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentMethodTypeEnum, type TPaymentMethodTypeEnum } from '@/types/enums/payment-method-type-enum';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    children: ReactNode;
    existingSystemPaymentMethodIds: string[];
}

const AddPaymentMethodDialog = ( {
    children,
    existingSystemPaymentMethodIds,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const [ openCreate, setOpenCreate ] = useState( false );
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
        filter,
        resetParams,
    } = useQueryParams( {
        defaultSortBy: "createdDate",
        defaultIsAsc: true,
    } );
    const { addPaymentMethodMutation } = usePaymentMethodConfig()
    const { getSystemPaymentMethods } = useSystemPaymentMethod()
    const { data, isLoading, isError, error } = getSystemPaymentMethods( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items.filter( ( item ) => !existingSystemPaymentMethodIds.includes( item.id ) ) || [];
    const total = data?.data.data.total || 0;

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const form = useForm<TCreatePaymentMethodConfig>( {
        resolver: zodResolver( CreatePaymentMethodConfigSchema ),
    } )

    console.log( "Form values:", form.watch() );
    useEffect( () =>
    {
        form.reset();
        resetParams();
    }, [ openCreate, setOpenCreate ] );
    const onSubmit = async ( data: TCreatePaymentMethodConfig ) =>
    {
        try
        {
            await addPaymentMethodMutation.mutateAsync( data );
            queryClient.invalidateQueries( { queryKey: [ 'payment-method-configs' ] } );
            setOpenCreate( false );
            form.reset();
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
        const newlySelectedId = Object.keys( newSelection ).find(
            ( id ) => newSelection[ id ] && !oldSelection[ id ]
        );
        if ( newlySelectedId )
        {
            form.setValue( 'systemPaymentMethodId', newlySelectedId );
            form.setValue( 'paymentMethodType', items.find( item => item.id === newlySelectedId )?.type as TPaymentMethodTypeEnum );
        } else
        {
            form.setValue( 'systemPaymentMethodId', '' );
            form.setValue( 'paymentMethodType', PaymentMethodTypeEnum.CASH );
        }
        form.setValue( 'mPosRequest', undefined );
        form.setValue( 'payOsRequest', undefined );
    }

    return (
        <Dialog open={ openCreate } onOpenChange={ setOpenCreate }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] rounded-3xl [&>button]:hidden">
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                    {
                        console.error( "Form validation errors:", errors );
                    } ) } noValidate>
                        <DialogHeader>
                            <DialogTitle>Chọn các phương thức thanh toán</DialogTitle>
                        </DialogHeader>
                        <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]">
                            <DataTable
                                columns={ columns }
                                isShort
                                data={ items }
                                totalItems={ total }
                                currentPage={ currentPage }
                                pageSize={ pageSize }
                                onPageChange={ setPage }
                                onPageSizeChange={ setPageSize }
                                isLoading={ isLoading }
                                sortValues={ [ sortValue ] }
                                onSortChange={ ( newSort ) =>
                                {
                                    setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
                                } }
                                rowSelection={
                                    items.reduce<Record<string, boolean>>( ( acc, item ) =>
                                    {
                                        acc[ item.id ] = form.watch( "systemPaymentMethodId" ) as string === item.id;
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        { ( form.watch( 'paymentMethodType' ) === PaymentMethodTypeEnum.QR_VIETQR ||
                            form.watch( 'paymentMethodType' ) === PaymentMethodTypeEnum.QR_EDC ||
                            form.watch( 'paymentMethodType' ) === PaymentMethodTypeEnum.CARD_EDC ) &&
                            <>
                                <FormField
                                    control={ form.control }
                                    name="mPosRequest.merchantId"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Merchant Id *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="Merchant Id"
                                                    { ...field }
                                                    type='number'
                                                    onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="mPosRequest.settings.secretKey"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Secret Key *</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="Secret Key"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="mPosRequest.settings.muid"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>MUID *</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="MUID"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="mPosRequest.settings.posId"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>POS ID *</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="POS ID"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </>
                        }

                        {
                            form.watch( 'paymentMethodType' ) === PaymentMethodTypeEnum.QR_PAYOS &&
                            <>
                                <FormField
                                    control={ form.control }
                                    name="payOsRequest.clientId"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Client ID *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="Client ID"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="payOsRequest.apiKey"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>API Key *</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="API Key"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="payOsRequest.checksumKey"
                                    render={ ( { field } ) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Checksum Key *</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={ addPaymentMethodMutation.isPending }
                                                    placeholder="Checksum Key"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </>
                        }
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={ () =>
                            {
                                resetParams();
                                form.reset();
                                setOpenCreate( false );
                            } }>Hủy</Button>
                            <Button type="submit" disabled={ addPaymentMethodMutation.isPending || form.watch( 'systemPaymentMethodId' ) === undefined || form.watch( 'systemPaymentMethodId' ) === '' }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default AddPaymentMethodDialog