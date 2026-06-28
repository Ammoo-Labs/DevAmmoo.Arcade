import { StaticImageData } from "next/image";
import { BackendProduct } from "@/lib/api/types";

export interface Product {
  id: string;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string | StaticImageData;
  image2?: string | StaticImageData;
  images?: string[];
  category: string;
  description?: string;
  isNew?: boolean;
  isLiked?: boolean;
  inStock?: boolean;
  discount?: number;
  store?: string;
  storeSlug?: string;
  tags?: string[];
}

export interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  isLiked?: boolean;
  showQuickActions?: boolean;
  showStore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'detailed';
}

// Maps a backend product (Prisma Decimal fields come back as strings) to the
// local UI Product shape used by ProductCard / ProductDetails.
export function mapBackendProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    creator: p.shop?.shopName ?? "",
    price: Number(p.price),
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    rating: Number(p.rating),
    reviews: p.reviewCount,
    image: p.images[0] ?? "",
    image2: p.images[1] ?? p.images[0] ?? "",
    images: p.images,
    category: p.category,
    description: p.description,
    isNew: p.isNew,
    inStock: p.stock > 0 && p.status === "active",
    store: p.shop?.shopName,
    storeSlug: p.shop?.slug,
    tags: p.tags,
  };
}