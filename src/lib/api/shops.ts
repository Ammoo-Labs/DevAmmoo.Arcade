import { apiFetch } from './client';
import { BackendShop } from './types';

export function listShops(): Promise<BackendShop[]> {
  return apiFetch<BackendShop[]>('/shops');
}

export function getShopBySlug(slug: string): Promise<BackendShop> {
  return apiFetch<BackendShop>(`/shops/${slug}`);
}

export function getMyShop(token: string): Promise<BackendShop> {
  return apiFetch<BackendShop>('/shops/me', { token });
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface CreateShopFields {
  shopName: string;
  shopDescription?: string;
  telephone?: string;
  address?: string;
  shopEmail?: string;
  nic?: string;
  idType?: string;
  idNumber?: string;
}

// Note: socialLinks is intentionally not sent here — the backend parses this
// multipart body with multer (flat fields only, no bracket-notation nesting).
// Set social links afterwards via updateMyShop(), which sends real JSON.
export function createShop(
  token: string,
  fields: CreateShopFields,
  files?: { profilePicture?: File; coverPicture?: File; idPhoto?: File },
): Promise<BackendShop> {
  const body = new FormData();
  body.append('shopName', fields.shopName);
  if (fields.shopDescription) body.append('shopDescription', fields.shopDescription);
  if (fields.telephone) body.append('telephone', fields.telephone);
  if (fields.address) body.append('address', fields.address);
  if (fields.shopEmail) body.append('shopEmail', fields.shopEmail);
  if (fields.nic) body.append('nic', fields.nic);
  if (fields.idType) body.append('idType', fields.idType);
  if (fields.idNumber) body.append('idNumber', fields.idNumber);
  if (files?.profilePicture) body.append('profilePicture', files.profilePicture);
  if (files?.coverPicture) body.append('coverPicture', files.coverPicture);
  if (files?.idPhoto) body.append('idPhoto', files.idPhoto);

  return apiFetch<BackendShop>('/shops', { method: 'POST', token, body });
}

export type UpdateShopFields = Partial<
  Pick<
    BackendShop,
    | 'shopName'
    | 'shopDescription'
    | 'phone'
    | 'courierService'
    | 'shopAddress'
    | 'shopEmail'
    | 'shopPhone'
    | 'returnPolicy'
    | 'returnableItems'
    | 'nonReturnableItems'
    | 'exchangePolicy'
    | 'exchangeConditions'
    | 'returnSteps'
    | 'refundInfo'
  >
> & { socialLinks?: SocialLinks };

export function updateMyShop(token: string, fields: UpdateShopFields): Promise<BackendShop> {
  return apiFetch<BackendShop>('/shops/me', {
    method: 'PUT',
    token,
    body: JSON.stringify(fields),
  });
}

export function updateMyShopImages(
  token: string,
  files: { profilePicture?: File; coverPicture?: File },
): Promise<BackendShop> {
  const body = new FormData();
  if (files.profilePicture) body.append('profilePicture', files.profilePicture);
  if (files.coverPicture) body.append('coverPicture', files.coverPicture);
  return apiFetch<BackendShop>('/shops/me/images', { method: 'PUT', token, body });
}

export function submitSensitiveShopChanges(
  token: string,
  fields: { email?: string; phone?: string; address?: string },
): Promise<BackendShop> {
  return apiFetch<BackendShop>('/shops/me/sensitive', {
    method: 'PUT',
    token,
    body: JSON.stringify(fields),
  });
}

export function followShop(token: string, shopId: string): Promise<unknown> {
  return apiFetch(`/shops/${shopId}/follow`, { method: 'POST', token });
}

export function unfollowShop(token: string, shopId: string): Promise<unknown> {
  return apiFetch(`/shops/${shopId}/follow`, { method: 'DELETE', token });
}

export function isFollowingShop(token: string, shopId: string): Promise<{ following: boolean }> {
  return apiFetch<{ following: boolean }>(`/shops/${shopId}/follow`, { token });
}

export interface FollowedShop {
  createdAt: string;
  shop: Pick<BackendShop, 'id' | 'slug' | 'shopName' | 'shopDescription' | 'profileImage' | 'bannerImage'> & {
    _count: { products: number; followers: number };
  };
}

export function getFollowedShops(token: string): Promise<FollowedShop[]> {
  return apiFetch<FollowedShop[]>('/shops/me/following', { token });
}
