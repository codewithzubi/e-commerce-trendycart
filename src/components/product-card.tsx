import { Product } from "@/types";
import { ProductCardContent } from "./product-card-content";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return <ProductCardContent product={product} />;
}
