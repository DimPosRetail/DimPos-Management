import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import SelectInternalProductModal from "../create/list-purchasable-product/purchasable-product-table";
import InternalPOListTable from "./components/table";

const InternalPurchaseOrdersbyStorePage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Đơn đặt hàng nội bộ</h1>
        <SelectInternalProductModal>
          <Button className="px-12 py-6 rounded-xl text-base">
            <div className="flex justify-center items-center ">
              <CirclePlusIcon
                className="mr-2 bg-white rounded-full text-rambutant-100"
                fill="none"
              />
              Đặt hàng
            </div>
          </Button>
        </SelectInternalProductModal>
      </div>
      <InternalPOListTable />
    </div>
  );
};

export default InternalPurchaseOrdersbyStorePage;
