import { useParams } from "react-router-dom";
import DetailSystemPaymentMethod from "./components/column";
import { useSystemPaymentMethod } from "@/hooks/use-payment-method-config";

const DetailSystemPaymentMethodPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getSystemPaymentMethodById } = useSystemPaymentMethod();

  const { data } = getSystemPaymentMethodById(id ?? "");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Chi tiết phương thức thanh toán</h1>
      </div>

      <DetailSystemPaymentMethod paymentMethod={data.data.data} />
    </div>
  );
};

export default DetailSystemPaymentMethodPage;
