import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

type Props = {}

const ProductCategoryCard = ( _: Props ) =>
{
    // Sample data for product categories pie chart
    const categoryData = [
        { name: 'Bánh bao', value: 35, color: '#3b82f6' },
        { name: 'Bánh bao', value: 25, color: '#ef4444' },
        { name: 'Bánh bao', value: 20, color: '#22c55e' },
        { name: 'Bánh bao', value: 20, color: '#f59e0b' }
    ];
    return (
        <Card className="lg:col-span-1 bg-white shadow-none border-none gap-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Danh mục sản phẩm</CardTitle>
                    <CardDescription className="text-sm text-sidebar-label font-normal">
                        Tỷ trọng danh mục sản phẩm đã bán ra
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Select defaultValue="thismonth">
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Tháng này" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thismonth">Tháng này</SelectItem>
                        <SelectItem value="lastmonth">Tháng trước</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center justify-center">
                    <div className="w-70 h-70">
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

export default ProductCategoryCard