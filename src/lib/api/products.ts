import { apiFetch } from './client';
import { BackendProduct, BackendProductListResponse } from './types';

export interface ListProductsQuery {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export function listProducts(query: ListProductsQuery = {}): Promise<BackendProductListResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return apiFetch<BackendProductListResponse>(`/products${qs ? `?${qs}` : ''}`);
}

export function getProduct(id: string): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/products/${id}`);
}

export function getMyProducts(token: string): Promise<BackendProduct[]> {
  return apiFetch<BackendProduct[]>('/products/mine', { token });
}

export interface ProductFormFields {
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status?: 'active' | 'inactive' | 'draft';
  tags?: string[];
}

function buildProductFormData(fields: ProductFormFields, images?: File[]): FormData {
  const body = new FormData();
  body.append('name', fields.name);
  body.append('description', fields.description);
  body.append('category', fields.category);
  body.append('price', String(fields.price));
  if (fields.originalPrice !== undefined) body.append('originalPrice', String(fields.originalPrice));
  body.append('stock', String(fields.stock));
  if (fields.status) body.append('status', fields.status);
  (fields.tags ?? []).forEach((tag) => body.append('tags', tag));
  (images ?? []).forEach((file) => body.append('images', file));
  return body;
}

export function createProduct(
  token: string,
  fields: ProductFormFields,
  images?: File[],
): Promise<BackendProduct> {
  return apiFetch<BackendProduct>('/products', {
    method: 'POST',
    token,
    body: buildProductFormData(fields, images),
  });
}

export function updateProduct(
  token: string,
  id: string,
  fields: ProductFormFields,
  images?: File[],
): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/products/${id}`, {
    method: 'PUT',
    token,
    body: buildProductFormData(fields, images),
  });
}

export function replaceProductImages(
  token: string,
  id: string,
  images: File[],
): Promise<BackendProduct> {
  const body = new FormData();
  images.forEach((file) => body.append('images', file));
  return apiFetch<BackendProduct>(`/products/${id}/images`, {
    method: 'PUT',
    token,
    body,
  });
}

export function deleteProduct(token: string, id: string): Promise<unknown> {
  return apiFetch(`/products/${id}`, { method: 'DELETE', token });
}
