import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useMenu } from "@/hooks/use-menu";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { UpdateBrandStoreSchema, type TUpdateBrandStore } from "@/schema/menu.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { selectColumns } from "./store/column";

type Props = {
    brandMenuId: string;
    storeIds: string[];
    children: ReactNode;
}

const UpdateStoreMenuDialog = ( {
    brandMenuId,
    storeIds,
    children,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { getStoresByBrandMenuId, updateStoresByBrandMenuId } = useMenu();
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
    } = useQueryParams( {
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
    const [ open, setOpen ] = useState( false );
    const { data: storesData, isLoading: storesLoading, isError: isStoresError, error: storesError } =
        getStoresByBrandMenuId(
            brandMenuId,
            {
                size: pageSize,
                page: currentPage,
                sortBy: sortBy,
                isAsc: isAsc,
                name: filter.find( f => f.id === "name" )?.value as string || "",
                code: filter.find( f => f.id === "code" )?.value as string || "",
            }
        );
    if ( isStoresError && storesError )
    {
        handleApiError( storesError );
    }
    const items = storesData?.data.data.items || [];
    const total = storesData?.data.data.total || 0;
    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên cửa hàng" : f.id === "code" ? "Tìm kiếm theo mã cửa hàng" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }
    const form = useForm<TUpdateBrandStore>( {
        resolver: zodResolver( UpdateBrandStoreSchema ),
        defaultValues: {
            data: storeIds.map( ( storeId ) => ( { storeId } ) ),
        }
    } )


    useEffect( () =>
    {
        form.setValue( "data", storeIds.map( ( storeId ) => ( { storeId } ) ) );
    }, [ open, setOpen ] );
    const onSubmit = async ( data: TUpdateBrandStore ) =>
    {
        //console.log( "onSubmit data:", data );
        try
        {
            await updateStoresByBrandMenuId.mutateAsync( { id: brandMenuId, data } );
            queryClient.invalidateQueries( { queryKey: [ 'brandMenu', brandMenuId ] } );
            setOpen( false );
            toast.success( "Cập nhật sản phẩm trong thực đơn thành công!" );
        } catch ( error )
        {
            console.error( "Error updating store menu:", error );
            handleApiError( error );
        }
    }


    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const currentStoreIds = ( form.getValues( "data" ) as any[] ).map( ( item ) => item.storeId );

        // Tìm những row được selected và deselected
        const newlySelected = Object.entries( newSelection )
            .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        const newlyDeselected = Object.entries( oldSelection )
            .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        let updatedIds = [ ...currentStoreIds ];

        newlySelected.forEach( id =>
        {
            if ( !updatedIds.includes( id ) )
            {
                updatedIds.push( id );
            }
        } );

        updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

        form.setValue( "data", updatedIds.map( ( storeId ) => ( { storeId } ) ) );

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
                            <DialogTitle>Chỉnh sửa cửa hàng áp dụng thực đơn</DialogTitle>
                            <DialogDescription>
                                Chọn cửa hàng áp dụng cho thực đơn.
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
                                isLoading={ storesLoading }
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
                                        acc[ item.id ] = ( form.watch( "data" ) as any[] ).map( ( item ) => item.storeId ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="button" disabled={ updateStoresByBrandMenuId.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                                Cập nhật cửa hàng áp dụng
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateStoreMenuDialog