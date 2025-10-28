import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TDashboardResponse } from '@/schema/dashboard.schema'
import type { TRole } from '@/schema/role.schema'
import { Hamburger, StoreIcon } from 'lucide-react'
import { formatPrice } from '../../../lib/utils'

type Props = {
    role: TRole;
    dashboardBrandData?: TDashboardResponse;
    dashboardStoreData?: TDashboardResponse;
    isDashboardBrandDataLoading: boolean;
    isDashboardStoreDataLoading: boolean;
}

const ServiceMethodCard = ( {
    role,
    dashboardBrandData,
    dashboardStoreData,
    isDashboardBrandDataLoading,
    isDashboardStoreDataLoading,
}: Props ) =>
{
    const isLoading = isDashboardBrandDataLoading || isDashboardStoreDataLoading;

    // Skeleton Component for loading state
    const ServiceMethodCardSkeleton = () => (
        <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 py-4 gap-1">
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
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
                    <ServiceMethodCardSkeleton />
                    <ServiceMethodCardSkeleton />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-none border-none bg-transparent mb-6">
            {/* KPI Cards Grid */ }
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
                {/* Average Order Value Card */ }
                <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-10 hover:border-purple-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <StoreIcon className="size-10 text-white" />
                            </div>
                            <div className='mt-2 text-base font-semibold text-purple-700'>
                                Tại quán
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Doanh thu:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalDineInRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalDineInRevenue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-purple-0 p-2 rounded-lg'>
                                <span className="text-gray-600">Tổng hóa đơn:</span>
                                <span className="font-semibold text-purple-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.totalDineInOrders ?? 0 ) : ( dashboardStoreData?.totalDineInOrders ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân hóa đơn:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageDineInOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageDineInOrderValue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân sản phẩm:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.averageDineInItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageDineInItemsPerOrder ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Items Per Order Card */ }
                <Card className="bg-gradient-to-br from-white to-amber-50/30 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 py-4 group gap-1">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Hamburger className="size-10 text-white" />
                            </div>
                            <div className='mt-2 text-base font-semibold text-amber-700'>
                                Mang đi
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-3">
                        <div className='w-full space-y-2'>
                            <div className='flex items-center text-xs justify-between bg-gray-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Doanh thu:</span>
                                <span className="font-semibold text-gray-800">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.totalTakeAwayRevenue ?? 0 ) : formatPrice( dashboardStoreData?.totalTakeAwayRevenue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-purple-0 p-2 rounded-lg'>
                                <span className="text-gray-600">Tổng hóa đơn:</span>
                                <span className="font-semibold text-purple-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.totalTakeAwayOrders ?? 0 ) : ( dashboardStoreData?.totalTakeAwayOrders ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân hóa đơn:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? formatPrice( dashboardBrandData?.averageTakeAwayOrderValue ?? 0 ) : formatPrice( dashboardStoreData?.averageTakeAwayOrderValue ?? 0 ) }
                                </span>
                            </div>
                            <div className='flex items-center text-xs justify-between bg-blue-50 p-2 rounded-lg'>
                                <span className="text-gray-600">Bình quân sản phẩm:</span>
                                <span className="font-semibold text-blue-600">
                                    { role === "BrandAdmin" ? ( dashboardBrandData?.averageTakeAwayItemsPerOrder ?? 0 ) : ( dashboardStoreData?.averageTakeAwayItemsPerOrder ?? 0 ) }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}

export default ServiceMethodCard