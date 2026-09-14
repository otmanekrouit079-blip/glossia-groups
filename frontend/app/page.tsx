import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-card";
import { getProducts, getServices } from "@/lib/api";

export default async function HomePage() {
  const [services, products] = await Promise.all([getServices(), getProducts()]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-barber.jpg"
          alt=""
          className="absolute inset-0 h-full w-full bg-warm object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,26,43,0.75) 0%, rgba(7,26,43,0.88) 55%, #071a2b 100%), radial-gradient(60% 80% at 15% 20%, rgba(255,138,61,0.18), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col justify-center px-4 py-24 md:min-h-[640px]">
          <span className="badge-pill w-fit">✂️ صالون حلاقة رجالية</span>
          <h1 className="mt-6 max-w-2xl font-heading text-5xl font-extrabold leading-[1.1] text-ink md:text-6xl">
            لوك رجالي متكامل، <span className="text-brass">بلا تعقيد</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-textmuted">
            احجز الموعد ديالك وزيد منتجات العناية لطلبك، والخلاص كلو كيدوز فالمحل بأمان.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/booking" className="btn-gradient rounded-xl px-6 py-3.5 text-base">
              احجز موعدك الآن
            </Link>
            <Link href="/services" className="btn-outline rounded-xl px-6 py-3.5 text-base">
              اكتشف خدماتنا
            </Link>
          </div>

          <div className="card mt-10 w-fit p-4">
            <p className="text-xs text-textmuted">الخلاص فالمحل</p>
            <p className="mt-1 font-digits text-xl font-extrabold text-brass">Cash / Card</p>
            <p className="mt-1 text-xs leading-relaxed text-textmuted">بلا دفع مسبق، غير أكد الحجز وجي فالوقت.</p>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="border-y border-borderline bg-surface-alt">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-brass">💳</span>
              <div>
                <p className="font-bold text-ink">Cash / Card</p>
                <p className="text-xs text-textmuted">الخلاص فالمحل، بلا دفع مسبق</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-brass">⚡</span>
              <div>
                <p className="font-bold text-ink">حجز أونلاين</p>
                <p className="text-xs text-textmuted">أكد الموعد ديالك فدقيقتين</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-brass">📍</span>
              <div>
                <p className="font-bold text-ink">Casablanca</p>
                <p className="text-xs text-textmuted">Bd Mohammed V</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="badge-pill">الأكثر طلبا</p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold text-ink md:text-3xl">الخدمات</h2>
            </div>
            <Link href="/services" className="text-sm font-bold text-brass transition hover:text-brass-soft">
              شوف الكل ←
            </Link>
          </div>
          <div className="snap-x-list flex gap-4 overflow-x-auto pb-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden py-24">
          <img
            src="/images/hero-salon-interior.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #071a2b 0%, rgba(7,26,43,0.85) 40%, #071a2b 100%)" }}
          />
          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <span className="badge-pill">GLOSSIA GROUP</span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-ink md:text-4xl">
              أكثر من حلاقة. <span className="text-brass">تجربة.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-textmuted">
              كنآمنو أن العناية الرجالية ماشي رفاهية، ولكن أسلوب حياة. جمعنا بين خدمة صالون احترافية ومنتجات أصلية باش
              كل زبون يخرج بلوك مرتب وثقة أكبر.
            </p>
            <Link href="/about" className="mt-6 inline-flex text-sm font-bold text-brass transition hover:text-brass-soft">
              اقرا القصة كاملة ←
            </Link>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="badge-pill">أصلية 100%</p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold text-ink md:text-3xl">منتجات العناية</h2>
              <p className="mt-2 max-w-md text-sm text-textmuted">كمّل روتين العناية ديالك بمنتجات نقترحوها مع الخدمات.</p>
            </div>
            <Link href="/shop" className="text-sm font-bold text-brass transition hover:text-brass-soft">
              شوف الكل ←
            </Link>
          </div>
          <div className="snap-x-list flex gap-4 overflow-x-auto pb-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="hero-glow px-4 py-20 text-center">
          <h2 className="font-heading text-3xl font-extrabold text-ink md:text-4xl">
            واجد باش تبدل <span className="text-brass">اللوك ديالك؟</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-textmuted">أكد الحجز ديالك دابا وجي فالوقت، الخلاص فالمحل.</p>
          <Link href="/booking" className="btn-gradient mt-7 inline-flex rounded-xl px-7 py-3.5 text-base">
            احجز موعدك الآن
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
