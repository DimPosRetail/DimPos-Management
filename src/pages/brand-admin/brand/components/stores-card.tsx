import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoreTable from "@/pages/brand-admin/store/list-stores/components/store-table";

type Props = {}

const StoresCard = ( _: Props ) =>
{

    return (
        <Card className="bg-white shadow-none border-none gap-3">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Danh sách cửa hàng
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StoreTable />
            </CardContent>
        </Card>
    )
}

export default StoresCard