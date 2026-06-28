import { apiFetch } from './client';
import { BackendReview } from './types';

export interface ProductReviewsResponse {
  reviews: BackendReview[];
  count: number;
}

export function getProductReviews(productId: string): Promise<ProductReviewsResponse> {
  return apiFetch<ProductReviewsResponse>(`/products/${productId}/reviews`);
}

export function createReview(
  token: string,
  productId: string,
  data: { rating: number; comment?: string },
): Promise<BackendReview> {
  return apiFetch<BackendReview>(`/products/${productId}/reviews`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateReview(
  token: string,
  id: string,
  data: { rating?: number; comment?: string },
): Promise<BackendReview> {
  return apiFetch<BackendReview>(`/reviews/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteReview(token: string, id: string): Promise<unknown> {
  return apiFetch(`/reviews/${id}`, { method: 'DELETE', token });
}
