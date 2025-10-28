import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { TBrand } from '@/schema/brand.schema'
import { Edit } from 'lucide-react'
import EditBrandDialog from './edit-brand-dialog'

type Props = {
    initialData?: TBrand;
    isLoading: boolean;
}

const DetailCard = ( { initialData, isLoading }: Props ) =>
{
    if ( isLoading )
    {
        return (
            <Card className="lg:col-span-3 bg-white shadow-none border-none gap-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Thông tin cơ bản</CardTitle>
                    </div>
                    <Skeleton className="h-10 w-24" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-foreground mb-2">Tên thương hiệu</p>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-sm font-medium text-foreground mb-2">Email</p>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-sm font-medium text-foreground mb-2">Điện thoại</p>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-sm font-medium text-foreground mb-2">Địa chỉ</p>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-sm font-medium text-foreground mb-2">Mã Thương Hiệu</p>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-3 bg-white shadow-none border-none gap-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Thông tin cơ bản</CardTitle>
                </div>
                <EditBrandDialog initialData={ initialData }>
                    <Button variant="default" >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                </EditBrandDialog>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <p className="text-sm font-medium text-foreground mb-2">Tên thương hiệu</p>
                    <Input value={ initialData?.name || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Email</p>
                    <Input value={ initialData?.email || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Điện thoại</p>
                    <Input value={ initialData?.phone || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Địa chỉ</p>
                    <Input value={ initialData?.address || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Mã Thương Hiệu</p>
                    <Input value={ initialData?.code || "N/A" } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailCard