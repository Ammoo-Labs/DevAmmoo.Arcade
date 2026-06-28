import { apiFetch } from './client';
import { BackendCart } from './types';

export function getCart(token: string): Promise<BackendCart> {
  return apiFetch<BackendCart>('/cart', { token });
}

export function addCartItem(
  token: string,
  data: { productId: string; quantity: number; size?: string; color?: string },
): Promise<unknown> {
  return apiFetch('/cart/items', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateCartItem(
  token: string,
  id: string,
  quantity: number,
): Promise<unknown> {
  return apiFetch(`/cart/items/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(token: string, id: string): Promise<unknown> {
  return apiFetch(`/cart/items/${id}`, { method: 'DELETE', token });
}

export function clearCart(token: string): Promise<unknown> {
  return apiFetch('/cart', { method: 'DELETE', token });
}
