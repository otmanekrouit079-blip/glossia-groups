import Link from "next/link";

import { resolveImageUrl, type Service } from "@/lib/api";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="card card-hover min-w-[85%] overflow-hidden p-4 md:min-w-[280px]">
      <div className="overflow-hidden rounded-xl">
        <img src={resolveImageUrl(service.image_url)} alt={service.name} className="h-40 w-full object-cover" />
      </div>
      <h3 className="mt-3 font-heading text-lg font-bold text-ink">{service.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-textmuted">{service.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-digits text-xl font-extrabold text-brass">{service.price} DH</span>
        <span className="text-xs text-textmuted">{service.duration_minutes} دقيقة</span>
      </div>
      <Link href={`/services/${service.slug}`} className="btn-gradient mt-4 block rounded-xl px-3 py-2.5 text-center text-sm">
        احجز هاد الخدمة
      </Link>
    </article>
  );
}
