import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInventory } from "@/hooks/use-inventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import UpdateQuantityInventoryDialog from "./update-quantity-inventory-dialog";

const OverviewInventoryTransaction = () =>
{
    const { id } = useParams<{ id: string }>();
    const { getInventoryStockById } = useInventory();
    const { data } = getInventoryStockById( id as string );
    const variant = data.data.data.reOrderLevel > 5 ? "destructive" : data.data.data.reOrderLevel > 2 ? "default" : "secondary";;
    return (
        <Card className="shadow-none border-none bg-white lg:col-span-2 xl:col-span-2">
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>Thông Tin Cơ Bản</CardTitle>
                <UpdateQuantityInventoryDialog
                    inventoryStockId={ id as string }
                >
                    <Button size="lg" className="ml-auto" type="button" disabled={ false }>
                        Chỉnh sửa số lượng thủ công
                        <Edit className="ml-2 h-4 w-4" />
                    </Button>
                </UpdateQuantityInventoryDialog>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Mã Thành Phần *</label>
                        <Input disabled placeholder="Mã Thành Phần" value={ data.data.data.ingredient.code } />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Mã SKU</label>
                        <Input disabled placeholder="Mã SKU" value={ data.data.data.ingredient.sku } />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Tên Thành Phần *</label>
                        <Input disabled placeholder="Tên Thành Phần" value={ data.data.data.ingredient.name } />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Đơn vị tính *</label>
                        <Input disabled placeholder="Đơn vị tính" value={ data.data.data.ingredient.measureUnit } />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Ngày tạo *</label>
                        <Input disabled placeholder="Ngày tạo" value={ format( data.data.data.createdDate as Date, "dd/MM/yyyy hh:mm aa", { locale: vi } ) } />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Cập nhật gần nhất *</label>
                        <Input disabled placeholder="Cập nhật gần nhất" value={ format( data.data.data.lastModifiedDate as Date, "dd/MM/yyyy hh:mm aa", { locale: vi } ) } />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Số lượng *</label>
                        <Input className="font-bold text-2xl text-red-100" disabled placeholder="Số lượng" value={ data.data.data.quantity } />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">Ngưỡng cảnh báo *</label>
                        <Badge variant={ variant } className="justify-center items-center text-base h-9 w-20">
                            { data.data.data.reOrderLevel }
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OverviewInventoryTransaction