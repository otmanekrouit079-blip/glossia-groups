import { PackageCard } from "@/components/package-card";
import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/service-card";
import { getPackages, getProducts, getServices } from "@/lib/api";

export default async function ShopPage() {
  const [packages, services, products] = await Promise.all([
    getPackages(),
    getServices(),
    getProducts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {packages.length > 0 ? (
        <section>
          <span className="badge-pill">أحسن تمن</span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">الباقات</h1>
          <p className="mt-3 max-w-lg text-textmuted">باقات كاملة كتجمع بين الخدمات والمنتوجات بأحسن تمن.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20">
        <span className="badge-pill">خدمات GLOSSIA</span>
        <h2 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">الخدمات</h2>
        <p className="mt-3 max-w-lg text-textmuted">اختار الخدمة اللي كتوافقك وكمّل الحجز فخطوات بسيطة.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <span className="badge-pill">أصلية 100%</span>
        <h2 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">المنتوجات</h2>
        <p className="mt-3 max-w-lg text-textmuted">منتجات أصلية للعناية بالشعر والبشرة واللحية.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
