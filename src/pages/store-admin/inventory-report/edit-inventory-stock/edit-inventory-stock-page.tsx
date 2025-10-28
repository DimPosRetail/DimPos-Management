import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InventoryTransactionTable from "./components/inventory-transaction-table"
import ProductIcon from "@/assets/icons/product-icon"
import DocumentFilterIcon from "@/assets/icons/document-filter-icon"
import OverviewInventoryTransaction from "./components/overview-inventory-transaction"

const EditInventoryStockPage = () =>
{
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Chi tiết nguyên liệu tồn kho</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">
                        <div className="flex items-center gap-2 text-base">
                            <ProductIcon className="w-4 h-4 mr-2" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <div className="flex items-center gap-2 text-base">
                            <DocumentFilterIcon className="w-4 h-4 mr-2" />
                            Lịch sử giao dịch
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewInventoryTransaction />
                </TabsContent>
                <TabsContent value="history">
                    <InventoryTransactionTable />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditInventoryStockPage