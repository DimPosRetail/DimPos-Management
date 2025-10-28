import type { NotificationMessage } from "@/context/signalr-provider";
import { apiRequest } from "@/lib/http";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getNotifications = async (params?: any) =>
    await apiRequest.notification.get<BaseResponse<PaginationResponse<NotificationMessage>>>(
        API_SUFFIX.NOTIFICATION_API, { params }
    );
const deleteNotifications = async () =>
    await apiRequest.notification.delete(API_SUFFIX.NOTIFICATION_API);
const markNotificationAsRead = async () =>
    await apiRequest.notification.put(
        `${API_SUFFIX.NOTIFICATION_API}/make-read`
    );
export const notificationApi = {
    getNotifications,
    deleteNotifications,
    markNotificationAsRead,
}