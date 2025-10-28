import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/hooks/use-store";
import { useParams } from "react-router-dom";
import { columns } from "./components/column";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";

const DetailStoreMenuPage = () =>
{
    const { id } = useParams<{ id: string }>();
    const { getStoreMenuByMenuId } = useStore();
    const { data: storeMenu } = getStoreMenuByMenuId( id as string );
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ storeMenu.data.data.brandMenu.name }</h1>
            </div>
            <Card className="shadow-none border-none bg-white gap-0">
                <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                    <CardTitle>Danh sách sản phẩm trong thực đơn</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={ columns }
                        data={ storeMenu.data.data.storeMenuItems?.map( ( menuItem ) => menuItem.productVariant ) as TProductVariantResponse[] }
                        totalItems={ storeMenu.data.data.storeMenuItems?.length || 0 }
                        currentPage={ 1 }
                        pageSize={ 10 }
                        onPageChange={ () => { } }
                        onPageSizeChange={ () => { } }
                        isPagingProp={ false }
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default DetailStoreMenuPage