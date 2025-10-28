import { useParams } from "react-router-dom";
import { useCampaign } from "@/hooks/use-campaign";
import PromotionRuleTable from "./components/campaign-promotion-rule-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditCampaignForm from "./components/overview-campaign-form";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import type { TCampaignResponse } from "@/schema/campaign.schema";
import { handleApiError } from "@/lib/error";
import CampaignIcon from "@/assets/icons/campaign-icon";
import DiscountIcon from "@/assets/icons/discount-icon";
import StoreListIcon from "@/assets/icons/store-list-icon";
import CampaignStoreTable from "./components/campaign-store-table";

const CampaignEditPage = () =>
{
  const { id } = useParams<{ id: string }>();

  const { getCampaignById } = useCampaign();
  const {
    data: campaignData,
    error: campaignError,
    isError: isCampaignError,
    // isLoading: isCampaignLoading,
  } = getCampaignById( id as string );
  if ( campaignError && isCampaignError )
  {
    handleApiError( campaignError );
  }
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{ campaignData.data.data.name }</h1>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <div className="flex items-center gap-2 text-base">
              <CampaignIcon className="w-4 h-4" />
              Tổng quan
            </div>
          </TabsTrigger>
          <TabsTrigger value="promotionRulesOfCampaign">
            <div className="flex items-center gap-2 text-base">
              <DiscountIcon className="w-4 h-4" />
              Các khuyến mãi
            </div>
          </TabsTrigger>
          <TabsTrigger value="storesApplied">
            <div className="flex items-center gap-2 text-base">
              <StoreListIcon className="w-4 h-4" />
              Cửa hàng áp dụng
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <EditCampaignForm
            initialData={ campaignData?.data.data as TCampaignResponse }
          />
        </TabsContent>
        <TabsContent value="promotionRulesOfCampaign">
          <PromotionRuleTable
            campaignId={ id as string }
            initialData={
              ( campaignData?.data.data
                .promotionRules as TPromotionRuleResponse[] ) ?? []
            }
          />
        </TabsContent>
        <TabsContent value="storesApplied">
          <CampaignStoreTable
            campaignId={ id as string }
            initialData={
              campaignData?.data.data.stores ?? []
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignEditPage;
