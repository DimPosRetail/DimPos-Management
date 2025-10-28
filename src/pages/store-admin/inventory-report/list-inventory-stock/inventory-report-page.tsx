import { Button } from "@/components/ui/button"
import InventoryStockTable from "./components/inventory-stock-table"
import { DownloadCloudIcon } from "lucide-react"
import { useInventory } from "@/hooks/use-inventory"
import { handleApiError } from "@/lib/error"

const InventoryReportPage = () =>
{
    const { exportStockReportMutation } = useInventory();
    const handleExportReport = async () =>
    {
        try
        {
            const response = await exportStockReportMutation.mutateAsync();
            const url = response.data.data;
            window.open( url, '_blank' );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Báo cáo tồn kho</h1>
                <Button className="px-12 py-6 rounded-xl text-base" onClick={ handleExportReport } disabled={ exportStockReportMutation.isPending }>
                    <div className="flex justify-center items-center ">
                        <DownloadCloudIcon
                            className="mr-3 bg-primary text-white size-5"
                            fill="none"
                        />
                        Xuất báo cáo
                    </div>
                </Button>
            </div>
            <InventoryStockTable />
        </div>
    )
}

export default InventoryReportPage