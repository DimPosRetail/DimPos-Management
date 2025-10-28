import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useProduct } from '@/hooks/use-product';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { modifierColumns } from '../../components/column';

type ModifierGroupsDialogProps = {
    children: ReactNode;
    isOpen: boolean;
    onOpenChange: ( open: boolean ) => void;
    initialData?: { id: string, name: string }[];
    onSave: ( data: { id: string, name: string }[] ) => void;
    isSubmitting?: boolean;
}

const ModifierGroupsDialog = ( {
    children,
    isOpen,
    onOpenChange,
    initialData,
    onSave,
    isSubmitting = false,
}: ModifierGroupsDialogProps ) =>
{
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams();

    const { getModifierGroups } = useProduct();
    const { data, isLoading, isError, error } = getModifierGroups( {
        size: pageSize,
        page: currentPage,
        sortBy,
        isAsc,
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    };

    const form = useForm<{ modifierGroups: { id: string, name: string }[] }>( {
        defaultValues: {
            modifierGroups: initialData,
        },
    } );
    // useEffect( () =>
    // {
    //     if ( isOpen )
    //     {
    //         form.reset( { modifierGroups: initialData ?? [] } );
    //     }
    // }, [ isOpen, initialData, form ] );
    const handleFormSubmit = ( data: { modifierGroups: { id: string, name: string }[] } ) =>
    {
        onSave( data.modifierGroups );

        onOpenChange( false );
    }
    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const currentModifierGroupIds = ( form.getValues( "modifierGroups" ) as { id: string, name: string }[] ).map( group => group.id );

        const newlySelected = Object.entries( newSelection )
            .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        const newlyDeselected = Object.entries( oldSelection )
            .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        let updatedIds = [ ...currentModifierGroupIds ];

        newlySelected.forEach( id =>
        {
            if ( !updatedIds.includes( id ) )
            {
                updatedIds.push( id );
            }
        } );

        updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );
        form.setValue( "modifierGroups", updatedIds.map( id => ( { id, name: items.find( item => item.id === id )?.name || "" } ) ) );
    }
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{ initialData ? 'Chỉnh sửa' : 'Thêm' } tùy chọn sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chọn các tùy chọn sản phẩm trong danh sách này.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form id="add-modifier-groups-form" className="space-y-4 py-4">
                        <DataTable
                            columns={ modifierColumns }
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
                                    acc[ item.id ] = ( form.watch( "modifierGroups" ) as { id: string, name: string }[] ).map( group => group.id ).includes( item.id );
                                    return acc;
                                }, {} )
                            }
                            onRowSelectionChange={ handleRowSelectionChange }
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={ () => onOpenChange( false ) }>Hủy</Button>
                    <Button type="button" form="add-modifier-groups-form" disabled={ isSubmitting } onClick={ form.handleSubmit( handleFormSubmit ) }>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModifierGroupsDialog