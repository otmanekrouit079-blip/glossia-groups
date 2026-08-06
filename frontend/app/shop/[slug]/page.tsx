import Link from "next/link";
import { notFound } from "next/navigation";

import { getProducts } from "@/lib/api";

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
        <div className="rounded-3xl border border-borderline bg-white p-8">
          <div className="inline-flex rounded-full bg-ember px-2 py-1 text-xs font-bold text-white">باقي {product.stock} فالمخزون</div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold">{product.name}</h1>
          <p className="mt-2 text-textmuted">{product.short_description}</p>
          <p className="mt-4 text-sm text-textmuted">⭐ {product.rating} ({product.review_count} تقييم)</p>
          <div className="mt-6 space-y-2 rounded-2xl bg-warm p-4">
            <p>قطعة وحدة: <span className="font-digits">{product.price_1} DH</span></p>
            <p>2 قطع: <span className="font-digits">{product.price_2} DH</span> (الأكثر طلبا)</p>
            <p>3 قطع: <span className="font-digits">{product.price_3} DH</span> (أفضل قيمة)</p>
          </div>
          <Link href="/booking" className="mt-6 block rounded-xl bg-ember px-4 py-3 text-center font-bold text-white">زيد للطلب</Link>
        </div>
        <div className="space-y-4 rounded-3xl border border-borderline bg-white p-8">
          <h2 className="font-heading text-2xl font-bold">كيفاش كيخدم</h2>
          <p className="text-textmuted">{product.long_description}</p>
          <h3 className="mt-4 font-heading text-xl font-bold">FAQ</h3>
          <p className="text-textmuted">الاستعمال اليومي كيعطي نتائج تدريجية من الأسبوع الثاني.</p>
        </div>
      </div>
    </section>
  );
}
