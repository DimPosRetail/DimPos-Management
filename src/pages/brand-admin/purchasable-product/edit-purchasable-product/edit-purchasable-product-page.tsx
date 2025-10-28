import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternalProduct } from "@/hooks/use-internal-product";
import { handleApiError } from "@/lib/error";
import { useParams } from "react-router-dom";
import OverviewPurchasableProductPage from "./components/overview-purchasable-page";
import RecipeSection from "./components/recipe-section";

const EditPurchasableProductPage = () => {
  const { id } = useParams();
  const { getInternalProductById } = useInternalProduct();
  const {
    data: internalProductData,
    error: internalProductError,
    isError: isInternalProductError,
    // isLoading: isInternalProductLoading,
  } = getInternalProductById(id as string);
  // if (isInternalProductLoading) {
  //   return <div>Loading...</div>;
  // }
  if (internalProductError && isInternalProductError) {
    handleApiError(internalProductError);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Thông tin sản phẩm nhập hàng</h1>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="recipe">Công thức</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewPurchasableProductPage
            internalProduct={internalProductData.data.data}
          />
        </TabsContent>
        <TabsContent value="recipe">
          <RecipeSection productVariantId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditPurchasableProductPage;
