import CustomButton from "@/components/button/custom-link-button"
import { PATH_BRAND_DASHBOARD } from "@/routes/path"
import { CirclePlusIcon } from "lucide-react"
import ProductExtraTable from "./component/product-extra-table"

const ProductExtraPage = () =>
{
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Quản lý sản phẩm phụ</h1>
                <CustomButton
                    linkUrl={ PATH_BRAND_DASHBOARD.extra.create }
                    functionName="Tạo sản phẩm phụ mới"
                    icon={ CirclePlusIcon }
                />
            </div>
            <ProductExtraTable />
        </div>
    )
}

export default ProductExtraPage