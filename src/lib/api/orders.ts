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
