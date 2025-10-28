import { useBrand } from "@/hooks/use-brand";
import AvatarCard from "./components/avatar-card";
import DetailCard from "./components/detail-card";
import { handleApiError } from "@/lib/error";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import type { TRole } from "@/schema/role.schema";

type Props = {}

const BrandPage = ( _: Props ) =>
{
  const { role } = useSelector( ( state: RootState ) => state.user );
  const { getBrandDetails } = useBrand();
  const { data, isLoading, error, isError } = getBrandDetails( role as TRole );

  if ( error && isError )
  {
    handleApiError( error );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Thương hiệu của tôi</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <AvatarCard pictureUrl={ data?.data.data.pictureUrl } isLoading={ isLoading } />
        <DetailCard initialData={ data?.data.data } isLoading={ isLoading } />
      </div>
      {/* <InvoiceCard /> */ }
    </div>
  );
};

export default BrandPage;