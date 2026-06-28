"use client";

import { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  getAdminProducts,
  approveProduct as apiApproveProduct,
  rejectProduct as apiRejectProduct,
  setProductUnderReview as apiSetProductUnderReview,
} from "@/lib/api/admin";
import { BackendProduct } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

type PostApprovalStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

const APPROVAL_CFG: Record<
  PostApprovalStatus,
  { label: string; cls: string; icon: React.ReactNode }
> = {
  pending:      { label: "Pending",      cls: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" /> },
  approved:     { label: "Approved",     cls: "bg-green-100 text-green-800",    icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected:     { label: "Rejected",     cls: "bg-red-100 text-red-800",        icon: <XCircle className="w-3.5 h-3.5" /> },
  under_review: { label: "Under Review", cls: "bg-orange-100 text-orange-800",  icon: <Eye className="w-3.5 h-3.5" /> },
};

export function PostManagement() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<PostApprovalStatus | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const [rejectModalProduct, setRejectModalProduct] = useState<BackendProduct | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getAdminProducts(accessToken);
      setProducts(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const filtered = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.shop?.shopName ?? "").toLowerCase().includes(q);
    const matchesFilter = filterStatus === "all" || p.approvalStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const counts: Record<string, number> = { all: products.length };
  products.forEach((p) => {
    counts[p.approvalStatus] = (counts[p.approvalStatus] ?? 0) + 1;
  });

  const handleApprove = async (id: string) => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      const updated = await apiApproveProduct(accessToken, id);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to approve product.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModalProduct || !accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      const updated = await apiRejectProduct(accessToken, rejectModalProduct.id, rejectComment);
      setProducts((prev) => prev.map((p) => (p.id === rejectModalProduct.id ? updated : p)));
      if (selectedProduct?.id === rejectModalProduct.id) setSelectedProduct(null);
      setRejectModalProduct(null);
      setRejectComment("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reject product.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnderReview = async (id: string) => {
    if (!accessToken) return;
    setIsProcessing(true);
    setError("");
    try {
      const updated = await apiSetProductUnderReview(accessToken, id);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update product.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
          <p className="text-gray-600 mt-1">Review and approve product listings before they go live</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Pending notice */}
      {(counts["pending"] ?? 0) > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800 text-sm font-medium">
            {counts["pending"]} post{counts["pending"] > 1 ? "s" : ""} awaiting review
          </p>
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected", "under_review"] as const).map((s) => {
          const cfg = s !== "all" ? APPROVAL_CFG[s] : null;
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cfg?.icon}
              <span className="capitalize">{s === "all" ? "All Posts" : cfg?.label}</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${active ? "bg-white bg-opacity-20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[s] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, category, or shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const cfg = APPROVAL_CFG[p.approvalStatus ?? "pending"];
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          {p.approvalStatus === "rejected" && p.rejectionComment && (
                            <p className="text-xs text-red-600 italic mt-0.5">&quot;{p.rejectionComment}&quot;</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.shop?.shopName ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">${Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(p)}
                        >
                          View
                        </Button>
                        {p.approvalStatus !== "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleApprove(p.id)}
                            disabled={isProcessing}
                          >
                            Approve
                          </Button>
                        )}
                        {p.approvalStatus !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              setRejectModalProduct(p);
                              setRejectComment("");
                            }}
                          >
                            Reject
                          </Button>
                        )}
                        {p.approvalStatus !== "under_review" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-800"
                            onClick={() => handleUnderReview(p.id)}
                            disabled={isProcessing}
                          >
                            Under Review
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

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No posts match your filter.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Posts",    value: counts.all ?? 0,              color: "text-gray-900" },
          { label: "Pending Review", value: counts.pending ?? 0,          color: "text-yellow-700" },
          { label: "Approved",       value: counts.approved ?? 0,         color: "text-green-700" },
          { label: "Rejected",       value: counts.rejected ?? 0,         color: "text-red-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedProduct.images?.[0] && (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              )}
              <div className="space-y-2 text-sm">
                {[
                  ["Name", selectedProduct.name],
                  ["Shop", selectedProduct.shop?.shopName ?? "—"],
                  ["Category", selectedProduct.category],
                  ["Price", `$${Number(selectedProduct.price).toFixed(2)}`],
                  ["Stock", String(selectedProduct.stock)],
                  ["Status", selectedProduct.status],
                  ["Created", new Date(selectedProduct.createdAt).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-900 font-medium capitalize">{v}</span>
                  </div>
                ))}
              </div>
              {selectedProduct.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                </div>
              )}
              {selectedProduct.approvalStatus === "rejected" && selectedProduct.rejectionComment && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selectedProduct.rejectionComment}</p>
                </div>
              )}

              {/* Actions in modal */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedProduct.approvalStatus !== "approved" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(selectedProduct.id)}
                    disabled={isProcessing}
                  >
                    Approve
                  </Button>
                )}
                {selectedProduct.approvalStatus !== "rejected" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setRejectModalProduct(selectedProduct);
                      setRejectComment("");
                      setSelectedProduct(null);
                    }}
                  >
                    Reject
                  </Button>
                )}
                {selectedProduct.approvalStatus !== "under_review" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleUnderReview(selectedProduct.id)}
                    disabled={isProcessing}
                  >
                    Put Under Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject with Comment Modal ── */}
      {rejectModalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Post
              </h3>
              <button
                onClick={() => setRejectModalProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                You are rejecting <strong>{rejectModalProduct.name}</strong>. Please provide a short reason that will be visible to the seller.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Product images are blurry. Please upload clear photos."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setRejectModalProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRejectSubmit}
                disabled={isProcessing || !rejectComment.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? "Rejecting..." : "Confirm Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
