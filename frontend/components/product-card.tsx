import Link from "next/link";

import { resolveImageUrl, type Product } from "@/lib/api";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card card-hover min-w-[85%] overflow-hidden p-4 md:min-w-[320px]">
      <div className="relative overflow-hidden rounded-xl">
        <img src={resolveImageUrl(product.image_url)} alt={product.name} className="h-40 w-full object-cover" />
        <span className="badge-gradient absolute right-2 top-2 shadow">خصم 30%</span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-heading text-lg font-bold text-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-textmuted">{product.short_description}</p>
      <p className="mt-2 text-sm text-textmuted">⭐ {product.rating} ({product.review_count} تقييم)</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-digits text-xl font-extrabold text-brass">{product.price_2} DH</span>
        <span className="font-digits text-sm text-textmuted line-through">{product.price_1} DH</span>
      </div>
      <p className="mt-2 badge-pill">باقي {product.stock} فالمخزون</p>
      <Link href={`/shop/${product.slug}`} className="btn-gradient mt-4 block rounded-xl px-3 py-2.5 text-center text-sm">
        زيد للطلب
      </Link>
    </article>
  );
}
