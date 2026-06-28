"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  X,
  Save,
  Tag,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useRef } from "react";
import { ActionButton, IconButton } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/products";
import { BackendProduct } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const CATEGORIES = [
  "Fashion",
  "Accessories",
  "Jewelry",
  "Footwear",
  "Home Decor",
  "Art",
  "Electronics",
  "Beauty",
  "Sports",
  "Other",
];

interface ProductForm {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  description: string;
  tags: string[];
}

const emptyForm: ProductForm = {
  name: "",
  category: "Fashion",
  price: 0,
  originalPrice: undefined,
  stock: 0,
  status: "draft",
  description: "",
  tags: [],
};

export default function Products() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [viewProduct, setViewProduct] = useState<BackendProduct | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await getMyProducts(accessToken);
      setProducts(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "inactive") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const APPROVAL_CFG: Record<string, { label: string; cls: string }> = {
    pending:      { label: "Pending Review", cls: "bg-yellow-100 text-yellow-800" },
    approved:     { label: "Approved",       cls: "bg-green-100 text-green-800" },
    rejected:     { label: "Rejected",       cls: "bg-red-100 text-red-800" },
    under_review: { label: "Under Review",   cls: "bg-orange-100 text-orange-800" },
  };

  const rejectedProducts = products.filter((p) => p.approvalStatus === "rejected");

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (stock <= 5) return { label: "Low Stock", color: "text-yellow-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setTagInput("");
    setImageFile(null);
    setImagePreview("");
    setSaveError("");
    setShowModal(true);
  };

  const openEdit = (product: BackendProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: Number(product.price),
      originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
      stock: product.stock,
      status: product.status,
      description: product.description,
      tags: product.tags ?? [],
    });
    setTagInput("");
    setImageFile(null);
    setImagePreview(product.images?.[0] ?? "");
    setSaveError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!accessToken || !form.name.trim() || form.price <= 0) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const fields = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        status: form.status,
        tags: form.tags,
      };
      const images = imageFile ? [imageFile] : undefined;

      if (editingProduct) {
        await updateProduct(accessToken, editingProduct.id, fields, images);
      } else {
        await createProduct(accessToken, fields, images);
      }
      await reload();
      setShowModal(false);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(accessToken, id);
      await reload();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete product.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: BackendProduct["status"]) => {
    if (!accessToken) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      await updateProduct(accessToken, id, {
        name: product.name,
        description: product.description,
        category: product.category,
        price: Number(product.price),
        originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
        stock: product.stock,
        status: newStatus,
        tags: product.tags,
      });
      await reload();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to update status.");
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <ActionButton onClick={openAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </ActionButton>
      </div>

      {/* Load error */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      )}

      {/* Rejected products alert */}
      {rejectedProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-red-800">
            {rejectedProducts.length} product{rejectedProducts.length > 1 ? "s" : ""} rejected — please review and resubmit
          </p>
          {rejectedProducts.map((p) => (
            <div key={p.id} className="flex items-start gap-2">
              <span className="text-xs text-red-700 font-medium">• {p.name}:</span>
              <span className="text-xs text-red-600 italic">{p.rejectionComment || "No reason given"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: products.length, color: "text-gray-900" },
          {
            label: "Active",
            value: products.filter((p) => p.status === "active").length,
            color: "text-green-700",
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.stock === 0).length,
            color: "text-red-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Approval</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const price = Number(product.price);
                const originalPrice = product.originalPrice != null ? Number(product.originalPrice) : null;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.category}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">${price.toFixed(2)}</p>
                      {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ${originalPrice.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{product.stock}</p>
                      <p className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</p>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          handleStatusChange(product.id, e.target.value as BackendProduct["status"])
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(product.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      {(() => {
                        const aCfg = APPROVAL_CFG[product.approvalStatus ?? "pending"];
                        return (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${aCfg.cls}`}>
                            {aCfg.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.sales}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <IconButton
                          icon="custom"
                          customIcon={<Eye className="w-4 h-4" />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewProduct(product)}
                          title="View"
                        />
                        <IconButton
                          icon="custom"
                          customIcon={<Edit className="w-4 h-4" />}
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(product)}
                          title="Edit"
                        />
                        <IconButton
                          icon="custom"
                          customIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400 mb-4">
              {products.length === 0
                ? "Start by adding your first product."
                : "Try adjusting your search or filters."}
            </p>
            {products.length === 0 && (
              <ActionButton onClick={openAdd} className="inline-flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add First Product</span>
              </ActionButton>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Premium Silk Blouse"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              {/* Category + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value as ProductForm["status"] }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active (Published)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Price + Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price || ""}
                    onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price ($) <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock || ""}
                  onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />
                <div
                  className="relative w-full h-36 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black transition-colors overflow-hidden bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) handleImageFile(file);
                  }}
                >
                  {imagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                        <Upload className="w-5 h-5 text-white" />
                        <span className="text-white text-xs font-medium">Click to change</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Click or drag &amp; drop to upload</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Type a tag and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Validation hint */}
              {(!form.name.trim() || form.price <= 0) && (
                <p className="text-xs text-red-500">Product name and a valid price are required.</p>
              )}

              {/* Save error */}
              {saveError && (
                <p className="text-xs text-red-500">{saveError}</p>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <ActionButton variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton
                onClick={handleSave}
                disabled={isSaving || !form.name.trim() || form.price <= 0}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}</span>
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* ── View Product Modal ── */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {viewProduct.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={viewProduct.images[0]} alt={viewProduct.name} className="h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {[
                ["Name", viewProduct.name],
                ["Category", viewProduct.category],
                ["Price", `$${Number(viewProduct.price).toFixed(2)}`],
                ["Original Price", viewProduct.originalPrice ? `$${Number(viewProduct.originalPrice).toFixed(2)}` : "—"],
                ["Stock", String(viewProduct.stock)],
                ["Status", viewProduct.status],
                ["Sales", String(viewProduct.sales)],
                ["Created", new Date(viewProduct.createdAt).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900 capitalize">{value}</span>
                </div>
              ))}
              {viewProduct.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{viewProduct.description}</p>
                </div>
              )}
              {viewProduct.tags && viewProduct.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {viewProduct.tags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <ActionButton variant="secondary" onClick={() => setViewProduct(null)}>Close</ActionButton>
              <ActionButton onClick={() => { setViewProduct(null); openEdit(viewProduct); }}>Edit Product</ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
