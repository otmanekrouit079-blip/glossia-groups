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
    <div className="mx-auto max-w-6xl px-4 py-12">
      {packages.length > 0 ? (
        <section>
          <h1 className="font-heading text-3xl font-extrabold text-ink">الباقات</h1>
          <p className="mt-2 text-textmuted">باقات كاملة كتجمع بين الخدمات والمنتوجات بأحسن تمن.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <h2 className="font-heading text-3xl font-extrabold text-ink">الخدمات</h2>
        <p className="mt-2 text-textmuted">اختار الخدمة اللي كتوافقك وكمّل الحجز فخطوات بسيطة.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-heading text-3xl font-extrabold text-ink">المنتوجات</h2>
        <p className="mt-2 text-textmuted">منتجات أصلية للعناية بالشعر والبشرة واللحية.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
