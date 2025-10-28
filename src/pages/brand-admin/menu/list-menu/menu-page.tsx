import { CirclePlusIcon } from "lucide-react";
import MenuTable from "./components/menu-table";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";

type Props = {};

const MenuPage = (_: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Quản lý thực đơn</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.product.createMenu}
          functionName="Tạo thực đơn mới"
          icon={CirclePlusIcon}
        />
      </div>

      <MenuTable />
    </div>
  );
};

export default MenuPage;
