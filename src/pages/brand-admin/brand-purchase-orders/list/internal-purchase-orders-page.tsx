
import InternalPOListTable from "./components/table";

const InternalPurchaseOrdersPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Đơn đặt hàng nội bộ</h1>
      </div>
      <InternalPOListTable />
    </div>
  );
};

export default InternalPurchaseOrdersPage;