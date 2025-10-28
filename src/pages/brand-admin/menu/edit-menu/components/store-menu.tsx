import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TBrandStore } from "@/schema/menu.schema";
import { columns } from "./store/column";
import UpdateStoreMenuDialog from "./update-store-menu-dialog";
import { CircleArrowOutUpRight } from "lucide-react";

type Props = {
    brandMenuId: string;
    stores: TBrandStore[];
}

const StoreMenu = ( { brandMenuId, stores }: Props ) =>
{
    return (
        <Card className='border-none shadow-none bg-white gap-0 my-4'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Danh sách cửa hàng áp dụng
                </CardTitle>
                <UpdateStoreMenuDialog
                    brandMenuId={ brandMenuId }
                    storeIds={ stores?.map( ( store ) => store.id ) || [] }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Chỉnh sửa cửa hàng áp dụng
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </UpdateStoreMenuDialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={ columns }
                    data={ stores }
                    totalItems={ stores.length }
                    currentPage={ 1 }
                    pageSize={ 10 }
                    onPageChange={ () => { } }
                    onPageSizeChange={ () => { } }
                    isLoading={ false }
                    isPagingProp={ false }
                />
            </CardContent>
        </Card>
    )
}

export default StoreMenu