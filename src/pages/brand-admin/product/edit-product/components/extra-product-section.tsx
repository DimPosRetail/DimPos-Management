import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleArrowOutUpRight } from "lucide-react";
import UpdateExtraItemsDialog from "./update-extra-items-dialog";
import type { TProductExtra } from "@/schema/product-extra.schema";
import { extraProductColumns } from "./column";
import { DataTable } from "@/components/table/data-table";

type Props = {
    productId: string;
    extraProducts: TProductExtra[];
}

const ExtraProductSection = ( {
    productId,
    extraProducts
}: Props ) =>
{
    return (
        <Card className='shadow-none border-none bg-white gap-1'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Danh sách các sản phẩm phụ
                </CardTitle>
                <UpdateExtraItemsDialog
                    productId={ productId }
                    existingExtraItemIds={ extraProducts.map( ( extra ) => extra.id ) }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Chỉnh sửa
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </UpdateExtraItemsDialog>
                {/* </AddRecipeItemDialog> */ }
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={ extraProductColumns }
                    data={ extraProducts }
                    totalItems={ extraProducts?.length || 0 }
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

export default ExtraProductSection