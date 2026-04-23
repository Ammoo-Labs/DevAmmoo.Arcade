"use client";
import { useState, useRef } from "react";
import { Package, Upload, X, AlertCircle } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";

interface FirstListingStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CATEGORIES = [
  "Men",
  "Women",
  "Unisex",
  "Electronics",
  "Accessories",
  "Jewelry",
  "Home Decor",
  "Footwear",
  "Gaming",
  "Books",
  "Sports",
  "Beauty",
  "Other",
];

export default function FirstListingStep({
  data,
  updateData,
  onNext,
  onPrev,
}: FirstListingStepProps) {
  const product = data.firstProduct ?? {
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
    imagePreview: null,
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof typeof product>(key: K, value: (typeof product)[K]) => {
    updateData({ firstProduct: { ...product, [key]: value } });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateData({
        firstProduct: {
          ...product,
          image: file,
          imagePreview: reader.result as string,
        },
      });
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    updateData({ firstProduct: { ...product, image: null, imagePreview: null } });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!product.name.trim()) newErrors.name = "Product name is required.";
    if (!product.category) newErrors.category = "Please select a category.";
    if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0)
      newErrors.price = "Enter a valid price greater than 0.";
    if (!product.description.trim()) newErrors.description = "Description is required.";
    if (!product.imagePreview) newErrors.image = "A product image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
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
          {errors.name && <ErrorMsg msg={errors.name} />}
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
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <ErrorMsg msg={errors.category} />}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={product.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="0.00"
              className={`w-full pl-7 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                errors.price ? "border-red-400" : "border-gray-300"
              }`}
            />
          </div>
          {errors.price && <ErrorMsg msg={errors.price} />}
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
          {errors.description && <ErrorMsg msg={errors.description} />}
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">
            Product Image <span className="text-red-500">*</span>
          </label>

          {product.imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={product.imagePreview}
                alt="Product preview"
                className="w-full h-48 object-contain p-4"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-white border border-gray-300 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow"
              >
                Change
              </button>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                errors.image
                  ? "border-red-300 hover:border-red-400 hover:bg-red-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload product image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG · max 5 MB</p>
            </div>
          )}
          {errors.image && <ErrorMsg msg={errors.image} />}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            You can add more listings after your shop is approved. This first listing ensures your
            storefront isn&apos;t empty when customers visit.
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
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
      <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center flex-shrink-0">
        !
      </span>
      {msg}
    </p>
  );
}
