import Link from "next/link";
import { notFound } from "next/navigation";

import { getServices } from "@/lib/api";

type Props = { params: { slug: string } };

export default async function ServiceDetailsPage({ params }: Props) {
  const services = await getServices();
  const service = services.find((item) => item.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border border-borderline bg-white p-8">
        <h1 className="font-heading text-3xl font-extrabold">{service.name}</h1>
        <p className="mt-2 text-textmuted">{service.description}</p>
        <p className="mt-4 font-digits text-2xl font-extrabold text-deepgreen">{service.price} DH</p>
        <p className="text-sm text-textmuted">المدة: {service.duration_minutes} دقيقة</p>
        <Link href="/booking" className="mt-6 inline-block rounded-xl bg-ember px-5 py-3 font-bold text-white">احجز هاد الخدمة</Link>
      </div>
    </section>
  );
}
