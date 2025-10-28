import { DataTable } from "@/components/table/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TBrandStore } from "@/schema/menu.schema"
import { columns } from "./store-table/column"

type Props = {
    campaignId: string;
    initialData: TBrandStore[]
}

const CampaignStoreTable = ( {
    initialData,
}: Props ) =>
{
    return (
        <Card className='border-none shadow-none bg-white gap-1 my-4'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Cửa hàng áp dụng chiến dịch
                </CardTitle>
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