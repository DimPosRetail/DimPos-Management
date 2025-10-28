import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type TProductVariantResponse } from "@/schema/product-variant.schema";
import { Eye } from "lucide-react";
import { useState, useTransition } from "react";
import { formatCurrency } from '../../../../../lib/utils';
import VariantProductDialog from "./variant-product-dialog";

type Props = {
    productId: string;
    initialData: TProductVariantResponse;
}

const VariantProductForm = ( { productId, initialData }: Props ) =>
{

    const [ productVariantId, setProductVariantId ] = useState<string | null>( null );

    const [ _, startTransition ] = useTransition();

    const onShowDetail = ( productVariantId: string ) =>
    {
        startTransition( () =>
        {
            setProductVariantId( productVariantId );
        } );
    };
    return (
        <div>
            <Card className="border border-dashed">
                <CardContent className="pt-1">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">Biến thể { initialData.code }</Badge>
                        <div className="flex justify-center items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger onClick={ () => onShowDetail( initialData.id ) }>
                                        <Eye className="h-4 w-4 hover:cursor-pointer" />
                                        <TooltipContent>
                                            <div className="text-base">Xem chi tiết</div>
                                        </TooltipContent>
                                    </TooltipTrigger>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                            <p className="text-sm font-medium text-foreground mb-2">Mã Biến Thể *</p>
                            <Input value={ initialData.code } disabled={ true } className="bg-background disabled:opacity-90" />
                        </div>
                        <div className="md:col-span-1">
                            <p className="text-sm font-medium text-foreground mb-2">Tên Biến Thể *</p>
                            <Input value={ initialData.name } disabled={ true } className="bg-background disabled:opacity-90" />
                        </div>
                        <div className="md:col-span-1">
                            <p className="text-sm font-medium text-foreground mb-2">Giá *</p>
                            <Input value={ formatCurrency( initialData.price ) } disabled={ true } className="bg-background disabled:opacity-90" />
                        </div>
                        <div className="md:col-span-1">
                            <p className="text-sm font-medium text-foreground mb-2">Kích Thước *</p>
                            <Input value={ initialData.size || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            {
                productVariantId &&
                <VariantProductDialog
                    productId={ productId }
                    productVariantId={ productVariantId }
                    isOpen={ !!productVariantId }
                    onOpenChange={ ( open ) =>
                    {
                        if ( !open )
                        {
                            setProductVariantId( null );
                        }
                    } }
                />
            }
        </div>
    )
}

export default VariantProductForm