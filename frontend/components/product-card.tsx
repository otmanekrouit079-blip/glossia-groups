import Link from "next/link";

import type { Product } from "@/lib/api";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="min-w-[85%] rounded-2xl border border-borderline bg-white p-4 shadow-sm transition hover:scale-[1.02] md:min-w-[320px]">
      <div className="mb-3 inline-flex rounded-full bg-ember px-2 py-1 text-xs font-bold text-white">خصم 30%</div>
      <h3 className="line-clamp-2 font-heading text-lg font-bold text-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-textmuted">{product.short_description}</p>
      <p className="mt-2 text-sm text-textmuted">⭐ {product.rating} ({product.review_count} تقييم)</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-digits text-xl font-extrabold text-ember">{product.price_2} DH</span>
        <span className="font-digits text-sm text-textmuted line-through">{product.price_1} DH</span>
      </div>
      <p className="mt-2 text-xs font-semibold text-ember">باقي {product.stock} فالمخزون</p>
      <Link href={`/shop/${product.slug}`} className="mt-4 block rounded-xl bg-ink px-3 py-2 text-center text-sm font-bold text-white">
        زيد للطلب
      </Link>
    </article>
  );
}
