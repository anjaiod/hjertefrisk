import { apiClient } from "@/lib/apiClient";

export async function fetchNotifications() {
  return await apiClient.get<NotificationDto[]>("/api/notifications");
}

export async function markAllNotificationsAsRead() {
  return await apiClient.post<void>("/api/notifications/mark-all-read");
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
