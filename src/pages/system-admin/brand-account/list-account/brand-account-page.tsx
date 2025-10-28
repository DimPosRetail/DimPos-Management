import { Button } from "@/components/ui/button";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

const BrandAccountPage = () =>
{

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Quản lý tài khoản thương hiệu</h1>
                <Link to={ PATH_BRAND_DASHBOARD.category.create }>
                    <Button>
                        <CirclePlus className="mr-2 h-5 w-5" />
                        Tạo tài khoản
                    </Button>
                </Link>
            </div>
            {/* <CategoryTable /> */}
        </div>
    );
};

export default BrandAccountPage;
