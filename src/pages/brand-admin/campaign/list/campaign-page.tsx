import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CampaignTable from "./components/campaign-table";
import CustomButton from "@/components/button/custom-link-button";
import { CirclePlusIcon } from "lucide-react";

const CampaignPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Quản lý chiến dịch</h1>
        {/* <Link to={ PATH_BRAND_DASHBOARD.campaign.createCampaign }>
                    <Button>
                        <CirclePlus className="mr-2 h-5 w-5" />
                        Tạo chiến dịch
                    </Button>
                </Link> */}
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.campaign.createCampaign}
          functionName="Tạo chiến dịch mới"
          icon={CirclePlusIcon}
        />
      </div>
      <CampaignTable />
    </div>
  );
};

export default CampaignPage;
