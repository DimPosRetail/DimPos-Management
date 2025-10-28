import { useBrand } from "@/hooks/use-brand";
import { useParams } from "react-router-dom"
import AvatarCard from "./components/avatar-card";
import DetailCard from "./components/detail-card";

const EditBrandPage = () =>
{
    const { id } = useParams<{ id: string }>();

    const { getBrandById } = useBrand();

    const { data: brand } = getBrandById( id as string );

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">{ brand.data.data.name }</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <AvatarCard pictureUrl={ brand.data.data.pictureUrl } />
                <DetailCard initialData={ brand.data.data } />
            </div>
        </div>
    )
}

export default EditBrandPage