import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

type Props = {}

const TopProductCard = ( _: Props ) =>
{
    const transactions = [
        { id: 1, type: 'delivery', description: 'Giao dịch thất bại', date: '14/12/2025', amount: -62500000, status: 'failed' },
        { id: 2, type: 'payment', description: 'Thanh toán thành công', date: '14/12/2025', amount: 82500000, status: 'success' },
        { id: 3, type: 'delivery', description: 'Giao dịch thất bại', date: '14/12/2025', amount: -59900000, status: 'failed' },
        { id: 4, type: 'payment', description: 'Thanh toán thành công', date: '14/12/2025', amount: 60500000, status: 'success' },

        { id: 5, type: 'payment', description: 'Thanh toán thành công', date: '14/12/2025', amount: 60500000, status: 'success' },
        { id: 6, type: 'payment', description: 'Thanh toán thành công', date: '14/12/2025', amount: 60500000, status: 'success' }
    ];
    return (
        <Card className="bg-white shadow-none border-none" >
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Top sản phẩm bán chạy</CardTitle>
                {/* <CardDescription className="text-sm text-gray-500">
                    Các giao dịch diễn ra trong ngày hôm nay
                </CardDescription> */}
            </CardHeader>
            <CardContent>
                <ScrollArea className="space-y-4 max-h-[300px] overflow-y-auto">
                    <div className='mx-2'>
                        { transactions.map( ( transaction, index ) => (
                            <div key={ transaction.id }>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={ `w-8 h-8 rounded-lg flex items-center justify-center ${ transaction.status === 'success' ? 'bg-blue-100' : 'bg-orange-100'
                                            }` }>
                                            <div className={ `w-4 h-4 rounded ${ transaction.status === 'success' ? 'bg-blue-500' : 'bg-orange-500'
                                                }` }></div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                { transaction.description }
                                            </div>
                                            <div className="text-xs text-gray-500">{ transaction.date }</div>
                                        </div>
                                    </div>
                                    <div className={ `text-sm font-semibold ${ transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                        }` }>
                                        { transaction.amount > 0 && '+' }{ formatPrice( transaction.amount ) }
                                    </div>
                                </div>
                                { index < ( transactions.length - 1 ) && <Separator className='my-4' /> }
                            </div>
                        ) ) }
                    </div>
                </ScrollArea>
            </CardContent>
        </Card >
    )
}

export default TopProductCard