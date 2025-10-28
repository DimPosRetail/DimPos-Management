import { DataTable } from "@/components/table/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { usePromotion } from "@/hooks/use-promotion";
import { useQueryParams } from "@/hooks/use-query-params";
import { UpdatePromotionCampaignSchema, type TUpdatePromotionCampaignRequest } from "@/schema/campaign.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { selectedColumns } from "./promotion-rule-table/column";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useCampaign } from "@/hooks/use-campaign";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error";

type Props = {
    campaignId: string;
    promotionRuleIds: string[];
    children: ReactNode;
}

const UpdatePromotionRuleDialog = ( {
    campaignId,
    promotionRuleIds,
    children,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updatePromotionCampaignMutation } = useCampaign();
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
        ],
    } );

    const [ open, setOpen ] = useState( false );
    const { getPromotions } = usePromotion();
    const { data, isLoading, isError, error } = getPromotions( {
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

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên khuyến mãi" : "",
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }

    const form = useForm<TUpdatePromotionCampaignRequest>( {
        resolver: zodResolver( UpdatePromotionCampaignSchema ),
        defaultValues: {
            promotionRuleIds: promotionRuleIds,
        }
    } )

    useEffect( () =>
    {
        form.setValue( "promotionRuleIds", promotionRuleIds );
        resetParams();
    }, [ open, setOpen ] );

    const onSubmit = async ( data: TUpdatePromotionCampaignRequest ) =>
    {
        try
        {
            await updatePromotionCampaignMutation.mutateAsync( {
                id: campaignId,
                data
            } );
            queryClient.invalidateQueries( { queryKey: [ "campaign", campaignId ] } );
            setOpen( false );
            toast.success( "Cập nhật khuyến mãi trong chiến dịch thành công!" );
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
        const currentProductVariantIds = form.getValues( "promotionRuleIds" ) as string[];

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
        form.setValue( "promotionRuleIds", updatedIds );
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
                            <DialogTitle>Chỉnh sửa khuyến mãi trong chiến dịch</DialogTitle>
                            <DialogDescription>
                                Chọn khuyến mãi để thêm vào chiến dịch.
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
                                        acc[ item.id ] = ( form.watch( "promotionRuleIds" ) as string[] ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="button" disabled={ updatePromotionCampaignMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                                Cập nhật chiến dịch
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePromotionRuleDialog