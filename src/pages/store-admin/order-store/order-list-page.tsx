import { Suspense } from "react";
import OrderTable from "./list-order-store/order-table";

const OrderListPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h1>
      <Suspense fallback={<div>Đang tải đơn hàng...</div>}>
        <OrderTable />
      </Suspense>
    </div>
  );
};


export default OrderListPage;
