import StoreTable from "./components/purchasable-product-table";
import { CirclePlusIcon } from "lucide-react";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";

type Props = {};

const PurchasableProduct = (_: Props) => {
  return (
    <div>
      <div className="flex justify-between items-center  mb-6">
        <h1 className="text-3xl font-semibold">Danh sách sản phẩm nhập hàng</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.purchasableProduct.create}
          functionName="Tạo sản phẩm nhập hàng mới"
          icon={CirclePlusIcon}
        />
      </div>
      <StoreTable />
    </div>
  );
};

export default PurchasableProduct;
