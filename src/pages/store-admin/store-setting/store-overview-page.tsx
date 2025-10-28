import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsCard from "./accounts";
import DetailCard from "./store-information";
import PaymentMethodConfigCard from './payment-method-config/payment-method-card';
import FinancialShiftConfigCard from './financial-shift-config/financial-shift-config-card';

import UsersIcon from '@/assets/icons/users-icon';
import ShopIcon from '@/assets/icons/shop-icon';
import CreditCardIcon from '@/assets/icons/credit-card-icon';
import NoteIcon from '@/assets/icons/note-icon';

const StoreOverviewPage = () =>
{
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Cấu hình chung</h1>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">
            <ShopIcon className="w-4 h-4 mr-2" />
            Thông tin cửa hàng
          </TabsTrigger>

          <TabsTrigger value="accounts">
            <UsersIcon className="w-4 h-4 mr-2" />
            Tài khoản
          </TabsTrigger>

          <TabsTrigger value="payment">
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Phương thức thanh toán
          </TabsTrigger>

          <TabsTrigger value="shift">
            <NoteIcon className="w-4 h-4 mr-2" />
            Cấu hình ca tài chính
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <DetailCard />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountsCard />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodConfigCard />
        </TabsContent>

        <TabsContent value="shift">
          <FinancialShiftConfigCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreOverviewPage;
