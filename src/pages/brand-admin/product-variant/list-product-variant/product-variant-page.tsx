import ProductVariantTable from "./components/product-variant-table";

const ProductPage = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Quản lý biến thể sản phẩm</h1>
      </div>
      <ProductVariantTable />
    </div>
  );
};

export default ProductPage;
