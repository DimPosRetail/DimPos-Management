import { DataTable } from "@/components/table/data-table";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import { columns } from "./promotion-rule-table/column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowOutUpRight } from "lucide-react";
import UpdatePromotionRuleDialog from "./update-promotion-rule-dialog";


type Props = {
  campaignId: string;
  initialData: TPromotionRuleResponse[]
}

const PromotionRuleTable = ( { campaignId, initialData }: Props ) =>
{

  return (
    <Card className='border-none shadow-none bg-white gap-1 my-4'>
      <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
        <CardTitle>
          Khuyến mãi trong chiến dịch
        </CardTitle>
        <UpdatePromotionRuleDialog
          campaignId={ campaignId }
          promotionRuleIds={ initialData.map( ( rule ) => rule.id ) }
        >
          <Button variant="outline" size="sm" className="ml-auto" type="button">
            Chỉnh sửa
            <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
          </Button>
        </UpdatePromotionRuleDialog>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default PromotionRuleTable;
