import { apiFetch } from './client';
import { BackendBankDetails, BackendPayoutRequest, BackendPayoutTransaction, BackendWallet } from './types';

export function getWallet(token: string): Promise<BackendWallet> {
  return apiFetch<BackendWallet>('/payouts/wallet', { token });
}

export function getPayoutTransactions(token: string): Promise<BackendPayoutTransaction[]> {
  return apiFetch<BackendPayoutTransaction[]>('/payouts/transactions', { token });
}

export function getBankDetails(token: string): Promise<BackendBankDetails | null> {
  return apiFetch<BackendBankDetails | null>('/payouts/bank-details', { token });
}

export interface SaveBankDetailsPayload {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  routingNumber?: string;
  iban?: string;
  accountType: 'savings' | 'checking';
}

export function saveBankDetails(
  token: string,
  data: SaveBankDetailsPayload,
): Promise<BackendBankDetails> {
  return apiFetch<BackendBankDetails>('/payouts/bank-details', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function createPayoutRequest(token: string, amount: number): Promise<BackendPayoutRequest> {
  return apiFetch<BackendPayoutRequest>('/payouts/requests', {
    method: 'POST',
    token,
    body: JSON.stringify({ amount }),
  });
}

export function getMyPayoutRequests(token: string): Promise<BackendPayoutRequest[]> {
  return apiFetch<BackendPayoutRequest[]>('/payouts/requests', { token });
}
