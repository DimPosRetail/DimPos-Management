import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TDashboardResponse } from "@/schema/dashboard.schema";
import type { TRole } from "@/schema/role.schema";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
    role: TRole;
    dashboardBrandData?: TDashboardResponse;
    dashboardStoreData?: TDashboardResponse;
    isDashboardBrandDataLoading: boolean;
    isDashboardStoreDataLoading: boolean;
}

const OrderPieCard = ( {
    role,
    dashboardBrandData,
    dashboardStoreData,
    isDashboardBrandDataLoading,
    isDashboardStoreDataLoading,
}: Props ) =>
{
    // Determine if data is loading based on role
    const isLoading = role === "BrandAdmin" ? isDashboardBrandDataLoading : isDashboardStoreDataLoading;

    // Sample data for product categories pie chart
    const categoryData = [
        { name: 'Tại quán', value: role === "BrandAdmin" ? ( dashboardBrandData?.totalDineInOrders ?? 0 ) : ( dashboardStoreData?.totalDineInOrders ?? 0 ), color: '#3b82f6' },
        { name: 'Mang đi', value: role === "BrandAdmin" ? ( dashboardBrandData?.totalTakeAwayOrders ?? 0 ) : ( dashboardStoreData?.totalTakeAwayOrders ?? 0 ), color: '#ef4444' },
    ];

    if ( isLoading )
    {
        return (
            <Card className="md:col-span-1 bg-white shadow-none border-none gap-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="w-full flex flex-col justify-center items-center">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center">
                        <div className="w-80 h-80 flex items-center justify-center">
                            <Skeleton className="w-60 h-60 rounded-full" />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="md:col-span-1 bg-white shadow-none border-none gap-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="w-full flex flex-col justify-center items-center">
                    <CardTitle className="text-lg font-semibold">Hóa đơn bán hàng</CardTitle>
                    <CardDescription className="text-sm text-sidebar-label font-normal">
                        Tổng số hóa đơn bán hàng: <span className="font-semibold text-black">{ role === "BrandAdmin" ? ( dashboardBrandData?.totalOrders ?? 0 ) : ( dashboardStoreData?.totalOrders ?? 0 ) }</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center">
                    <div className="w-80 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ categoryData }
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={ 0 }
                                    outerRadius={ 120 }
                                    paddingAngle={ 0 }
                                    dataKey="value"
                                >
                                    { categoryData.map( ( entry, index ) => (
                                        <Cell key={ `cell-${ index }` } fill={ entry.color } />
                                    ) ) }
                                </Pie>
                                <Tooltip
                                    contentStyle={ { backgroundColor: '#ffffff', border: 'none', borderRadius: 8, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' } }
                                    formatter={ ( value: number, name: string ) => [ `${ name }: ${ value }` ] }
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    { categoryData.map( ( item, index ) => (
                        <div key={ index } className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={ { backgroundColor: item.color } }
                            ></div>
                            <span className="text-sm text-black">{ item.name }</span>
                        </div>
                    ) ) }
                </div>
            </CardContent>
        </Card>
    )
}

export default OrderPieCard