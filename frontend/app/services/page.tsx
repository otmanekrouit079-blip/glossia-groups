import { ServiceCard } from "@/components/service-card";
import { getServices } from "@/lib/api";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold">الخدمات</h1>
      <p className="mt-2 text-textmuted">اختار الخدمة اللي كتوافقك وكمّل الحجز فخطوات بسيطة.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
