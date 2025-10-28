import { DataTable } from "@/components/table/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { UpdateStoreCampaignSchema, type TUpdateStoreCampaignRequest } from "@/schema/campaign.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { selectedColumns } from "./store-table/column";
import { Button } from "@/components/ui/button";
import { useCampaign } from "@/hooks/use-campaign";
import { toast } from "sonner";

type Props = {
    campaignId: string;
    storeIds: string[];
    children: ReactNode;
}

const UpdateStoreDialog = ( {
    campaignId,
    storeIds,
    children,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateStoreCampaignMutation } = useCampaign();
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
    const { getStores } = useStore();
    const { data, isLoading, isError, error } = getStores( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
        code: filter.find( f => f.id === "code" )?.value as string || "",
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên cửa hàng" : f.id === "code" ? "Tìm kiếm theo mã cửa hàng" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const form = useForm<TUpdateStoreCampaignRequest>( {
        resolver: zodResolver( UpdateStoreCampaignSchema ),
        defaultValues: {
            storeIds: storeIds,
        }
    } )

    useEffect( () =>
    {
        form.setValue( "storeIds", storeIds );
        resetParams();
    }, [ open, setOpen ] );

    const onSubmit = async ( data: TUpdateStoreCampaignRequest ) =>
    {
        try
        {
            await updateStoreCampaignMutation.mutateAsync( {
                id: campaignId,
                data
            } );
            queryClient.invalidateQueries( { queryKey: [ "campaign", campaignId ] } );
            setOpen( false );
            toast.success( "Cập nhật cửa hàng áp dụng chiến dịch thành công!" );
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
        const currentProductVariantIds = form.getValues( "storeIds" ) as string[];

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
        form.setValue( "storeIds", updatedIds );
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
                            <DialogTitle>Chỉnh sửa cửa hàng trong chiến dịch</DialogTitle>
                            <DialogDescription>
                                Chọn cửa hàng để thêm vào chiến dịch.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px]">
                            <DataTable
                                columns={ selectedColumns }
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
                                        acc[ item.id ] = ( form.watch( "storeIds" ) as string[] ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="button" disabled={ updateStoreCampaignMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                                Cập nhật chiến dịch
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateStoreDialog