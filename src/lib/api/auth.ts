import { apiFetch } from './client';
import { BackendProfile, BackendSellerStatus } from './types';

export function getMe(token: string): Promise<BackendProfile> {
  return apiFetch<BackendProfile>('/auth/me', { token });
}

export function updateMe(
  token: string,
  data: Partial<Pick<BackendProfile, 'name' | 'phone' | 'address' | 'city' | 'postalCode' | 'profileImage'>>,
): Promise<BackendProfile> {
  return apiFetch<BackendProfile>('/auth/me', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function elevateToSeller(token: string): Promise<BackendProfile> {
  return apiFetch<BackendProfile>('/auth/me/role', { method: 'PUT', token });
}

export function getSellerStatus(token: string): Promise<BackendSellerStatus> {
  return apiFetch<BackendSellerStatus>('/auth/me/seller-status', { token });
}

export function uploadAvatar(token: string, file: File): Promise<BackendProfile> {
  const body = new FormData();
  body.append('file', file);
  return apiFetch<BackendProfile>('/auth/me/avatar', { method: 'POST', token, body });
}
