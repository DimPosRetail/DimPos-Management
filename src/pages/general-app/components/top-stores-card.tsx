import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {}

const TopStoresCard = ( _: Props ) =>
{
  // Top stores data
  const topStores = [
    { rank: 1, name: 'Tên cửa hàng', percentage: 46 },
    { rank: 2, name: 'Thọ Phát City', percentage: 46 },
    { rank: 3, name: 'Thọ Phát City', percentage: 46 },
    { rank: 4, name: 'Thọ Phát City', percentage: 46 },
    { rank: 5, name: 'Thọ Phát City', percentage: 26 }
  ];
  return (
    <Card className="lg:col-span-2 bg-white shadow-none border-none gap-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Top 5 cửa hàng</CardTitle>
          <CardDescription className="text-sm text-sidebar-label">
            Bảng xếp hạng doanh thu của cửa hàng
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 py-4 px-6 mt-4">
          {/* Header */ }
          <div className="grid grid-cols-12 gap-4 mb-2">
            <div className="col-span-1 text-sm font-normal text-sidebar-label">#</div>
            <div className="col-span-2 text-sm font-normal text-sidebar-label">Tên cửa hàng</div>
            <div className="col-span-7 text-sm font-normal text-sidebar-label">Tỷ lệ doanh thu</div>
            <div className="col-span-2 text-sm font-normal text-sidebar-label text-right"></div>
          </div>

          {/* Store Rankings */ }
          <div className="divide-y divide-gray-100">
            { topStores.map( ( store, _ ) => (
              <div key={ store.rank } className="grid grid-cols-12 gap-4 py-4 items-center">
                {/* Rank number column */ }
                <div className="col-span-1">
                  <span className="text-sm font-medium text-gray-700">
                    { store.rank }
                  </span>
                </div>

                {/* Store name column */ }
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-800">
                    { store.name }
                  </span>
                </div>

                {/* Progress bar column - left aligned */ }
                <div className="col-span-7">
                  <div className="w-full bg-primary/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                      style={ { width: `${ store.percentage }%` } }
                    ></div>
                  </div>
                </div>

                {/* Percentage number column - right aligned */ }
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold text-gray-800">
                    { store.percentage }%
                  </span>
                </div>
              </div>
            ) ) }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TopStoresCard