import CustomButton from "@/components/button/custom-link-button";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { CirclePlusIcon } from "lucide-react";
import ModifierGroupTable from "./components/modifier-group-table";

const ModifierGroupPage = () =>
{
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">
          Quản lý nhóm tùy chọn sản phẩm
        </h1>
        {/* <Link to={ PATH_DASHBOARD.category.create }> */ }
        {/* <Button onClick={() => setOpen(true)}>
                    <CirclePlus className="mr-2 h-5 w-5" />
                    Tạo tùy chọn
                </Button> */}
        <CustomButton
          linkUrl={ PATH_BRAND_DASHBOARD.product.createModifier }
          functionName="Tạo tùy chọn mới"
          icon={ CirclePlusIcon }
        />
        {/* </Link> */ }
      </div>
      <ModifierGroupTable />
    </div>
  );
};

export default ModifierGroupPage;
