"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getBranches, getProducts, getServices, type Branch, type Product, type Service } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AvailabilityItem = {
  time: string;
  available: boolean;
};

export default function BookingPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slots, setSlots] = useState<AvailabilityItem[]>([]);

  const [branchId, setBranchId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ product_id: string; quantity: number }[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      const [branchesData, servicesData, productsData] = await Promise.all([getBranches(), getServices(), getProducts()]);
      setBranches(branchesData);
      setServices(servicesData);
      setProducts(productsData);
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function loadSlots() {
      if (!branchId || !date) {
        setSlots([]);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/availability/?branch_id=${branchId}&date=${date}`);
        if (!res.ok) {
          throw new Error("availability request failed");
        }
        setSlots(await res.json());
      } catch {
        setSlots([
          { time: "10:00", available: true },
          { time: "10:30", available: true },
          { time: "11:00", available: true },
          { time: "11:30", available: false },
          { time: "12:00", available: true },
        ]);
      }
    }
    loadSlots();
  }, [branchId, date]);

  const total = useMemo(() => {
    const serviceTotal = services
      .filter((svc) => serviceIds.includes(svc.id))
      .reduce((acc, svc) => acc + Number(svc.price), 0);

    const productTotal = selectedProducts.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) return acc;
      if (item.quantity === 1) return acc + Number(product.price_1);
      if (item.quantity === 2) return acc + Number(product.price_2);
      return acc + Number(product.price_3);
    }, 0);

    return serviceTotal + productTotal;
  }, [products, selectedProducts, serviceIds, services]);

  function toggleService(serviceId: string) {
    setServiceIds((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]));
  }

  function setProductQuantity(productId: string, quantity: number) {
    setSelectedProducts((prev) => {
      const without = prev.filter((item) => item.product_id !== productId);
      if (quantity === 0) return without;
      return [...without, { product_id: productId, quantity }];
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const response = await fetch(`${API_URL}/api/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch_id: branchId,
        service_ids: serviceIds,
        products: selectedProducts,
        booking_date: date,
        booking_time: `${time}:00`,
        client_name: clientName,
        client_phone: clientPhone,
        note,
      }),
    });

    if (!response.ok) {
      setSubmitting(false);
      alert("وقع خطأ فالحجز. تأكد من المعلومات.");
      return;
    }

    const booking = await response.json();
    router.push(`/order-confirmed?bookingId=${booking.id}`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-ink">حجز الموعد</h1>
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">1) اختار الفرع</h2>
          <select className="w-full rounded-xl border border-borderline p-3" value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
            <option value="">اختار فرع</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">2) اختار الخدمة</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 rounded-xl border border-borderline bg-surface-alt p-3">
                <input type="checkbox" checked={serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} />
                <span>{service.name} ({service.price} DH)</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">3) التاريخ والوقت</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-borderline p-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <select className="rounded-xl border border-borderline p-3" value={time} onChange={(e) => setTime(e.target.value)} required>
              <option value="">اختار الوقت</option>
              {slots.filter((slot) => slot.available).map((slot) => (
                <option key={slot.time} value={slot.time}>{slot.time}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">4) منتجات إضافية</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-borderline bg-surface-alt p-3">
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="text-sm text-textmuted">1: {product.price_1} DH | 2: {product.price_2} DH | 3: {product.price_3} DH</p>
                <select className="mt-2 w-full rounded-lg border border-borderline p-2" onChange={(e) => setProductQuantity(product.id, Number(e.target.value))} defaultValue="0">
                  <option value="0">ما بغيتش</option>
                  <option value="1">قطعة وحدة</option>
                  <option value="2">جوج قطع</option>
                  <option value="3">3 قطع</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">5) المعلومات الشخصية</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-borderline p-3" placeholder="الاسم الكامل" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            <input className="rounded-xl border border-borderline p-3" placeholder="06XXXXXXXX" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
          </div>
          <textarea className="mt-3 w-full rounded-xl border border-borderline p-3" placeholder="ملاحظة (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="card border-t-4 border-t-brass p-5">
          <h2 className="font-bold text-ink">6) الملخص</h2>
          <p className="mt-2 text-textmain">المجموع: <span className="font-digits text-xl font-extrabold text-brass">{total.toFixed(2)} DH</span></p>
          <p className="text-sm text-textmuted">الخلاص فالمحل: Cash/Card</p>
          <button disabled={submitting} className="btn-gradient mt-4 w-full rounded-xl px-4 py-3">
            {submitting ? "...جاري التأكيد" : "أكد الحجز"}
          </button>
        </div>
      </form>
    </section>
  );
}
