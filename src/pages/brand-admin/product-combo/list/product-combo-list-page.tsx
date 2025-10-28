import { CirclePlusIcon } from "lucide-react";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import CustomButton from "@/components/button/custom-link-button";
import ProductComboTable from "./components/product-combo-table";

type Props = {};

const ProductComboListPage = ( _: Props ) =>
{
  return (
    <div>
      <div className="flex justify-between items-center  mb-6">
        <h1 className="text-3xl font-semibold">Danh sách combo sản phẩm</h1>
        <CustomButton
          linkUrl={ PATH_BRAND_DASHBOARD.combo.create }
          functionName="Tạo combo sản phẩm mới"
          icon={ CirclePlusIcon }
        />
      </div>
      <ProductComboTable />
    </div>
  );
};

export default ProductComboListPage;
