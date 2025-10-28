import { DataTable } from "@/components/table/data-table";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import { useState } from "react";
import PromotionDetailDialog from "./promotion-detail-dialog";
import { createColumns } from "./promotion-rule-table/column";

type Props = {
    campaignId: string;
    initialData: TPromotionRuleResponse[]
}

const PromotionRuleTable = ( { initialData }: Props ) =>
{
    const [ selectedPromotion, setSelectedPromotion ] = useState<TPromotionRuleResponse | null>( null );
    const [ isDialogOpen, setIsDialogOpen ] = useState( false );

    const handleViewDetail = ( promotion: TPromotionRuleResponse ) =>
    {
        setSelectedPromotion( promotion );
        setIsDialogOpen( true );
    };

    const handleCloseDialog = () =>
    {
        setIsDialogOpen( false );
        setSelectedPromotion( null );
    };

    const columns = createColumns( { onViewDetail: handleViewDetail } );

    return (
        <>
            <DataTable
                columns={ columns }
                data={ initialData }
                totalItems={ initialData.length }
                currentPage={ 1 }
                pageSize={ 10 }
                onPageChange={ () => { } }
                onPageSizeChange={ () => { } }
                isPagingProp={ false }
            />

            { selectedPromotion && (
                <PromotionDetailDialog
                    promotionData={ selectedPromotion }
                    isOpen={ isDialogOpen }
                    onClose={ handleCloseDialog }
                />
            ) }
        </>
    );
};

export default PromotionRuleTable;