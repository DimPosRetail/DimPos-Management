import { DataTable } from '@/components/table/data-table';
import { handleApiError } from '@/lib/error';
import { columns } from './category-table/column';
import { getFilterValue, useQueryParams } from '@/hooks/use-query-params';
import { useCategory } from '@/hooks/use-category';
import { CategoryTypeEnum, getCategoryTypeLabel, type TCategoryTypeEnum } from '@/types/enums/category-type.enum';

const CategoryTable = () =>
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
        defaultSortBy: "displayOrder",
        defaultIsAsc: false,
        defaultFilter: [
            {
                id: "name",
                value: "",
            },
            {
                id: "type",
                value: null,
            },
        ]
    } );

    const { getCategories } = useCategory()
    const { data, isLoading, isError, error } = getCategories( {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
        name: filter.find( f => f.id === "name" )?.value as string || "",
        type: getFilterValue( {
            id: "type",
            columnFilters: filter,
        } ) === "All" ? null : getFilterValue( {
            id: "type",
            columnFilters: filter,
        } ),
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const searchValues = filter.map( f => ( {
        ...f,
        value: f.value ?? ( f.id === "type" ? "All" : "" ),
        searchPlaceholder: f.id === "name" ? "Tìm kiếm theo tên danh mục" : f.id === "type" ? "Loại danh mục" : "",
        isSelect: f.id === "type",
        options: f.id === "type" ? [
            { label: "Tất cả", value: "All" },
            ...Object.keys( CategoryTypeEnum ).map( ( label, value ) => ( {
                label: getCategoryTypeLabel( value as TCategoryTypeEnum ),
                value: label,
            } ) )
        ] : [],
    } ) )
    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }
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
    )
}

export default CategoryTable