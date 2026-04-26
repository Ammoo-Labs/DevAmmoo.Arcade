"use client";
import { useState, useRef } from "react";
import { Package, Upload, X, AlertCircle, Eye, CheckCircle } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";
import { formatLKR } from "@/ui/components/product/currency";
import { LISTING_CATEGORIES } from "@/ui/components/product/categories";

interface FirstListingStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

function ImageSlot({
  label,
  required,
  preview,
  onSelect,
  onRemove,
}: {
  label: string;
  required: boolean;
  preview: string | null;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {preview ? (
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={onSelect}
            className="absolute bottom-1.5 right-1.5 bg-white border border-gray-300 text-xs font-medium text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 shadow"
          >
            Change
          </button>
        </div>
      ) : (
        <div
          onClick={onSelect}
          className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            required
              ? "border-gray-300 hover:border-black hover:bg-gray-50"
              : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <Upload className="w-6 h-6 text-gray-300 mb-1" />
          <p className="text-xs text-gray-400 text-center px-1">{label}</p>
        </div>
      )}
    </div>
  );
}

function PreviewModal({
  product,
  onClose,
  onConfirm,
}: {
  product: ShopWizardData["firstProduct"];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Listing Preview
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          This is how your listing will appear to customers.
        </p>

        {/* Card preview */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5 max-w-[200px] mx-auto">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            {product.frontImagePreview ? (
              <img
                src={product.frontImagePreview}
                alt="Front"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="p-2">
            <p className="text-xs font-medium text-gray-900 line-clamp-2">{product.name || "Product Name"}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {product.price ? formatLKR(parseFloat(product.price)) : "LKR —"}
            </p>
          </div>
        </div>

        {/* Detail preview */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 mb-5 space-y-2">
          <p className="text-sm font-bold text-gray-900">{product.name || "—"}</p>
          <p className="text-xs text-gray-500">Category: {product.category || "—"}</p>
          <p className="text-base font-bold">
            {product.price ? formatLKR(parseFloat(product.price)) : "—"}
          </p>
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-3">{product.description}</p>
          )}
          {(product.backImagePreview || (product.galleryPreviews && product.galleryPreviews.length > 0)) && (
            <div className="flex gap-1 pt-1">
              {[product.frontImagePreview, product.backImagePreview, ...(product.galleryPreviews || [])]
                .filter(Boolean)
                .map((src, i) => (
                  <div key={i} className="w-10 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={src!} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit Listing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Review & Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FirstListingStep({
  data,
  updateData,
  onNext,
  onPrev,
}: FirstListingStepProps) {
  const product = data.firstProduct;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const galleryRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const setField = <K extends keyof typeof product>(key: K, value: (typeof product)[K]) => {
    updateData({ firstProduct: { ...product, [key]: value } });
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const handleImageFile = (
    file: File,
    previewKey: "frontImagePreview" | "backImagePreview",
    fileKey: "frontImage" | "backImage"
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateData({
        firstProduct: {
          ...product,
          [fileKey]: file,
          [previewKey]: reader.result as string,
        },
      });
      setErrors((prev) => ({ ...prev, [fileKey]: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFile = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newFiles = [...(product.galleryImages || [])];
      const newPreviews = [...(product.galleryPreviews || [])];
      newFiles[index] = file;
      newPreviews[index] = reader.result as string;
      updateData({ firstProduct: { ...product, galleryImages: newFiles, galleryPreviews: newPreviews } });
    };
    reader.readAsDataURL(file);
  };

  const removeGallery = (index: number) => {
    const newFiles = [...(product.galleryImages || [])];
    const newPreviews = [...(product.galleryPreviews || [])];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    updateData({ firstProduct: { ...product, galleryImages: newFiles, galleryPreviews: newPreviews } });
  };

  const makeFileHandler =
    (
      previewKey: "frontImagePreview" | "backImagePreview",
      fileKey: "frontImage" | "backImage"
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageFile(file, previewKey, fileKey);
      e.target.value = "";
    };

  const makeGalleryHandler = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleGalleryFile(file, index);
    e.target.value = "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!product.name.trim()) newErrors.name = "Product name is required.";
    if (!product.category) newErrors.category = "Please select a category.";
    if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0)
      newErrors.price = "Enter a valid price greater than 0.";
    if (!product.description.trim()) newErrors.description = "Description is required.";
    if (!product.frontImagePreview) newErrors.frontImage = "Front-look image is required.";
    if (!product.backImagePreview) newErrors.backImage = "Back-look image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validate()) setShowPreview(true);
  };

  const handleConfirm = () => {
    setShowPreview(false);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black mb-6">
          <Package className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Your First Listing</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your shop must have at least one active listing before it goes live
        </p>
      </div>

      <div className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Classic White T-Shirt"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={product.category}
            onChange={(e) => setField("category", e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black ${
              errors.category ? "border-red-400" : "border-gray-300"
            }`}
          >
            <option value="">Select a category...</option>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Price (LKR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
              LKR
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={product.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="0"
              className={`w-full pl-12 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                errors.price ? "border-red-400" : "border-gray-300"
              }`}
            />
          </div>
          {errors.price && <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={product.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Describe your product — materials, size, features..."
            rows={4}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none ${
              errors.description ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-3">
            Product Images
          </label>

          {/* Front + Back (required) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <ImageSlot
                label="Front Look"
                required
                preview={product.frontImagePreview || null}
                onSelect={() => frontRef.current?.click()}
                onRemove={() =>
                  updateData({
                    firstProduct: { ...product, frontImage: null, frontImagePreview: null },
                  })
                }
              />
              {errors.frontImage && (
                <p className="mt-1 text-xs text-red-600">{errors.frontImage}</p>
              )}
            </div>
            <div>
              <ImageSlot
                label="Back Look"
                required
                preview={product.backImagePreview || null}
                onSelect={() => backRef.current?.click()}
                onRemove={() =>
                  updateData({
                    firstProduct: { ...product, backImage: null, backImagePreview: null },
                  })
                }
              />
              {errors.backImage && (
                <p className="mt-1 text-xs text-red-600">{errors.backImage}</p>
              )}
            </div>
          </div>

          {/* Gallery (optional, up to 3) */}
          <p className="text-xs text-gray-500 mb-2">Additional images (optional, up to 3)</p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <ImageSlot
                key={i}
                label={`Photo ${i + 3}`}
                required={false}
                preview={product.galleryPreviews?.[i] ?? null}
                onSelect={() => galleryRefs[i].current?.click()}
                onRemove={() => removeGallery(i)}
              />
            ))}
          </div>

          {/* Hidden inputs */}
          <input
            ref={frontRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={makeFileHandler("frontImagePreview", "frontImage")}
            className="hidden"
          />
          <input
            ref={backRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={makeFileHandler("backImagePreview", "backImage")}
            className="hidden"
          />
          {galleryRefs.map((ref, i) => (
            <input
              key={i}
              ref={ref}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={makeGalleryHandler(i)}
              className="hidden"
            />
          ))}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Front and back-look images are required. You can add more listings after your shop is
            approved. Preview your listing before submitting to see exactly how customers will see it.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview Listing
          </button>
        </div>
      </div>

      {showPreview && (
        <PreviewModal product={product} onClose={() => setShowPreview(false)} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
