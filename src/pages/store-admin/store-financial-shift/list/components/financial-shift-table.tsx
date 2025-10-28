import { DataTable } from "@/components/table/data-table";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { useFinancialShiftConfig } from "@/hooks/use-financial-shift-config"; 
import { columns } from "./column";

const FinancialShiftTable = () => {
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
  } = useQueryParams({
    defaultSortBy: "createdDate",
    defaultIsAsc: false,
  });

  const { getFinancialShifts } = useFinancialShiftConfig(); 

  const { data, isLoading, isError, error } = getFinancialShifts({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
  });

  if (isError && error) {
    handleApiError(error);
  }

  const items = data?.data.items || [];
  const total = data?.data.total ?? 0;

  return (
    <DataTable
      columns={columns}
      data={items}
      totalItems={total}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      isLoading={isLoading}
      onSearchChange={setFilter}
      searchValues={filter}
      sortValues={[{ id: sortBy, desc: !isAsc }]}
      onSortChange={(newSort) => {
        setSort(newSort[0].id, !newSort[0].desc);
      }}
    />
  );
};

export default FinancialShiftTable;
