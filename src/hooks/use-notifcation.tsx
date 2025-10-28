import { notificationApi } from "@/apis/notification.api";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";

interface UseNotificationParams
{
    page?: number;
    size?: number;
    sortBy?: string;
    isAsc?: boolean;

    enabled?: boolean;
}

export const useNotification = ( params: UseNotificationParams = {} ) =>
{
    // Set default values for pagination
    const defaultParams = {
        size: 4,
        sortBy: 'isRead',
        isAsc: true,
        ...params
    };

    // useInfiniteQuery for paginated notifications
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        refetch,
    } = useInfiniteQuery( {
        queryKey: [ "notifications", defaultParams ],
        queryFn: async ( { pageParam = 1 } ) =>
        {
            const response = await notificationApi.getNotifications( {
                ...defaultParams,
                page: pageParam
            } );
            console.log( 'API Response:', response );
            return response;
        },
        getNextPageParam: ( lastPage ) =>
        {
            const page = lastPage?.data?.data?.page;
            const totalPages = lastPage?.data?.data?.totalPages;
            if ( page != null && totalPages != null && page < totalPages )
            {
                return page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,

        enabled: defaultParams.enabled,
    } );

    const notifications = data?.pages.flatMap( page => page.data?.data.items || [] ) || [];

    const totalNotifications = data?.pages[ 0 ]?.data?.data.total || 0;

    const deleteNotificationsMutation = useMutation( {
        mutationFn: () => notificationApi.deleteNotifications(),
        onSuccess: () =>
        {
            refetch();
        }
    } );

    const markNotificationAsReadMutation = useMutation( {
        mutationFn: () => notificationApi.markNotificationAsRead(),
        onSuccess: () =>
        {
            // Invalidate and refetch notifications after marking as read
            refetch();
        }
    } );

    return {
        notifications,
        totalNotifications,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        error,
        refetch,

        // Mutations
        deleteNotificationsMutation,
        markNotificationAsReadMutation,

        // Status
        isLoading: status === 'pending',
        isError: status === 'error',
    };
};