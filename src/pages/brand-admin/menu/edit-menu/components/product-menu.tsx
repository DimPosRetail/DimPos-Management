import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./product/column";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import { Button } from "@/components/ui/button";
import { CircleArrowOutUpRight } from "lucide-react";
import UpdateProductMenuDialog from "./update-product-menu-dialog";

type Props = {
    brandMenuId: string;
    productVariants: TProductVariantResponse[];
}


const ProductMenu = ( { brandMenuId, productVariants }: Props ) =>
{
    return (

        <Card className='border-none shadow-none bg-white gap-0 my-4'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Sản phẩm trong thực đơn
                </CardTitle>
                <UpdateProductMenuDialog
                    brandMenuId={ brandMenuId }
                    productVariantIds={ productVariants?.map( ( pv ) => pv.id ) || [] }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Chỉnh sửa sản phẩm trong thực đơn
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </UpdateProductMenuDialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={ columns }
                    data={ productVariants }
                    totalItems={ productVariants?.length || 0 }
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

export default ProductMenu