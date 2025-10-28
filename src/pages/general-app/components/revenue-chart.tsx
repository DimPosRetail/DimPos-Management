import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { UploadIcon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Props = {}

const RevenueChart = ( _: Props ) =>
{
    const revenueData = [
        { month: 'T1', revenue: 150 },
        { month: 'T2', revenue: 180 },
        { month: 'T3', revenue: 220 },
        { month: 'T4', revenue: 280 },
        { month: 'T5', revenue: 320 },
        { month: 'T6', revenue: 290 },
        { month: 'T7', revenue: 350 },
        { month: 'T8', revenue: 380 },
        { month: 'T9', revenue: 320 },
        { month: 'T10', revenue: 290 },
        { month: 'T11', revenue: 340 },
        { month: 'T12', revenue: 380 }
    ];

    return (
        <Card className="lg:col-span-2 bg-white shadow-none border-none">
            <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='col-span-2'>
                    <CardTitle className="text-lg font-semibold">Doanh thu theo thời gian</CardTitle>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <Select defaultValue="thismonth">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Tháng này" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thismonth">Tháng này</SelectItem>
                            <SelectItem value="lastmonth">Tháng trước</SelectItem>
                            <SelectItem value="thisyear">Năm này</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='col-span-2 md:col-span-1 items-end flex justify-end '>
                    <Button variant="outline" className="text-sm text-gray-500 hover:text-gray-700">
                        <UploadIcon />
                        Xuất dữ liệu
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64 border border-gray-200 rounded-lg ">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ revenueData } margin={ { top: 30, right: 30, left: 0, bottom: 5 } }>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={ 0.3 } />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={ 0.05 } />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={ true } vertical={ false } />
                            <XAxis
                                dataKey="month"
                                axisLine={ false }
                                tickLine={ false }
                                tick={ { fontSize: 12, fill: '#9ca3af' } }
                                interval={ 0 }
                            />
                            <YAxis
                                axisLine={ false }
                                tickLine={ false }
                                tick={ { fontSize: 12, fill: '#9ca3af' } }
                                domain={ [ 170, 270 ] }
                                tickCount={ 6 }
                                tickFormatter={ ( value ) => `${ value }` }
                            />
                            {/* Vertical reference line for highlight */ }
                            <ReferenceLine x={ 7 } stroke="#e5e7eb" strokeDasharray="2 2" />
                            <Tooltip
                                contentStyle={ { display: "flex", flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', border: 'none', borderRadius: 8, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', gap: 3 } }
                                labelStyle={ { color: '#7E84A3', fontWeight: 'normal', fontSize: 12, } }
                                itemStyle={ { color: 'black', fontWeight: 'medium', fontSize: 12 } }
                                formatter={ ( value: number ) => [ `Doanh thu: ${ formatPrice( value ) }` ] }
                                labelFormatter={ ( value: string ) => [ `Tháng ${ value.substring( 1 ) }` ] }
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#ef4444"
                                strokeWidth={ 3 }
                                fill="url(#revenueGradient)"
                                dot={ { stroke: '#ef4444', strokeWidth: 2, r: 4, fill: 'white' } }
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                {/* <div className="flex items-center gap-2 mt-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Doanh thu - 2019</span>
                </div> */}
            </CardContent>
        </Card>
    )
}

export default RevenueChart