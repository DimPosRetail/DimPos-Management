// import { Button } from "@/components/ui/button";
// import { PATH_BRAND_DASHBOARD } from "@/routes/path";
// import { CirclePlus } from "lucide-react";
// import { Link } from "react-router-dom";
import OrderTable from "./components/order-table";

const OrderPage = () =>
{

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Quản lý đơn hàng</h1>
            </div>
            <OrderTable />
        </div>
    );
};

export default OrderPage;
