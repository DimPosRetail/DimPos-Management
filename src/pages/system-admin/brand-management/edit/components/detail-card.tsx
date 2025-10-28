import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { TBrand } from '@/schema/brand.schema'
import { Edit, LockKeyhole } from 'lucide-react'
import ChangePassWordDialog from './change-password-dialog'
import EditBrandDialog from './edit-brand-dialog'

type Props = {
    initialData: TBrand
}

const DetailCard = ( { initialData }: Props ) =>
{
    return (
        <Card className="lg:col-span-3 bg-white shadow-none border-none gap-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Thông tin cơ bản</CardTitle>
                </div>
                <div className='flex items-center gap-2'>
                    <ChangePassWordDialog
                        brandId={ initialData.id }
                    >
                        <Button variant="outline" >
                            <LockKeyhole className="mr-2 h-4 w-4" />
                            Đổi mật khẩu
                        </Button>
                    </ChangePassWordDialog>
                    <EditBrandDialog initialData={ initialData }>
                        <Button variant="default" >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                    </EditBrandDialog>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <p className="text-sm font-medium text-foreground mb-2">Tên thương hiệu</p>
                    <Input value={ initialData.name } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Email</p>
                    <Input value={ initialData.email } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Điện thoại</p>
                    <Input value={ initialData.phone } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Địa chỉ</p>
                    <Input value={ initialData.address } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
                <div className="md:col-span-1">
                    <p className="text-sm font-medium text-foreground mb-2">Mã Thương Hiệu</p>
                    <Input value={ initialData.code } disabled={ true } className="bg-background disabled:opacity-90" />
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailCard