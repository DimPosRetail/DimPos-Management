import CampaignIcon from "@/assets/icons/campaign-icon";
import DiscountIcon from "@/assets/icons/discount-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaign } from "@/hooks/use-campaign";
import { handleApiError } from "@/lib/error";
import type { TCampaignResponse } from "@/schema/campaign.schema";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import { useParams } from "react-router-dom";
import PromotionRuleTable from "./components/campaign-promotion-rule-table";
import OverviewCampaign from "./components/overview-campaign";

const DetailCampaignPromotion = () =>
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
                    {/* <TabsTrigger value="storesApplied">
                        <div className="flex items-center gap-2 text-base">
                            <StoreListIcon className="w-4 h-4" />
                            Cửa hàng áp dụng
                        </div>
                    </TabsTrigger> */}
                </TabsList>
                <TabsContent value="overview">
                    <OverviewCampaign
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
                {/* <TabsContent value="storesApplied">
                    <CampaignStoreTable
                        campaignId={ id as string }
                        initialData={
                            campaignData?.data.data.stores ?? []
                        }
                    />
                </TabsContent> */}
            </Tabs>
        </div>
    )
}

export default DetailCampaignPromotion