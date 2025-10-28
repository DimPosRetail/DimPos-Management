import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu } from "@/hooks/use-menu";
import { handleApiError } from "@/lib/error";
import { TabsContent } from "@radix-ui/react-tabs";
import { PackageSearch, Store, Target } from "lucide-react";
import { useParams } from "react-router-dom";
import OverviewMenu from "./components/overview-menu";
import ProductMenu from "./components/product-menu";
import { useQueryParams } from "@/hooks/use-query-params";
import StoreMenu from "./components/store-menu";

const EditMenuPage = () =>
{
    const { id } = useParams();
    const { getBrandMenuById } = useMenu();
    const { resetParams } = useQueryParams();
    const { data: menuData, isError: isMenuError, error: menuError } = getBrandMenuById( id as string );
    if ( isMenuError && menuError )
    {
        handleApiError( menuError );
    }
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ menuData?.data.data.name }</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview" onClick={ () => resetParams() }>
                        <div className="flex items-center gap-2 text-base">
                            <Target className="w-4 h-4" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="product" onClick={ () => resetParams() }>
                        <div className="flex items-center gap-2 text-base">
                            <PackageSearch className="w-4 h-4" />
                            Danh sách sản phẩm
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="store" onClick={ () => resetParams() }>
                        <div className="flex items-center gap-2 text-base">
                            <Store className="w-4 h-4" />
                            Cửa hàng áp dụng
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewMenu
                        initialData={ menuData?.data.data }
                    />
                </TabsContent>
                <TabsContent value="product">
                    <ProductMenu
                        brandMenuId={ id as string }
                        productVariants={ menuData?.data.data.productVariants || [] }
                    />
                </TabsContent>
                <TabsContent value="store">
                    <StoreMenu
                        brandMenuId={ id as string }
                        stores={ menuData?.data.data.stores || [] }
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditMenuPage