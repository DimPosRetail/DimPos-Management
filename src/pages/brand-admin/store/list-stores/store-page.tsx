import StoreTable from "./components/store-table";
import { CirclePlusIcon } from "lucide-react";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";

type Props = {};

const StorePage = (_: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center  mb-6">
        <h1 className="text-3xl font-semibold">Danh sách cửa hàng</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.store.create}
          functionName="Tạo cửa hàng mới"
          icon={CirclePlusIcon}
        />
      </div>
      <StoreTable />
    </div>
  );
};

export default StorePage;
