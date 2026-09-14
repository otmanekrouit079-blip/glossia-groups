import Link from "next/link";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { resolveImageUrl, type Product } from "@/lib/api";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = resolveImageUrl(product.image_url);

  return (
    <article className="card card-hover min-w-[85%] overflow-hidden p-4 md:min-w-[320px]">
      <div className="relative overflow-hidden rounded-xl">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className="h-40 w-full object-cover" />
        ) : (
          <ImagePlaceholder className="h-40 w-full" />
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 font-heading text-lg font-bold text-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-textmuted">{product.short_description}</p>
      {product.review_count > 0 ? (
        <p className="mt-2 text-sm text-textmuted">⭐ {product.rating} ({product.review_count} تقييم)</p>
      ) : null}
      <div className="mt-3">
        <span className="font-digits text-xl font-extrabold text-brass">{product.price_1} DH</span>
      </div>
      <p className="mt-1 text-xs text-textmuted">2 قطع بـ {product.price_2} DH</p>
      <p className="mt-2 badge-pill">باقي {product.stock} فالمخزون</p>
      <Link href={`/shop/${product.slug}`} className="btn-gradient mt-4 block rounded-xl px-3 py-2.5 text-center text-sm">
        زيد للطلب
      </Link>
    </article>
  );
}
