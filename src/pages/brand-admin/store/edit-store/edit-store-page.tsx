import CoinIcon from "@/assets/icons/coin-icon";
import MenuIcon from "@/assets/icons/menu-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent, StoreIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import EditStoreForm from "./components/overview-store-page";
import StoreMenuSection from "./components/store-menu-section";
import StoreProductPriceSection from "./components/store-product-price-section";
import StoreTaxRateSection from "./components/store-tax-rate-section";

const EditStorePage = () =>
{
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Chi tiết cửa hàng</h1>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <div className="flex items-center gap-2 text-base">
              <StoreIcon className="w-4 h-4 mr-2" />
              Tổng quan
            </div>
          </TabsTrigger>
          <TabsTrigger value="menu">
            <div className="flex items-center gap-2 text-base">
              <MenuIcon className="w-4 h-4 mr-2" />
              Thực đơn tại cửa hàng
            </div>
          </TabsTrigger>
          <TabsTrigger value="price">
            <div className="flex items-center gap-2 text-base">
              <CoinIcon className="w-4 h-4 mr-2" />
              Quản lý giá
            </div>
          </TabsTrigger>
          <TabsTrigger value="taxRate">
            <div className="flex items-center gap-2 text-base">
              <Percent className="w-4 h-4 mr-2" />
              Cấu hình thuế
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <EditStoreForm />
        </TabsContent>
        <TabsContent value="menu">
          <StoreMenuSection
            storeId={ id as string }
          />
        </TabsContent>
        <TabsContent value="price">
          <StoreProductPriceSection
            storeId={ id as string }
          />
        </TabsContent>
        <TabsContent value="taxRate">
          {/* Placeholder for tax rate configuration */ }
          <StoreTaxRateSection storeId={ id as string } />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditStorePage;
