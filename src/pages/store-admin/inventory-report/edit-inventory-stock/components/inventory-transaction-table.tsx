import { DataTable } from '@/components/table/data-table';
import { useInventory } from '@/hooks/use-inventory';
import { getFilterValue, useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { useParams } from 'react-router-dom'
import { columns } from './inventory-transaction-table/column';

const InventoryTransactionTable = () =>
{
    const { id } = useParams<{ id: string }>();

    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        filter,
        setFilter,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams( {
        defaultSortBy: "createdDate",
        defaultIsAsc: false,
        defaultFilter: [
            {
                id: "startDate",
                value: null,
            },
            {
                id: "endDate",
                value: null,
            },

        ]
    } );

    const { getInventoryTransactions } = useInventory();

    const { data, isLoading, isError, error } = getInventoryTransactions( id as string,
        {
            size: pageSize,
            page: currentPage,
            sortBy: sortBy,
            isAsc: isAsc,
            fromDate: getFilterValue( {
                id: "startDate",
                columnFilters: filter,
            } ),
            toDate: getFilterValue( {
                id: "endDate",
                columnFilters: filter,
            } ),
        }
    );


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
    const searchValues = filter.map( f => ( {
        ...f,
        value: f.value ?? ( ( f.id === "startDate" || f.id === "endDate" ) ? null : "" ),
        searchPlaceholder: f.id === "startDate" ? "Từ ngày" : f.id === "endDate" ? "Đến ngày" : "",
        isStartDate: f.id === "startDate",
        isEndDate: f.id === "endDate",
    } ) );

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
            sortValues={ [ sortValue ] }
            onSortChange={ ( newSort ) =>
            {
                setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
            } }
            onSearchChange={ setFilter }
            searchValues={ searchValues }
        />
    )
}

export default InventoryTransactionTable