import { CirclePlusIcon } from "lucide-react"
import IngredientTable from "./components/ingredient-table"
import { PATH_BRAND_DASHBOARD } from "@/routes/path"
import CustomButton from "@/components/button/custom-link-button"

const IngredientPage = () =>
{
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quản lý thành phần</h1>
        <CustomButton
          linkUrl={PATH_BRAND_DASHBOARD.ingredient.create }
          functionName="Tạo thành phần mới"
          icon={CirclePlusIcon}
        />
      </div>
      <IngredientTable />
    </div>
  )
}

export default IngredientPage