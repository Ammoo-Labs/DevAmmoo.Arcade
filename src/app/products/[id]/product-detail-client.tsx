"use client";

import { useRouter } from "next/navigation";
import { ProductDetails } from "@/ui/components/product";
import { Product } from "@/ui/components/product/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <ProductDetails
      product={product}
      onBack={() => router.back()}
    />
  );
}
