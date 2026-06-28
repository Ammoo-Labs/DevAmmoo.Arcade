import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { getProduct } from "@/lib/api/products";
import { mapBackendProduct } from "@/ui/components/product/types";
import { ApiError } from "@/lib/api/client";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const backendProduct = await getProduct(id);
    const product = mapBackendProduct(backendProduct);
    return <ProductDetailClient product={product} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
