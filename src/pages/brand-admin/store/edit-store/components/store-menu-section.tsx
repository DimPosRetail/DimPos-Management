import { DataTable } from "@/components/table/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { columns } from "./columns";
import { useState, useTransition } from "react";
import DetailStoreMenuDialog from "./detail-store-menu-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    storeId: string;
}

const StoreMenuSection = ( {
    storeId,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams( {
        defaultSortBy: "createdDate",
    } );
    const { getStoreMenusById, updateStatusStoreMenuMutation } = useStore();
    const { data, isLoading, isError, error } = getStoreMenusById( storeId, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
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
    }

    const [ storeMenuId, setStoreMenuId ] = useState<string | null>( null );

    const [ _, startTransition ] = useTransition();

    const onShowDetail = ( storeMenuId: string ) =>
    {
        // Logic to show detail dialog
        console.log( "Show detail for store menu ID:", storeMenuId );
        startTransition( () =>
        {
            setStoreMenuId( storeMenuId );
        } );
    };

    const onChangeStatus = async ( storeMenuId: string, isActiveAtStore: boolean ) =>
    {
        try
        {
            await updateStatusStoreMenuMutation.mutateAsync( { storeId, storeMenuId, isActiveAtStore } );
            queryClient.invalidateQueries( { queryKey: [ "storeBrandMenus", storeId ] } );
            toast.success( "Cập nhật trạng thái thành công!" );
        }
        catch ( error )
        {
            handleApiError( error );
        }
    };

    return (
        <div>
            <DataTable
                columns={ columns( updateStatusStoreMenuMutation.isPending, onShowDetail, onChangeStatus ) }
                data={ items }
                totalItems={ total }
                currentPage={ currentPage }
                pageSize={ pageSize }
                isLoading={ isLoading }
                onPageChange={ setPage }
                onPageSizeChange={ setPageSize }
                sortValues={ [ sortValue ] }
                onSortChange={ ( newSort ) =>
                {
                    setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
                } }
            />
            {
                storeMenuId &&
                <DetailStoreMenuDialog
                    storeMenuId={ storeMenuId }
                    isOpen={ !!storeMenuId }
                    onOpenChange={ ( open ) =>
                    {
                        if ( !open )
                        {
                            setStoreMenuId( null );
                        }
                    } }
                />
            }
        </div>
    )
}

export default StoreMenuSection