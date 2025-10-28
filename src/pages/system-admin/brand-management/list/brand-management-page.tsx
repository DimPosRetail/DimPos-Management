import CustomButton from "@/components/button/custom-link-button";
import { CirclePlusIcon } from "lucide-react";
import BrandTable from "./components/brand-table";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";

const BrandManagementPage = () =>
{
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Quản lý Thương hiệu</h1>
        <CustomButton
          linkUrl={ PATH_ADMIN_DASHBOARD.brand.create }
          functionName="Tạo thương hiệu mới"
          icon={ CirclePlusIcon }
        />
      </div>
      <BrandTable />
    </div>
  );
};

export default BrandManagementPage;