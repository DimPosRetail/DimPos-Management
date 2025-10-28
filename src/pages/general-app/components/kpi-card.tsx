import InventoryReportIcon from '@/assets/icons/inventory-report-icon'
import ShoppingBagIcon from '@/assets/icons/shopping-bag-icon'
import TotalOrderIcon from '@/assets/icons/total-order-icon'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '../../../lib/utils';
import type { TDashboardResponse } from '@/schema/dashboard.schema'
import type { TRole } from '@/schema/role.schema'
import ProductIcon from '@/assets/icons/product-icon'

type Props = {
    role: TRole;
    dashboardBrandData?: TDashboardResponse;
    dashboardStoreData?: TDashboardResponse;
    isDashboardBrandDataLoading: boolean;
    isDashboardStoreDataLoading: boolean;
}

const KPICard = ( {
    role,
    dashboardBrandData,
    dashboardStoreData,
    isDashboardBrandDataLoading,
    isDashboardStoreDataLoading,
}: Props ) =>
{
    const isLoading = isDashboardBrandDataLoading || isDashboardStoreDataLoading;

    // Skeleton Component for loading state
    const KPICardSkeleton = () => (
        <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 py-2 gap-1">
            <CardHeader className="pb-2">
                <Skeleton className="w-12 h-12 rounded-xl" />
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-full" />
                <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if ( isLoading )
    {
        return (
            <Card className="w-full shadow-none border-none bg-transparent mb-6">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-0">
                    <KPICardSkeleton />
                    <KPICardSkeleton />
                    <KPICardSkeleton />
                    <KPICardSkeleton />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-none border-none bg-transparent mb-6">
            {/* KPI Cards Grid */ }
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-0">
                {/* Daily Revenue Card */ }
                <Card className="bg-gradient-to-br from-white to-orange-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-10 hover:border-orange-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <InventoryReportIcon className="size-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalRevenue ?? 0 ) }
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            <span className='text-orange-600 text-base font-semibold'>Tổng doanh thu bán hàng </span>{ "(VND)" }
                        </div>
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Doanh thu trước giảm giá:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalSubTotalRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalSubTotalRevenue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-red-0 p-2 rounded-lg'>
                                <span className="text-gray-600">Tổng giảm giá bán hàng:</span>
                                <span className="font-semibold text-red-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalDiscountRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalDiscountRevenue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-green-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Doanh thu thực tế:</span>
                                <span className="font-semibold text-green-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalRevenue ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Orders Card */ }
                <Card className="bg-gradient-to-br from-white to-green-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <TotalOrderIcon className="size-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                            { role === "BrandAdmin" ? dashboardBrandData?.totalOrders ?? 0 : dashboardStoreData?.totalOrders ?? 0 }
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            <span className='text-green-600 text-base font-semibold'>Tổng số hóa đơn bán hàng </span>{ "(Hóa Đơn)" }
                        </div>
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Tại quán:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.totalDineInOrders ?? 0 ) : ( dashboardStoreData?.totalDineInOrders ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Mang đi:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.totalTakeAwayOrders ?? 0 ) : ( dashboardStoreData?.totalTakeAwayOrders ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-green-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Tổng hóa đơn:</span>
                                <span className="font-semibold text-green-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.totalOrders ?? 0 ) : ( dashboardStoreData?.totalOrders ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Order Value Card */ }
                <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <ShoppingBagIcon className="size-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageOrderValue ?? 0 ) }
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            <span className='text-blue-600 text-base font-semibold'>Bình quân hóa đơn </span>{ "(VND/Hóa Đơn)" }
                        </div>
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân hóa đơn tại quán:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageDineInOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageDineInOrderValue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-purple-0 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân hóa đơn mang đi:</span>
                                <span className="font-semibold text-purple-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageTakeAwayOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageTakeAwayOrderValue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân hóa đơn tổng:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageOrderValue ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Items Per Order Card */ }
                <Card className="bg-gradient-to-br from-white to-cyan-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-cyan-100 hover:border-cyan-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <ProductIcon className="size-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                            { role === "BrandAdmin" ? ( dashboardBrandData?.averageItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageItemsPerOrder ?? 0 ) }
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            <span className='text-cyan-600 text-base font-semibold'>Bình quân sản phẩm </span>{ "(Sản phẩm/Hóa Đơn)" }
                        </div>
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân sản phẩm tại quán:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.averageDineInItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageDineInItemsPerOrder ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-indigo-0 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân sản phẩm mang đi:</span>
                                <span className="font-semibold text-indigo-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.averageTakeAwayItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageTakeAwayItemsPerOrder ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-cyan-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân sản phẩm tổng:</span>
                                <span className="font-semibold text-cyan-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.averageItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageItemsPerOrder ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}

export default KPICard