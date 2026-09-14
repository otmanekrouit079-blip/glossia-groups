import Link from "next/link";
import { notFound } from "next/navigation";

import { getProducts, resolveImageUrl } from "@/lib/api";

type Props = { params: { slug: string } };

export default async function ProductDetailsPage({ params }: Props) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card p-8">
          <img
            src={resolveImageUrl(product.image_url)}
            alt={product.name}
            className="mb-4 h-64 w-full rounded-2xl object-cover"
          />
          <div className="badge-pill">باقي {product.stock} فالمخزون</div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink">{product.name}</h1>
          <p className="mt-2 text-textmuted">{product.short_description}</p>
          <p className="mt-4 text-sm text-textmuted">⭐ {product.rating} ({product.review_count} تقييم)</p>
          <div className="mt-6 space-y-2 rounded-2xl border border-borderline bg-surface-alt p-4 text-textmain">
            <p>قطعة وحدة: <span className="font-digits">{product.price_1} DH</span></p>
            <p>2 قطع: <span className="font-digits font-bold text-brass">{product.price_2} DH</span> (الأكثر طلبا)</p>
            <p>3 قطع: <span className="font-digits">{product.price_3} DH</span> (أفضل قيمة)</p>
          </div>
          <Link href="/booking" className="btn-gradient mt-6 block rounded-xl px-4 py-3 text-center">زيد للطلب</Link>
        </div>
        <div className="card space-y-4 p-8">
          <h2 className="font-heading text-2xl font-bold text-ink">كيفاش كيخدم</h2>
          <p className="text-textmuted">{product.long_description}</p>
          <h3 className="mt-4 font-heading text-xl font-bold text-ink">FAQ</h3>
          <p className="text-textmuted">الاستعمال اليومي كيعطي نتائج تدريجية من الأسبوع الثاني.</p>
        </div>
      </div>
    </section>
  );
}
