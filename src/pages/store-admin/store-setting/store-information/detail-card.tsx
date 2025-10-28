import { useStore } from "@/hooks/use-store";
import DetailCardView from "./components/detail-card-view";

const DetailCard = () => {
  const { getStoreDetail } = useStore();
  const { data: response } = getStoreDetail();

  if (!response?.data?.data) return null;

  return <DetailCardView initialData={response.data.data} />;
};

export default DetailCard;
