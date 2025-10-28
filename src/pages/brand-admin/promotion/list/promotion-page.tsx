import { CirclePlusIcon } from "lucide-react";
import PromotionTable from "./components/promotion-table";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";

type Props = {};

const PromotionPage = (_: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quản lý khuyến mãi</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.promotion.create}
          functionName="Tạo khuyến mãi mới"
          icon={CirclePlusIcon}
        />
      </div>

      <PromotionTable />
    </div>
  );
};

export default PromotionPage;
