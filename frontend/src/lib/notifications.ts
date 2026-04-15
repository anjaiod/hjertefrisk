import { apiClient } from "@/lib/apiClient";

export async function fetchNotifications() {
  return await apiClient.get<NotificationDto[]>("/api/notifications");
}

export type NotificationDto = {
  id: number;
  patientId: number;
  answeredQueryId: number;
  message: string;
  createdAt: string;
  read: boolean;
};
