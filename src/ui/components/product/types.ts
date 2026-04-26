import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string | StaticImageData;
  image2?: string | StaticImageData;
  category: string;
  description?: string;
  isNew?: boolean;
  isLiked?: boolean;
  inStock?: boolean;
  discount?: number;
  store?: string;
  tags?: string[];
}

export interface ProductCardProps {
  product: Product;
  onLike?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  isLiked?: boolean;
  showQuickActions?: boolean;
  showStore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'detailed';
}