"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { ActionButton, IconButton } from "@/ui/components/button";
import { Product } from "./types";
import { useCart } from "@/ui/components/cart";
import { sampleProducts } from "./sample-data";
import ProductCard from "./product-card";

interface ProductDetailsProps {
  product: Product;
  onBack?: () => void;
}

export default function ProductDetails({ product, onBack }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);

  // Sample additional images for demo
  const images = [
    product.image,
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400"
  ];

  // Sample sizes and colors for demo
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["Black", "White", "Navy", "Gray"];

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Images */}
          <div className="mb-6 lg:mb-0">
            {/* Main Image */}
            <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto">
              <Image
                src={typeof images[selectedImage] === 'string' ? images[selectedImage] : images[selectedImage].src}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-black text-white text-sm px-3 py-1 rounded">
                  -{discountPercentage}%
                </span>
              )}
              <IconButton
                icon="custom"
                customIcon={<Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />}
                onClick={handleLike}
                className="absolute top-4 right-4 bg-white shadow-lg"
                size="sm"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-black" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={typeof image === 'string' ? image : image.src}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:pl-6">
            {/* Store Name */}
            {product.store && (
              <p className="text-sm text-gray-500 mb-2">{product.store}</p>
            )}

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Creator */}
            <p className="text-base text-gray-600 mb-3">by {product.creator}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-green-600 font-medium">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <ActionButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center space-x-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </ActionButton>

              <ActionButton variant="secondary" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </ActionButton>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sampleProducts
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map(similarProduct => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  isLiked={similarProduct.isLiked}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}