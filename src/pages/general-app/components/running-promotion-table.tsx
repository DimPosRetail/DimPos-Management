import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { columns } from "./campaign-table/column";
import { useQueryParams } from "@/hooks/use-query-params";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaign } from "@/hooks/use-campaign";

const RunningPromotionTable = () =>
{
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
    setFilter,
  } = useQueryParams();

  const { getCampaigns } = useCampaign();
  const { data, isLoading, isError, error } = getCampaigns( {
    size: pageSize,
    page: currentPage,
    sortBy: sortBy,
    isAsc: isAsc,
  } );


  if ( isError && error )
  {
    handleApiError( error );
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;

  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };
  return (
    <Card className="lg:col-span-2 bg-white shadow-none border-none">
      <CardHeader className="grid grid-cols-1 md:grid-cols-2">
        <div className="col-span-2">
          <CardTitle className="text-lg font-semibold">
            Chiến dịch đang chạy
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={ columns }
          data={ items }
          totalItems={ total }
          currentPage={ currentPage }
          pageSize={ pageSize }
          onPageChange={ setPage }
          onPageSizeChange={ setPageSize }
          isLoading={ isLoading }
          onSearchChange={ setFilter }
          sortValues={ [ sortValue ] }
          onSortChange={ ( newSort ) =>
          {
            setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
          } }
        />
      </CardContent>
    </Card>
  );
};

export default RunningPromotionTable;
