import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { CirclePlusIcon } from "lucide-react";
import CategoryTable from "./components/category-table";
import CustomButton from "@/components/button/custom-link-button";

const CategoryPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Quản lý danh mục</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.category.create}
          functionName="Tạo danh mục mới"
          icon={CirclePlusIcon}
        />
      </div>
      <CategoryTable />
    </div>
  );
};

export default CategoryPage;
