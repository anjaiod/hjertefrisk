import { apiClient } from "@/lib/apiClient";

export async function fetchNotifications() {
  return await apiClient.get<NotificationDto[]>("/api/notifications");
}

export async function markAllNotificationsAsRead(patientId?: number) {
  const url = patientId
    ? `/api/notifications/mark-all-read?patientId=${patientId}`
    : "/api/notifications/mark-all-read";
  return await apiClient.post<void>(url);
}

export type NotificationDto = {
  id: number;
  patientId: number;
  answeredQueryId: number;
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string | null;
};
