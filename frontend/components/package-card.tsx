import Link from "next/link";

import { resolveImageUrl, type Package } from "@/lib/api";

type PackageCardProps = {
  pkg: Package;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const contents = [...pkg.service_names, ...pkg.product_names];

  return (
    <article className="card card-hover min-w-[85%] p-4 md:min-w-[300px]">
      <img
        src={resolveImageUrl(pkg.image_url)}
        alt={pkg.name}
        className="mb-3 h-40 w-full rounded-xl object-cover"
      />
      <div className="mb-3 badge-gradient">باقة</div>
      <h3 className="font-heading text-lg font-bold text-ink">{pkg.name}</h3>
      {pkg.description ? <p className="mt-1 text-sm text-textmuted">{pkg.description}</p> : null}
      {contents.length > 0 ? (
        <p className="mt-2 text-sm text-textmuted">{contents.join(" + ")}</p>
      ) : null}
      <div className="mt-3">
        <span className="font-digits text-xl font-extrabold text-brass">{pkg.price} DH</span>
      </div>
      <Link href="/booking" className="btn-gradient mt-4 block rounded-xl px-3 py-2 text-center text-sm">
        احجز هاد الباقة
      </Link>
    </article>
  );
}
