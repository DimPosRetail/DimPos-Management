import ProductComboIcon from "@/assets/icons/product-combo-icon";
import ProductVariantIcon from "@/assets/icons/product-variant-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useComboProduct } from "@/hooks/use-combo-product";
import { useParams } from "react-router-dom";
import OverviewSection from "./components/overview-section";
import ProductSection from "./components/product-section";

const EditComboProductPage = () =>
{
    const { id } = useParams<{ id: string }>();
    const { getComboProductByIdQuery } = useComboProduct();
    const { data } = getComboProductByIdQuery( id as string );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ data?.data.data.name }</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">
                        <div className="flex items-center gap-2 text-base">
                            <ProductComboIcon className="w-4 h-4 mr-2" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="products">
                        <div className="flex items-center gap-2 text-base">
                            <ProductVariantIcon className="w-4 h-4 mr-2" />
                            Các sản phẩm
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewSection
                        initialData={ data?.data.data as any }
                    />
                </TabsContent>
                <TabsContent value="products">
                    <ProductSection
                        initialData={ data?.data.data.comboProductItems as any || [] }
                        comboProductId={ id as string }
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditComboProductPage