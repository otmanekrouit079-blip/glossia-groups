import { GalleryGrid } from "@/components/gallery-grid";
import { getProducts, getServices } from "@/lib/api";

export default async function GalleryPage() {
  const [services, products] = await Promise.all([getServices(), getProducts()]);
  const items = [
    ...services.map((service) => ({ id: service.id, name: service.name, image: service.image_url })),
    ...products.map((product) => ({ id: product.id, name: product.name, image: product.image_url })),
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <span className="badge-pill">GLOSSIA GROUP</span>
      <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">معرض الصور</h1>
      <p className="mt-3 max-w-lg text-textmuted">لمحة على الخدمات والمنتوجات ديالنا. كليكي على أي صورة باش تكبرها.</p>

      {items.length > 0 ? (
        <GalleryGrid items={items} />
      ) : (
        <p className="mt-10 text-textmuted">مازال ماكاينش تصاور مضافة.</p>
      )}
    </section>
  );
}
