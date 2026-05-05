"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  CreditCard,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Save,
  Edit,
  TrendingUp,
  ArrowDownCircle,
  Lock,
  Info,
} from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import {
  BankDetails,
  PayoutTransaction,
  getBankDetails,
  saveBankDetails,
  getTransactions,
  addTransaction,
  getWalletBalance,
  MINIMUM_WITHDRAWAL,
} from "@/ui/components/seller-dashboard/seller-store";

const SELLER_ID = "seller-sarah";

const TXN_STATUS_CONFIG: Record<
  PayoutTransaction["status"],
  { icon: React.ReactNode; badge: string; label: string }
> = {
  completed: {
    icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    badge: "bg-green-100 text-green-700",
    label: "Completed",
  },
  pending: {
    icon: <Clock className="w-4 h-4 text-yellow-600" />,
    badge: "bg-yellow-100 text-yellow-700",
    label: "Pending",
  },
  failed: {
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    badge: "bg-red-100 text-red-700",
    label: "Failed",
  },
};

const emptyBank: BankDetails = {
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  routingNumber: "",
  accountType: "savings",
  iban: "",
};

export default function Payouts() {
  const [wallet, setWallet] = useState({ total: 0, pending: 0, available: 0 });
  const [transactions, setTransactions] = useState<PayoutTransaction[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>(emptyBank);
  const [form, setForm] = useState<BankDetails>(emptyBank);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const reload = () => {
    setWallet(getWalletBalance(SELLER_ID));
    setTransactions(getTransactions(SELLER_ID));
    const details = getBankDetails(SELLER_ID);
    setBankDetails(details);
    setForm(details);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSaveBank = async () => {
    setIsSavingBank(true);
    await new Promise((r) => setTimeout(r, 700));
    saveBankDetails(SELLER_ID, form);
    setBankDetails(form);
    setIsEditingBank(false);
    setIsSavingBank(false);
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
  };

  const handleWithdraw = async () => {
    setWithdrawError("");
    setWithdrawSuccess(false);
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }
    if (amount < MINIMUM_WITHDRAWAL) {
      setWithdrawError(
        `Minimum withdrawal is $${MINIMUM_WITHDRAWAL.toFixed(2)}. Your requested amount is below the threshold.`
      );
      return;
    }
    if (amount > wallet.available) {
      setWithdrawError(
        `Insufficient balance. Your available balance is $${wallet.available.toFixed(2)}.`
      );
      return;
    }
    if (!bankDetails.accountNumber || !bankDetails.bankName) {
      setWithdrawError("Please save your bank details before requesting a payout.");
      return;
    }

    setIsWithdrawing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const txn: PayoutTransaction = {
      id: `TXN-${Date.now()}`,
      amount,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      method: "Bank Transfer",
    };
    addTransaction(SELLER_ID, txn);
    reload();
    setWithdrawAmount("");
    setIsWithdrawing(false);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  const canWithdraw =
    wallet.available >= MINIMUM_WITHDRAWAL &&
    !!bankDetails.accountNumber &&
    !!bankDetails.bankName;

  const maskedAccount = bankDetails.accountNumber
    ? `•••• •••• ${bankDetails.accountNumber.slice(-4)}`
    : "—";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payouts & Financials</h1>
        <p className="text-gray-600">Manage your earnings, bank details, and withdrawal requests</p>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Lifetime Earnings",
            value: wallet.total,
            icon: TrendingUp,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            note: "After 10% platform fee",
          },
          {
            label: "In Escrow / Pending",
            value: wallet.pending,
            icon: Clock,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            note: "Released when orders complete",
          },
          {
            label: "Available to Withdraw",
            value: wallet.available,
            icon: DollarSign,
            iconBg: "bg-black",
            iconColor: "text-white",
            note: `Min. withdrawal: $${MINIMUM_WITHDRAWAL}`,
            highlight: true,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-xl border p-6 shadow-sm ${
                card.highlight ? "border-black ring-1 ring-black" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                {card.highlight && wallet.available < MINIMUM_WITHDRAWAL && (
                  <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">${card.value.toFixed(2)}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{card.label}</p>
              <p className="text-xs text-gray-400 mt-1">{card.note}</p>
            </div>
          );
        })}
      </div>

      {/* Minimum Withdrawal Warning */}
      {wallet.available < MINIMUM_WITHDRAWAL && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Withdrawal Not Available Yet</p>
            <p className="text-sm text-orange-700 mt-1">
              Your available balance (${wallet.available.toFixed(2)}) is below the minimum withdrawal
              threshold of <strong>${MINIMUM_WITHDRAWAL.toFixed(2)}</strong>. Complete more orders to
              increase your balance.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Withdrawal Form ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Request Withdrawal</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdrawal Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-medium">$</span>
              <input
                type="number"
                min={MINIMUM_WITHDRAWAL}
                max={wallet.available}
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => {
                  setWithdrawAmount(e.target.value);
                  setWithdrawError("");
                }}
                placeholder={`${MINIMUM_WITHDRAWAL}.00`}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={!canWithdraw}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Min: ${MINIMUM_WITHDRAWAL.toFixed(2)} · Available: ${wallet.available.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            {[25, 50, 100].map((pct) => {
              const amount = (wallet.available * pct) / 100;
              return (
                <button
                  key={pct}
                  onClick={() => setWithdrawAmount(amount.toFixed(2))}
                  disabled={!canWithdraw || amount < MINIMUM_WITHDRAWAL}
                  className="flex-1 text-xs font-medium border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pct}%
                </button>
              );
            })}
            <button
              onClick={() => setWithdrawAmount(wallet.available.toFixed(2))}
              disabled={!canWithdraw}
              className="flex-1 text-xs font-medium border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>

          {withdrawError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{withdrawError}</p>
            </div>
          )}

          {withdrawSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                Withdrawal request submitted! Funds will arrive in 2–5 business days.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Payouts are sent to your registered bank account. Processing takes 2–5 business days.
              A 10% platform commission has already been deducted from your earnings.
            </p>
          </div>

          <ActionButton
            onClick={handleWithdraw}
            disabled={!canWithdraw || isWithdrawing || !withdrawAmount}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowDownCircle className="w-4 h-4" />
            {isWithdrawing ? "Processing..." : "Request Payout"}
          </ActionButton>
        </div>

        {/* ── Bank Details Form ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
            </div>
            {bankSaved && (
              <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Saved
              </span>
            )}
            {!isEditingBank && (
              <button
                onClick={() => setIsEditingBank(true)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {!isEditingBank ? (
            /* View mode */
            <div className="space-y-3">
              {[
                ["Bank Name", bankDetails.bankName || "—"],
                ["Account Holder", bankDetails.accountHolder || "—"],
                ["Account Number", maskedAccount],
                ["Routing / SWIFT", bankDetails.routingNumber || "—"],
                ["Account Type", bankDetails.accountType ? bankDetails.accountType.charAt(0).toUpperCase() + bankDetails.accountType.slice(1) : "—"],
                ["IBAN", bankDetails.iban || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}

              {!bankDetails.accountNumber && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2 mt-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    No bank account added yet. Add your details to enable withdrawals.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                Bank details are encrypted and stored securely.
              </div>
            </div>
          ) : (
            /* Edit mode */
            <div className="space-y-4">
              {[
                { key: "bankName", label: "Bank Name", placeholder: "e.g. Commercial Bank of Ceylon" },
                { key: "accountHolder", label: "Account Holder Name", placeholder: "Full name as on account" },
                { key: "accountNumber", label: "Account Number", placeholder: "e.g. 1234567890" },
                { key: "routingNumber", label: "Routing / SWIFT / BIC Code", placeholder: "e.g. CCEYLKLX" },
                { key: "iban", label: "IBAN (optional)", placeholder: "International Bank Account Number" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  value={form.accountType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, accountType: e.target.value as BankDetails["accountType"] }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm"
                >
                  <option value="savings">Savings</option>
                  <option value="checking">Checking / Current</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <ActionButton
                  variant="secondary"
                  onClick={() => { setIsEditingBank(false); setForm(bankDetails); }}
                  className="flex-1"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={handleSaveBank}
                  disabled={isSavingBank}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSavingBank ? "Saving..." : "Save Details"}
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payout history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Transaction ID</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Method</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => {
                  const cfg = TXN_STATUS_CONFIG[txn.status];
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 font-mono text-sm text-gray-700">{txn.id}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{txn.date}</td>
                      <td className="py-3 px-6 font-semibold text-gray-900">${txn.amount.toFixed(2)}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{txn.method}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
