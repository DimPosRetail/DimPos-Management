import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProduct } from '@/hooks/use-product';
import { useParams } from 'react-router-dom';
import ModifierGroupForm from './components/modifier-group-form';
import OverviewProductForm from './components/overview-product-form';
import VariantsProductSection from './components/variants-product-section';
import ProductIcon from '@/assets/icons/product-icon';
import ProductVariantIcon from '@/assets/icons/product-variant-icon';
import DocumentFilterIcon from '@/assets/icons/document-filter-icon';
import RecipeIcon from '@/assets/icons/recipe-icon';
import RecipeSection from './components/recipe-section';
import ExtraProductIcon from '@/assets/icons/extra-product-icon';
import ExtraProductSection from './components/extra-product-section';

const EditProductPage = () =>
{
    const { id } = useParams();
    const { getProductById } = useProduct();
    const { data } = getProductById( id as string );
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ data?.data.data.name }</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">
                        <div className="flex items-center gap-2 text-base">
                            <ProductIcon className="w-4 h-4 mr-2" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    { data?.data.data.isHasVariants && (
                        <TabsTrigger value="variants">
                            <div className="flex items-center gap-2 text-base">
                                <ProductVariantIcon className="w-4 h-4 mr-2" />
                                Biến thể
                            </div>
                        </TabsTrigger>
                    ) }
                    <TabsTrigger value="modifierGroups">
                        <div className="flex items-center gap-2 text-base">
                            <DocumentFilterIcon className="w-4 h-4 mr-2" />
                            Tùy chọn
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="extraProduct">
                        <div className="flex items-center gap-2 text-base">
                            <ExtraProductIcon className="w-4 h-4 mr-2" />
                            Sản phẩm phụ
                        </div>
                    </TabsTrigger>
                    { !data?.data.data.isHasVariants &&
                        <TabsTrigger value="recipe">
                            <div className="flex items-center gap-2 text-base">
                                <RecipeIcon className="w-4 h-4 mr-2" />
                                Công thức
                            </div>
                        </TabsTrigger>
                    }
                </TabsList>
                <TabsContent value="overview">
                    <OverviewProductForm
                        initialData={ data?.data.data as any }
                    />
                </TabsContent>
                <TabsContent value="variants">
                    <VariantsProductSection
                        isProductActive={ data?.data.data.isActive || false }
                        productId={ id as string }
                        initialData={ data?.data.data.productVariants as any || [] }
                    />
                </TabsContent>
                <TabsContent value="modifierGroups">
                    <ModifierGroupForm
                        productId={ id as string }
                        initialData={ data?.data.data.modifierGroup as any || [] }
                    />
                </TabsContent>
                <TabsContent value="extraProduct">
                    <ExtraProductSection
                        productId={ id as string }
                        extraProducts={ data?.data.data.productExtras || [] }
                    />
                </TabsContent>
                { !data?.data.data.isHasVariants &&
                    <TabsContent value="recipe">
                        <RecipeSection productVariantId={ data.data.data.productVariants![ 0 ].id as string } />
                    </TabsContent>
                }
            </Tabs>
        </div>
    )
}

export default EditProductPage