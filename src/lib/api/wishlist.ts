import { apiFetch } from './client';
import { BackendWishlistItem } from './types';

export function getWishlist(token: string): Promise<BackendWishlistItem[]> {
  return apiFetch<BackendWishlistItem[]>('/wishlist', { token });
}

export function addToWishlist(token: string, productId: string): Promise<unknown> {
  return apiFetch(`/wishlist/${productId}`, { method: 'POST', token });
}

export function removeFromWishlist(token: string, productId: string): Promise<unknown> {
  return apiFetch(`/wishlist/${productId}`, { method: 'DELETE', token });
}

export function isInWishlist(token: string, productId: string): Promise<{ inWishlist: boolean }> {
  return apiFetch<{ inWishlist: boolean }>(`/wishlist/${productId}/check`, { token });
}
