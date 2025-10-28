import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TBrandStore } from "@/schema/menu.schema"
import { CircleArrowOutUpRight } from "lucide-react"
import { columns } from "./store-table/column"
import UpdateStoreDialog from "./update-store-dialog"

type Props = {
    campaignId: string;
    initialData: TBrandStore[]
}

const CampaignStoreTable = ( {
    campaignId,
    initialData,
}: Props ) =>
{
    return (
        <Card className='border-none shadow-none bg-white gap-1 my-4'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Cửa hàng áp dụng chiến dịch
                </CardTitle>
                <UpdateStoreDialog
                    campaignId={ campaignId }
                    storeIds={ initialData.map( ( store ) => store.id ) }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Chỉnh sửa
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </UpdateStoreDialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={ columns }
                    data={ initialData }
                    totalItems={ initialData.length }
                    currentPage={ 1 }
                    pageSize={ 10 }
                    onPageChange={ () => { } }
                    onPageSizeChange={ () => { } }
                    isPagingProp={ false }
                />
            </CardContent>
        </Card>
    )
}

export default CampaignStoreTable