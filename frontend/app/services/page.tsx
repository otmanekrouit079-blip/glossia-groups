import { ServiceCard } from "@/components/service-card";
import { getServices } from "@/lib/api";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <span className="badge-pill">خدمات GLOSSIA</span>
      <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">الخدمات</h1>
      <p className="mt-3 max-w-lg text-textmuted">اختار الخدمة اللي كتوافقك وكمّل الحجز فخطوات بسيطة.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
