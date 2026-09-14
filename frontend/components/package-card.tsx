import Link from "next/link";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { resolveImageUrl, type Package } from "@/lib/api";

type PackageCardProps = {
  pkg: Package;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const contents = [...pkg.service_names, ...pkg.product_names];
  const imageSrc = resolveImageUrl(pkg.image_url);

  return (
    <article className="card card-hover min-w-[85%] overflow-hidden p-4 md:min-w-[300px]">
      <div className="relative overflow-hidden rounded-xl">
        {imageSrc ? (
          <img src={imageSrc} alt={pkg.name} className="h-40 w-full object-cover" />
        ) : (
          <ImagePlaceholder className="h-40 w-full" />
        )}
        <span className="badge-gradient absolute right-2 top-2 shadow">باقة</span>
      </div>
      <h3 className="mt-3 font-heading text-lg font-bold text-ink">{pkg.name}</h3>
      {pkg.description ? <p className="mt-1 text-sm text-textmuted">{pkg.description}</p> : null}
      {contents.length > 0 ? (
        <p className="mt-2 text-sm text-textmuted">{contents.join(" + ")}</p>
      ) : null}
      <div className="mt-3">
        <span className="font-digits text-xl font-extrabold text-brass">{pkg.price} DH</span>
      </div>
      <Link href="/booking" className="btn-gradient mt-4 block rounded-xl px-3 py-2.5 text-center text-sm">
        احجز هاد الباقة
      </Link>
    </article>
  );
}
