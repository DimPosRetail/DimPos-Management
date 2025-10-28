import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useProductVariant } from "@/hooks/use-product-variant";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { storePriceHistoryColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";

type Props = {
    open: boolean;
    setOpen: ( open: boolean ) => void;
    productVariantId: string;
    storeId: string;
}

const StorePriceHistoryDialog = ( {
    productVariantId,
    storeId,
    open,
    setOpen
}: Props ) =>
{
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setPage,
        setPageSize,
    } = useQueryParams( {
        defaultSortBy: 'changedAt',
        defaultIsAsc: false,
    } );

    const { getStorePriceHistory } = useProductVariant();
    const { data, isLoading, isError, error } = getStorePriceHistory( productVariantId, storeId, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    // const sortValue = {
    //     id: sortBy,
    //     desc: !isAsc,
    // };
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] overflow-x-scroll">
                <DialogHeader>
                    Lịch sử thay đổi giá sản phẩm
                </DialogHeader>
                <DataTable
                    columns={ storePriceHistoryColumns }
                    data={ items }
                    totalItems={ total }
                    currentPage={ currentPage }
                    pageSize={ pageSize }
                    onPageChange={ setPage }
                    onPageSizeChange={ setPageSize }
                    isLoading={ isLoading }
                />
            </DialogContent>
        </Dialog>
    )
}

export default StorePriceHistoryDialog