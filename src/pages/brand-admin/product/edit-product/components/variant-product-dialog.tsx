import ProductVariantIcon from "@/assets/icons/product-variant-icon";
import RecipeIcon from "@/assets/icons/recipe-icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductVariant } from "@/hooks/use-product-variant";
import RecipeSection from "./recipe-section";
import OverviewProductVariant from "./overview-product-variant";
import { History } from "lucide-react";
import HistorySection from "./history-section";

type Props = {
    productId: string;
    productVariantId: string;
    isOpen: boolean;
    onOpenChange: ( isOpen: boolean ) => void;
}

const VariantProductDialog = ( {
    productId,
    productVariantId,
    isOpen,
    onOpenChange,
}: Props ) =>
{
    const { getProductVariantById } = useProductVariant();
    const { data: productVariantData } = getProductVariantById( productVariantId );
    return (
        <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] overflow-x-scroll">
                <Tabs defaultValue="overview" className="mb-6">
                    <TabsList>
                        <TabsTrigger value="overview">
                            <div className="flex items-center gap-2 text-base">
                                <ProductVariantIcon className="w-4 h-4 mr-2" />
                                Tổng quan
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="recipe">
                            <div className="flex items-center gap-2 text-base">
                                <RecipeIcon className="w-4 h-4 mr-2" />
                                Công thức
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            <div className="flex items-center gap-2 text-base">
                                <History className="w-4 h-4 mr-2" />
                                Lịch sử thay đổi giá
                            </div>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <OverviewProductVariant
                            productId={ productId }
                            productVariantId={ productVariantId }
                            initialData={ productVariantData?.data.data as any }
                        />
                    </TabsContent>
                    <TabsContent value="recipe">
                        <RecipeSection productVariantId={ productVariantId } />
                    </TabsContent>
                    <TabsContent value="history">
                        <HistorySection productVariantId={ productVariantId } />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default VariantProductDialog