"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  X,
  Ruler,
  User,
} from "lucide-react";
import { Product } from "./types";
import { useCart } from "@/ui/components/cart";
import { sampleProducts } from "./sample-data";
import ProductCard from "./product-card";
import { formatLKR } from "./currency";

interface ProductDetailsProps {
  product: Product;
  onBack?: () => void;
}

const SIZE_GUIDE = [
  { size: "XS", bust: "76-80", waist: "60-64", hips: "86-90", length: "58" },
  { size: "S", bust: "82-86", waist: "66-70", hips: "92-96", length: "60" },
  { size: "M", bust: "88-92", waist: "72-76", hips: "98-102", length: "62" },
  { size: "L", bust: "94-98", waist: "78-82", hips: "104-108", length: "64" },
  { size: "XL", bust: "100-104", waist: "84-88", hips: "110-114", length: "66" },
];

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const convert = (cm: string) => {
    if (unit === "cm") return cm;
    return cm
      .split("-")
      .map((v) => (parseInt(v) / 2.54).toFixed(1))
      .join("-");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Ruler className="w-5 h-5" /> Size Guide
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors uppercase ${
                unit === u ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-gray-50">
                {["Size", `Bust (${unit})`, `Waist (${unit})`, `Hips (${unit})`, `Length (${unit})`].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-3 px-3 text-left font-semibold text-gray-900 border border-gray-200 first:text-left"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-3 text-left font-bold border border-gray-200">{row.size}</td>
                  <td className="py-3 px-3 border border-gray-200">{convert(row.bust)}</td>
                  <td className="py-3 px-3 border border-gray-200">{convert(row.waist)}</td>
                  <td className="py-3 px-3 border border-gray-200">{convert(row.hips)}</td>
                  <td className="py-3 px-3 border border-gray-200">{convert(row.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Measurements are approximate. Compare with your own measurements for best fit.
        </p>
      </div>
    </div>
  );
}

function FitFinderModal({
  onClose,
  onRecommend,
}: {
  onClose: () => void;
  onRecommend: (size: string) => void;
}) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [shape, setShape] = useState<"petite" | "regular" | "plus" | "">("");
  const [result, setResult] = useState<string | null>(null);

  const findSize = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || !shape) return;
    const bmi = w / (h / 100) ** 2;
    let size: string;
    if (shape === "petite") {
      size = bmi < 20 ? "XS" : bmi < 24 ? "S" : bmi < 28 ? "M" : "L";
    } else if (shape === "plus") {
      size = bmi < 27 ? "L" : "XL";
    } else {
      size = bmi < 18.5 ? "XS" : bmi < 22 ? "S" : bmi < 26 ? "M" : bmi < 30 ? "L" : "XL";
    }
    setResult(size);
  };

  const applySize = () => {
    if (result) { onRecommend(result); onClose(); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" /> Fit Finder
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 165"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 60"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
              <div className="flex gap-2">
                {(["petite", "regular", "plus"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`flex-1 py-2 text-sm font-medium border rounded-lg capitalize transition-colors ${
                      shape === s
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={findSize}
              disabled={!height || !weight || !shape}
              className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Find My Size
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold">{result}</span>
            </div>
            <p className="font-semibold text-gray-900 text-lg mb-1">Recommended: {result}</p>
            <p className="text-sm text-gray-500 mb-5">Based on your measurements</p>
            <div className="flex gap-3">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Try Again
              </button>
              <button
                onClick={applySize}
                className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800"
              >
                Select {result}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetails({ product, onBack }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFitFinder, setShowFitFinder] = useState(false);

  const toSrc = (img: typeof product.image) =>
    typeof img === "string" ? img : img.src;

  const images = [
    product.image,
    ...(product.image2 ? [product.image2] : []),
    `https://picsum.photos/seed/${product.id}-detail-a/400/500`,
    `https://picsum.photos/seed/${product.id}-detail-b/400/500`,
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["Black", "White", "Navy", "Gray"];

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: String(product.id),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: [typeof product.image === "string" ? product.image : ""],
        shopName: product.store,
      },
      quantity,
      selectedSize,
      selectedColor,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10 lg:items-start">
          {/* Left — Sticky Image Column */}
          <div className="lg:sticky lg:top-20 mb-8 lg:mb-0">
            {/* Main image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3">
              <Image
                src={toSrc(images[selectedImage])}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-black text-white text-sm px-3 py-1 rounded">
                  -{discountPercentage}%
                </span>
              )}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={toSrc(img)}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Product Details */}
          <div className="lg:pt-2">
            {product.store && (
              <a
                href={`/shop/${product.store.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black hover:underline mb-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                </svg>
                {product.store} — Visit Store →
              </a>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-3">by {product.creator}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <span className="text-2xl font-bold text-gray-900">{formatLKR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatLKR(product.originalPrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Color */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Color:{" "}
                <span className="font-normal text-gray-600">{selectedColor || "Select"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Size:{" "}
                <span className="font-normal text-gray-600">{selectedSize || "Select"}</span>
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
                <button
                  onClick={() => setShowFitFinder(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                >
                  <User className="w-3.5 h-3.5" /> Fit Finder
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-12 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-500 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-100 pt-5 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-400">over LKR 16,000</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-400">100% protected</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-400">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleProducts
              .filter((p) => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      </div>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
      {showFitFinder && (
        <FitFinderModal
          onClose={() => setShowFitFinder(false)}
          onRecommend={(size) => setSelectedSize(size)}
        />
      )}
    </div>
  );
}
