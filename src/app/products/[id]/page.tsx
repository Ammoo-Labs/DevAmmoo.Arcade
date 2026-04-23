import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { allProducts } from "@/ui/components/product/all-products";

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product!} />;
}
