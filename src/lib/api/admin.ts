import { apiFetch } from './client';
import {
  BackendAdminStats,
  BackendAdminUser,
  BackendHeroBanner,
  BackendOrder,
  BackendPayoutRequest,
  BackendProduct,
  BackendShop,
  BackendSiteSettings,
} from './types';

// ── Stats ────────────────────────────────────────────────────────────────────

export function getAdminStats(token: string): Promise<BackendAdminStats> {
  return apiFetch<BackendAdminStats>('/admin/stats', { token });
}

// ── Users ────────────────────────────────────────────────────────────────────

export function getUsers(
  token: string,
  role?: 'customer' | 'seller' | 'admin',
): Promise<BackendAdminUser[]> {
  const qs = role ? `?role=${role}` : '';
  return apiFetch<BackendAdminUser[]>(`/admin/users${qs}`, { token });
}

export function updateUserStatus(
  token: string,
  id: string,
  status: 'active' | 'inactive' | 'suspended' | 'banned',
  note?: string,
): Promise<BackendAdminUser> {
  return apiFetch<BackendAdminUser>(`/admin/users/${id}/status`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ status, note }),
  });
}

export function assignUserRole(
  token: string,
  id: string,
  role: 'customer' | 'seller' | 'admin',
): Promise<BackendAdminUser> {
  return apiFetch<BackendAdminUser>(`/admin/users/${id}/role`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ role }),
  });
}

// ── Products ─────────────────────────────────────────────────────────────────

export function getAdminProducts(
  token: string,
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'under_review',
): Promise<BackendProduct[]> {
  const qs = approvalStatus ? `?approvalStatus=${approvalStatus}` : '';
  return apiFetch<BackendProduct[]>(`/admin/products${qs}`, { token });
}

export function approveProduct(token: string, id: string): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/admin/products/${id}/approve`, { method: 'PUT', token });
}

export function rejectProduct(
  token: string,
  id: string,
  rejectionComment: string,
): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/admin/products/${id}/reject`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ rejectionComment }),
  });
}

export function setProductUnderReview(token: string, id: string): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/admin/products/${id}/review`, { method: 'PUT', token });
}

// ── Shops ────────────────────────────────────────────────────────────────────

export function getAdminShops(
  token: string,
  approvalStatus?: 'pending' | 'approved' | 'rejected',
): Promise<BackendShop[]> {
  const qs = approvalStatus ? `?approvalStatus=${approvalStatus}` : '';
  return apiFetch<BackendShop[]>(`/admin/shops${qs}`, { token });
}

export function updateShopApproval(
  token: string,
  id: string,
  approvalStatus: 'pending' | 'approved' | 'rejected',
): Promise<BackendShop> {
  return apiFetch<BackendShop>(`/admin/shops/${id}/approval`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ approvalStatus }),
  });
}

export function updateShopAccountStatus(
  token: string,
  id: string,
  accountStatus: 'active' | 'inactive' | 'suspended' | 'banned',
): Promise<BackendShop> {
  return apiFetch<BackendShop>(`/admin/shops/${id}/status`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ accountStatus }),
  });
}

export function approveShopChanges(token: string, id: string): Promise<BackendShop> {
  return apiFetch<BackendShop>(`/admin/shops/${id}/changes/approve`, { method: 'PUT', token });
}

export function rejectShopChanges(token: string, id: string, reason?: string): Promise<BackendShop> {
  return apiFetch<BackendShop>(`/admin/shops/${id}/changes/reject`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ reason }),
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function getAllOrders(token: string): Promise<BackendOrder[]> {
  return apiFetch<BackendOrder[]>('/admin/orders', { token });
}

export function markOrderReviewed(token: string, id: string): Promise<BackendOrder> {
  return apiFetch<BackendOrder>(`/admin/orders/${id}/reviewed`, { method: 'PUT', token });
}

// ── Payouts ──────────────────────────────────────────────────────────────────

export function getAdminPayoutRequests(
  token: string,
  status?: 'pending' | 'approved' | 'rejected',
): Promise<BackendPayoutRequest[]> {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<BackendPayoutRequest[]>(`/admin/payouts/requests${qs}`, { token });
}

export function updatePayoutRequest(
  token: string,
  id: string,
  status: 'approved' | 'rejected',
  adminNote?: string,
): Promise<BackendPayoutRequest> {
  return apiFetch<BackendPayoutRequest>(`/admin/payouts/requests/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ status, adminNote }),
  });
}

// ── Site settings ────────────────────────────────────────────────────────────

export function getSiteSettings(token: string): Promise<BackendSiteSettings> {
  return apiFetch<BackendSiteSettings>('/admin/settings', { token });
}

export function updateSiteSettings(
  token: string,
  data: Partial<
    Pick<
      BackendSiteSettings,
      | 'siteName'
      | 'siteDescription'
      | 'logoUrl'
      | 'footerText'
      | 'contactEmail'
      | 'maintenanceMode'
      | 'allowRegistration'
      | 'enableNotifications'
    >
  >,
): Promise<BackendSiteSettings> {
  return apiFetch<BackendSiteSettings>('/admin/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

// ── Hero banners ─────────────────────────────────────────────────────────────

export function getBanners(token: string): Promise<BackendHeroBanner[]> {
  return apiFetch<BackendHeroBanner[]>('/admin/banners', { token });
}

export type BannerFields = Partial<
  Pick<
    BackendHeroBanner,
    'title' | 'description' | 'imageUrl' | 'ctaText' | 'ctaLink' | 'isActive' | 'sellerName' | 'salePercentage'
  >
>;

export function createBanner(token: string, data: BannerFields): Promise<BackendHeroBanner> {
  return apiFetch<BackendHeroBanner>('/admin/banners', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateBanner(
  token: string,
  id: string,
  data: BannerFields,
): Promise<BackendHeroBanner> {
  return apiFetch<BackendHeroBanner>(`/admin/banners/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteBanner(token: string, id: string): Promise<unknown> {
  return apiFetch(`/admin/banners/${id}`, { method: 'DELETE', token });
}

export function toggleBanner(token: string, id: string): Promise<BackendHeroBanner> {
  return apiFetch<BackendHeroBanner>(`/admin/banners/${id}/toggle`, { method: 'PUT', token });
}
