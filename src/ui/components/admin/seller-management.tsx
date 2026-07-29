"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  AlertCircle,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  getAdminShops,
  updateShopAccountStatus,
  approveShopChanges,
  rejectShopChanges,
  getAdminPayoutRequests,
  updatePayoutRequest,
} from "@/lib/api/admin";
import { BackendShop, BackendPayoutRequest } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/currency";

type SellerAccountStatus = "active" | "inactive" | "suspended" | "banned";

export function SellerManagement() {
  const { accessToken } = useAuth();
  const [shops, setShops] = useState<BackendShop[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<BackendPayoutRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<SellerAccountStatus | "all">("all");
  const [selectedSeller, setSelectedSeller] = useState<BackendShop | null>(null);
  const [activeTab, setActiveTab] = useState<"sellers" | "payouts">("sellers");
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);
  const [payoutNote, setPayoutNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      const [shopsData, payoutsData] = await Promise.all([
        getAdminShops(accessToken),
        getAdminPayoutRequests(accessToken),
      ]);
      setShops(shopsData);
      setPayoutRequests(payoutsData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load sellers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const filteredSellers = shops.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.shopName.toLowerCase().includes(q) ||
      (s.shopEmail ?? s.email ?? "").toLowerCase().includes(q);
    const matchesFilter = filterStatus === "all" || s.accountStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    active:    { label: "Active",    cls: "bg-green-100 text-green-800" },
    inactive:  { label: "Inactive",  cls: "bg-gray-100 text-gray-800" },
    suspended: { label: "Suspended", cls: "bg-orange-100 text-orange-800" },
    banned:    { label: "Banned",    cls: "bg-red-100 text-red-800" },
  };

  const PAYOUT_STATUS_CFG: Record<BackendPayoutRequest["status"], { label: string; cls: string }> = {
    pending:  { label: "Pending",  cls: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Approved", cls: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  };

  const handleAccountAction = async (shopId: string, status: SellerAccountStatus) => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      const updated = await updateShopAccountStatus(accessToken, shopId, status);
      setShops((prev) => prev.map((s) => (s.id === shopId ? updated : s)));
      if (selectedSeller?.id === shopId) setSelectedSeller(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update seller status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveProfile = async (shopId: string) => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      await approveShopChanges(accessToken, shopId);
      await reload();
      setSelectedSeller(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to approve profile changes.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectProfile = async (shopId: string) => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      await rejectShopChanges(accessToken, shopId);
      await reload();
      setSelectedSeller(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reject profile changes.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayoutAction = async (id: string, status: "approved" | "rejected") => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      const updated = await updatePayoutRequest(accessToken, id, status, payoutNote || undefined);
      setPayoutRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setPayoutNote("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update payout request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingProfileCount = shops.filter((s) => s.profileChangeStatus === "pending").length;
  const pendingPayouts = payoutRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="text-gray-600 mt-1">Manage sellers, approve profile changes, and handle payout requests</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Alert banners */}
      {pendingProfileCount > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <p className="text-sm font-medium text-orange-800">
            {pendingProfileCount} seller{pendingProfileCount > 1 ? "s have" : " has"} pending profile change{pendingProfileCount > 1 ? "s" : ""} requiring approval
          </p>
        </div>
      )}
      {pendingPayouts > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <DollarSign className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm font-medium text-yellow-800">
            {pendingPayouts} payout request{pendingPayouts > 1 ? "s" : ""} awaiting action
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(["sellers", "payouts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "sellers" ? "Sellers" : `Payout Requests${pendingPayouts > 0 ? ` (${pendingPayouts})` : ""}`}
          </button>
        ))}
      </div>

      {activeTab === "sellers" && (
        <>
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by shop or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SellerAccountStatus | "all")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>

          {/* Sellers Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((s) => {
                    const sc = STATUS_CFG[s.accountStatus] ?? STATUS_CFG.active;
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{s.shopName}</p>
                          <p className="text-xs text-gray-400">{s.shopEmail ?? s.email ?? "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.cls}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {s.profileChangeStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">
                              <Clock className="w-3 h-3" /> Profile Review
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedSeller(s)}>
                              View
                            </Button>
                            {s.accountStatus === "active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-800"
                                onClick={() => handleAccountAction(s.id, "suspended")}
                                disabled={isProcessing}
                              >
                                Suspend
                              </Button>
                            )}
                            {s.accountStatus === "suspended" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-800"
                                  onClick={() => handleAccountAction(s.id, "active")}
                                  disabled={isProcessing}
                                >
                                  Activate
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleAccountAction(s.id, "banned")}
                                  disabled={isProcessing}
                                >
                                  Ban
                                </Button>
                              </>
                            )}
                            {s.accountStatus === "banned" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-800"
                                onClick={() => handleAccountAction(s.id, "active")}
                                disabled={isProcessing}
                              >
                                Unban
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!isLoading && filteredSellers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No sellers match your filter.</p>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Total Sellers",   value: shops.length,                                     color: "text-gray-900" },
              { label: "Active",          value: shops.filter((s) => s.accountStatus === "active").length, color: "text-green-700" },
              { label: "Suspended/Banned",value: shops.filter((s) => s.accountStatus !== "active").length, color: "text-red-700" },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "payouts" && (
        <div className="space-y-4">
          {payoutRequests.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No payout requests yet.</p>
            </div>
          ) : (
            payoutRequests.map((req) => {
              const pc = PAYOUT_STATUS_CFG[req.status];
              const isOpen = expandedPayout === req.id;
              return (
                <div key={req.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedPayout(isOpen ? null : req.id)}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Seller ID: {req.sellerId}</p>
                        <p className="text-xs text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</p>
                      </div>
                      <span className="text-base font-bold text-gray-900">{formatCurrency(req.amount)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pc.cls}`}>{pc.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-100 space-y-3">
                      {req.adminNote && (
                        <p className="text-sm text-gray-600 italic">Admin note: {req.adminNote}</p>
                      )}
                      {req.status === "pending" && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Optional admin note..."
                            value={payoutNote}
                            onChange={(e) => setPayoutNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePayoutAction(req.id, "approved")}
                              disabled={isProcessing}
                            >
                              Approve Payout
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handlePayoutAction(req.id, "rejected")}
                              disabled={isProcessing}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Seller Detail Modal ── */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Seller Details</h3>
              <button onClick={() => setSelectedSeller(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Pending profile change notice */}
              {selectedSeller.profileChangeStatus === "pending" && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-orange-800">Pending Profile Changes</p>
                  <p className="text-sm text-orange-700">
                    This seller has submitted contact detail changes that require your approval.
                  </p>
                  {selectedSeller.pendingProfileChanges && (
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedSeller.pendingProfileChanges).map(([k, v]) => (
                        <p key={k} className="text-orange-800">
                          <span className="font-medium capitalize">{k}:</span> {String(v)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveProfile(selectedSeller.id)}
                      disabled={isProcessing}
                    >
                      Approve Changes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleRejectProfile(selectedSeller.id)}
                      disabled={isProcessing}
                    >
                      Reject Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Seller info */}
              <div className="space-y-2 text-sm">
                {[
                  ["Shop Name",  selectedSeller.shopName],
                  ["Email",      selectedSeller.shopEmail ?? selectedSeller.email ?? "—"],
                  ["Phone",      selectedSeller.shopPhone ?? selectedSeller.phone ?? "—"],
                  ["Address",    selectedSeller.shopAddress ?? selectedSeller.address ?? "—"],
                  ["Joined",     new Date(selectedSeller.createdAt).toLocaleDateString()],
                  ["Status",     selectedSeller.accountStatus],
                  ["Courier",    selectedSeller.courierService || "—"],
                  ["Products",   String(selectedSeller._count?.products ?? 0)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-900 font-medium capitalize text-right max-w-xs">{v}</span>
                  </div>
                ))}
              </div>

              {/* Account actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {selectedSeller.accountStatus === "active" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-50"
                      onClick={() => handleAccountAction(selectedSeller.id, "suspended")}
                      disabled={isProcessing}
                    >
                      Suspend Seller
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleAccountAction(selectedSeller.id, "banned")}
                      disabled={isProcessing}
                    >
                      Ban Seller
                    </Button>
                  </>
                )}
                {selectedSeller.accountStatus !== "active" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAccountAction(selectedSeller.id, "active")}
                    disabled={isProcessing}
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
