import ProductTable from "./components/product-table";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { CirclePlusIcon } from "lucide-react";
import CustomButton from "@/components/button/custom-link-button";

const ProductPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quản lý sản phẩm</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.product.createProduct }
          functionName="Tạo sản phẩm mới"
          icon={CirclePlusIcon}
        />
      </div>
      <ProductTable />
    </div>
  );
};

export default ProductPage;
