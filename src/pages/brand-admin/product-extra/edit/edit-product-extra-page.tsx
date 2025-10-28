import ExtraProductIcon from "@/assets/icons/extra-product-icon";
import RecipeIcon from "@/assets/icons/recipe-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExtraProduct } from "@/hooks/use-extra-product";
import { useParams } from "react-router-dom";
import OverviewSection from "./components/overview-section";
import RecipeSection from "./components/recipe-section";

const EditProductExtraPage = () =>
{
    const { id } = useParams<{ id: string }>();
    const { getExtraProductByIdQuery } = useExtraProduct();
    const { data } = getExtraProductByIdQuery( id as string );
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ data?.data.data.name }</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">
                        <div className="flex items-center gap-2 text-base">
                            <ExtraProductIcon className="w-4 h-4 mr-2" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="recipe">
                        <div className="flex items-center gap-2 text-base">
                            <RecipeIcon className="w-4 h-4 mr-2" />
                            Công thức
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewSection
                        initialData={ data?.data.data as any }
                    />
                </TabsContent>
                <TabsContent value="recipe">
                    <RecipeSection productVariantId={ id as string } />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditProductExtraPage