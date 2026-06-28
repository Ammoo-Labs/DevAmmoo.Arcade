import { apiFetch } from './client';
import { BackendOrder } from './types';

export interface CreateOrderPayload {
  cartItemIds: string[];
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export function createOrder(
  token: string,
  payload: CreateOrderPayload,
): Promise<BackendOrder> {
  return apiFetch<BackendOrder>('/orders', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function getMyOrders(token: string): Promise<BackendOrder[]> {
  return apiFetch<BackendOrder[]>('/orders/mine', { token });
}

export function getOrderById(token: string, id: string): Promise<BackendOrder> {
  return apiFetch<BackendOrder>(`/orders/${id}`, { token });
}

export function getSellerOrders(token: string): Promise<BackendOrder[]> {
  return apiFetch<BackendOrder[]>('/orders/seller', { token });
}

export type OrderStatusValue =
  | 'pending'
  | 'on_hold'
  | 'processing'
  | 'packaged'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export function updateOrderStatus(
  token: string,
  id: string,
  data: { status: OrderStatusValue; trackingNumber?: string; handoverProofUrl?: string; note?: string },
): Promise<BackendOrder> {
  return apiFetch<BackendOrder>(`/orders/${id}/status`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function uploadOrderProof(token: string, id: string, file: File): Promise<{ url: string }> {
  const body = new FormData();
  body.append('file', file);
  return apiFetch<{ url: string }>(`/orders/${id}/proof`, { method: 'POST', token, body });
}
