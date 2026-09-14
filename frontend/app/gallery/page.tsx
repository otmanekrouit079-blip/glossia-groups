import { ImagePlaceholder } from "@/components/image-placeholder";
import { getProducts, getServices, resolveImageUrl } from "@/lib/api";

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
      <p className="mt-3 max-w-lg text-textmuted">لمحة على الخدمات والمنتوجات ديالنا.</p>

      {items.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageSrc = resolveImageUrl(item.image);
            return (
              <div key={item.id} className="card card-hover overflow-hidden p-2">
                <div className="overflow-hidden rounded-2xl">
                  {imageSrc ? (
                    <img src={imageSrc} alt={item.name} className="h-64 w-full object-cover" />
                  ) : (
                    <ImagePlaceholder className="h-64 w-full" />
                  )}
                </div>
                <p className="p-3 font-heading font-bold text-ink">{item.name}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-textmuted">مازال ماكاينش تصاور مضافة.</p>
      )}
    </section>
  );
}
