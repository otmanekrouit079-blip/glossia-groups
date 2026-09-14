import Link from "next/link";
import { notFound } from "next/navigation";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { getServices, resolveImageUrl } from "@/lib/api";

type Props = { params: { slug: string } };

export default async function ServiceDetailsPage({ params }: Props) {
  const services = await getServices();
  const service = services.find((item) => item.slug === params.slug);

  if (!service) {
    notFound();
  }

  const imageSrc = resolveImageUrl(service.image_url);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="card p-8">
        {imageSrc ? (
          <img src={imageSrc} alt={service.name} className="mb-4 h-64 w-full rounded-2xl object-cover" />
        ) : (
          <ImagePlaceholder className="mb-4 h-64 w-full rounded-2xl" />
        )}
        <h1 className="font-heading text-3xl font-extrabold text-ink">{service.name}</h1>
        <p className="mt-2 text-textmuted">{service.description}</p>
        <p className="mt-4 font-digits text-2xl font-extrabold text-brass">{service.price} DH</p>
        <p className="text-sm text-textmuted">المدة: {service.duration_minutes} دقيقة</p>
        <Link href="/booking" className="btn-gradient mt-6 inline-flex rounded-xl px-5 py-3">احجز هاد الخدمة</Link>
      </div>
    </section>
  );
}
