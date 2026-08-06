import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/service-card";
import { getProducts, getServices } from "@/lib/api";

export default async function HomePage() {
  const [services, products] = await Promise.all([getServices(), getProducts()]);

  return (
    <div>
      <section className="bg-ink px-4 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-brass">GLOSSIA GROUP</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight">لوك رجالي متكامل بلا تعقيد</h1>
            <p className="mt-4 text-white/80">احجز الموعد ديالك وزيد منتجات العناية لطلبك، والخلاص كلو كيدوز فالمحل بأمان.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/booking" className="rounded-full bg-ember px-5 py-3 font-bold text-white">احجز دابا</Link>
              <Link href="/shop" className="rounded-full border border-brass px-5 py-3 font-bold text-brass">شوف المنتجات</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6">
            <p className="text-sm text-white/70">خلاص فالمحل</p>
            <p className="mt-2 text-3xl font-extrabold text-brass">Cash / Card</p>
            <p className="mt-3 text-sm text-white/80">بلا دفع مسبق، غير أكد الحجز وجي فالوقت.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-2xl font-bold">الخدمات الأكثر طلبا</h2>
          <Link href="/services" className="text-sm font-bold text-ember">شوف الكل</Link>
        </div>
        <div className="snap-x-list flex gap-4 overflow-x-auto pb-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-2xl font-bold">منتجات العناية</h2>
          <Link href="/shop" className="text-sm font-bold text-ember">شوف الكل</Link>
        </div>
        <div className="snap-x-list flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
