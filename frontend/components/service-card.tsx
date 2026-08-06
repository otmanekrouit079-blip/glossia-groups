import Link from "next/link";

import type { Service } from "@/lib/api";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="min-w-[85%] rounded-2xl border border-borderline bg-white p-4 shadow-sm transition hover:scale-[1.02] md:min-w-[280px]">
      <h3 className="font-heading text-lg font-bold text-ink">{service.name}</h3>
      <p className="mt-2 text-sm text-textmuted">{service.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-digits text-xl font-extrabold text-deepgreen">{service.price} DH</span>
        <span className="text-xs text-textmuted">{service.duration_minutes} دقيقة</span>
      </div>
      <Link href={`/services/${service.slug}`} className="mt-4 block rounded-xl bg-ember px-3 py-2 text-center text-sm font-bold text-white">
        احجز هاد الخدمة
      </Link>
    </article>
  );
}
