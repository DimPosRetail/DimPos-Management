import { DataTable } from "@/components/table/data-table";
import { handleApiError } from "@/lib/error";
import { columns } from "./campaign-table/column";
import { useQueryParams } from "@/hooks/use-query-params";
import { useCampaign } from "@/hooks/use-campaign";

const CampaignTable = () =>
{
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
    filter,
    setFilter,
  } = useQueryParams( {
    defaultSortBy: "priority",
    defaultIsAsc: false,
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
    ],
  } );

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

  const searchValues = filter.map( ( f ) => ( {
    ...f,
    searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên chiến dịch" : "",
  } ) );
  const sortValue = {
    id: sortBy,
    desc: !isAsc,
  };
  return (
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
      searchValues={ searchValues }
      sortValues={ [ sortValue ] }
      onSortChange={ ( newSort ) =>
      {
        setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
      } }
    />
  );
};

export default CampaignTable;
