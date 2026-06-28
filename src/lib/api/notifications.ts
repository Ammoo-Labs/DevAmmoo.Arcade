import { apiFetch } from './client';
import { BackendNotification } from './types';

export interface NotificationsResponse {
  notifications: BackendNotification[];
  unreadCount: number;
}

export function getNotifications(token: string): Promise<NotificationsResponse> {
  return apiFetch<NotificationsResponse>('/notifications', { token });
}

export function markNotificationRead(token: string, id: string): Promise<unknown> {
  return apiFetch(`/notifications/${id}/read`, { method: 'PUT', token });
}

export function markAllNotificationsRead(token: string): Promise<unknown> {
  return apiFetch('/notifications/read-all', { method: 'PUT', token });
}
