"use client";

import { useEffect, useMemo, useState } from "react";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { SelectionModal } from "@/components/selection-modal";
import {
  getBranches,
  getProducts,
  getServices,
  getStaff,
  resolveImageUrl,
  type Branch,
  type Product,
  type Service,
  type Staff,
} from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AvailabilityItem = { time: string; available: boolean };

type CouponState = {
  code: string;
  valid: boolean;
  message: string;
  discountType?: "percent" | "fixed";
  discountValue?: number;
};

function nextDays(count: number) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("ar-MA", { weekday: "long", day: "numeric", month: "long" }).format(d);
    days.push({ iso, label });
  }
  return days;
}

function FieldButton({
  label,
  value,
  placeholder,
  onClick,
  disabled,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-textmuted">{label}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-right transition disabled:opacity-40 ${
          value ? "border-brass/40 bg-surface-alt" : "border-borderline bg-surface-alt"
        }`}
      >
        <span className={`font-bold ${value ? "text-ink" : "text-textmuted"}`}>
          {value ? `✓ ${value}` : placeholder}
        </span>
        <span className="text-textmuted">›</span>
      </button>
    </div>
  );
}

export default function BookingPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<AvailabilityItem[]>([]);

  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [staffPreference, setStaffPreference] = useState<"" | "has" | "any">("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{ product_id: string; quantity: number }[]>([]);

  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [barberModalOpen, setBarberModalOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  const [bookingId, setBookingId] = useState("");
  const [devConfirmationCode, setDevConfirmationCode] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const branchId = branches[0]?.id || "";
  const days = useMemo(() => nextDays(14), []);

  useEffect(() => {
    async function loadInitial() {
      const [branchesData, servicesData, productsData, staffData] = await Promise.all([
        getBranches(),
        getServices(),
        getProducts(),
        getStaff(),
      ]);
      setBranches(branchesData);
      setServices(servicesData);
      setProducts(productsData);
      setStaffList(staffData.filter((member) => member.active));
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
        if (!res.ok) throw new Error("failed");
        setSlots(await res.json());
      } catch {
        setSlots([]);
      }
    }
    loadSlots();
  }, [branchId, date]);

  const serviceTotal = useMemo(
    () => services.filter((service) => serviceIds.includes(service.id)).reduce((acc, service) => acc + Number(service.price), 0),
    [services, serviceIds]
  );

  const productTotal = useMemo(
    () =>
      selectedProducts.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return acc;
        if (item.quantity === 1) return acc + Number(product.price_1);
        if (item.quantity === 2) return acc + Number(product.price_2);
        return acc + Number(product.price_3);
      }, 0),
    [products, selectedProducts]
  );

  const subtotal = serviceTotal + productTotal;
  const discountAmount = coupon?.valid
    ? coupon.discountType === "percent"
      ? (subtotal * (coupon.discountValue || 0)) / 100
      : Math.min(coupon.discountValue || 0, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  function toggleService(id: string) {
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function getProductQuantity(productId: string) {
    return selectedProducts.find((item) => item.product_id === productId)?.quantity || 0;
  }

  function toggleProduct(productId: string) {
    setSelectedProducts((prev) => {
      const exists = prev.some((item) => item.product_id === productId);
      if (exists) return prev.filter((item) => item.product_id !== productId);
      return [...prev, { product_id: productId, quantity: 1 }];
    });
  }

  async function checkCoupon() {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      const result = {
        code: couponInput.trim(),
        valid: Boolean(data.valid),
        message: data.message || "",
        discountType: data.discount_type,
        discountValue: data.discount_value ? Number(data.discount_value) : undefined,
      };
      setCoupon(result);
      if (result.valid) setCouponModalOpen(false);
    } catch {
      setCoupon({ code: couponInput.trim(), valid: false, message: "تعذر التحقق من الكود" });
    }
    setCouponChecking(false);
  }

  const canSubmit =
    serviceIds.length > 0 &&
    (staffPreference === "any" || (staffPreference === "has" && Boolean(staffId))) &&
    Boolean(date) &&
    Boolean(time) &&
    Boolean(clientName.trim()) &&
    Boolean(clientPhone.trim());

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}/api/bookings/`, {
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
          note: "",
          staff_id: staffPreference === "has" && staffId ? staffId : null,
          coupon_code: coupon?.valid ? coupon.code : "",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.detail || "وقع خطأ فالحجز. تأكد من المعلومات.");
        setSubmitting(false);
        return;
      }

      const booking = await res.json();
      setBookingId(booking.id);
      setDevConfirmationCode(booking.confirmation_code || "");
      setShowOtpPopup(true);
    } catch {
      setSubmitError("تعذر الاتصال. عاود حاول.");
    }
    setSubmitting(false);
  }

  async function confirmOtp() {
    setConfirming(true);
    setConfirmError("");
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpInput.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setConfirmError(body?.detail || "الكود ماشي صحيح");
        setConfirming(false);
        return;
      }
      setConfirmed(true);
      setShowOtpPopup(false);
    } catch {
      setConfirmError("تعذر الاتصال. عاود حاول.");
    }
    setConfirming(false);
  }

  const serviceLabel =
    serviceIds.length === 0
      ? null
      : serviceIds.length === 1
        ? `${services.find((s) => s.id === serviceIds[0])?.name} — ${serviceTotal.toFixed(0)} DH`
        : `${serviceIds.length} خدمات — ${serviceTotal.toFixed(0)} DH`;

  const staffLabel =
    staffPreference === "any" ? "أي حلاق متاح" : staffPreference === "has" && staffId ? staffList.find((m) => m.id === staffId)?.name || null : null;

  const dateLabel = date ? days.find((d) => d.iso === date)?.label || date : null;

  const productLabel =
    selectedProducts.length === 0
      ? null
      : selectedProducts.length === 1
        ? products.find((p) => p.id === selectedProducts[0].product_id)?.name || null
        : `${selectedProducts.length} منتوجات`;

  const couponLabel = coupon?.valid ? coupon.code : null;

  if (confirmed) {
    return (
      <section className="hero-glow flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="card w-full max-w-md p-10 text-center">
          <div className="section-badge mx-auto mb-5 h-16 w-16 rounded-full text-3xl">✓</div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">تأكد الحجز ديالك بنجاح!</h1>
          <p className="mt-3 text-textmuted">غادي نتصلو بيك 30 دقيقة قبل الموعد باش نذكروك.</p>
          <a
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-6 inline-flex rounded-xl px-5 py-3 text-sm"
          >
            💬 تواصل معانا فWhatsApp
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hero-glow px-4 pb-12 pt-14 text-center">
        <span className="badge-gradient">📅 حجز أونلاين</span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-white md:text-4xl">احجز موعدك</h1>
        <p className="mx-auto mt-2 max-w-md text-white/70">دقيقة وحدة وتوصل بلاصتك فGLOSSIA.</p>
      </section>

      <section className="mx-auto -mt-6 max-w-lg px-4 pb-40">
        <div className="card space-y-4 p-5 md:p-6">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-textmuted">الاسم الكامل</p>
            <input
              className="w-full rounded-2xl border-2 border-borderline bg-surface-alt p-4 font-bold"
              placeholder="سميتك الكاملة"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-textmuted">رقم WhatsApp</p>
            <input
              className="w-full rounded-2xl border-2 border-borderline bg-surface-alt p-4 font-bold font-digits"
              placeholder="06XXXXXXXX"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>

          <FieldButton label="الخدمة" value={serviceLabel} placeholder="اختار الخدمة" onClick={() => setServiceModalOpen(true)} />
          <FieldButton label="الحلاق" value={staffLabel} placeholder="اختيار الحلاق" onClick={() => setBarberModalOpen(true)} />
          <FieldButton label="التاريخ" value={dateLabel} placeholder="اختار التاريخ" onClick={() => setDateModalOpen(true)} />

          {date ? (
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-textmuted">الوقت</p>
              <div className="grid grid-cols-4 gap-2">
                {slots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setTime(slot.time)}
                      className={`chip-selectable rounded-xl border-2 p-2 font-digits text-sm font-extrabold ${
                        time === slot.time ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                {slots.filter((slot) => slot.available).length === 0 ? (
                  <p className="col-span-full text-sm text-textmuted">ماكاين حتى وقت خالي هاد النهار، جرب يوم آخر.</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <FieldButton
            label="المنتج (اختياري)"
            value={productLabel}
            placeholder="إضافة منتج — اختياري"
            onClick={() => setProductModalOpen(true)}
          />
          <FieldButton
            label="كود التخفيض (اختياري)"
            value={couponLabel}
            placeholder="عندك كود تخفيض؟"
            onClick={() => setCouponModalOpen(true)}
          />

          {submitError ? <p className="rounded-xl bg-ember/10 p-3 text-sm font-bold text-ember">{submitError}</p> : null}

          <div className="border-t border-borderline pt-4">
            <div className="flex items-center justify-between">
              <span className="text-textmuted">المجموع</span>
              <span className="font-digits text-2xl font-extrabold text-brass">{total.toFixed(2)} DH</span>
            </div>
            <button
              type="button"
              disabled={submitting || !canSubmit}
              onClick={submitBooking}
              className={`btn-gradient mt-4 w-full rounded-2xl px-4 py-3.5 text-base disabled:animate-none ${
                canSubmit ? "cta-pulse" : ""
              }`}
            >
              {submitting ? "...كنصيفطو" : "تأكيد الحجز 🚀"}
            </button>
          </div>
        </div>
      </section>

      <SelectionModal open={serviceModalOpen} title="اختار الخدمة" onClose={() => setServiceModalOpen(false)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const active = serviceIds.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`chip-selectable rounded-2xl border-2 p-4 text-right ${
                  active ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{service.name}</span>
                  {active ? <span className="text-lg">✓</span> : null}
                </div>
                <span className={`font-digits text-sm ${active ? "text-white/85" : "text-textmuted"}`}>
                  {service.price} DH · {service.duration_minutes} دقيقة
                </span>
              </button>
            );
          })}
        </div>
        {services.length > 0 ? (
          <button
            type="button"
            disabled={serviceIds.length === 0}
            onClick={() => setServiceModalOpen(false)}
            className="btn-gradient mt-4 w-full rounded-2xl px-4 py-3 disabled:opacity-50"
          >
            تأكيد الاختيار
          </button>
        ) : null}
      </SelectionModal>

      <SelectionModal open={barberModalOpen} title="اختيار الحلاق" onClose={() => setBarberModalOpen(false)}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              setStaffPreference("any");
              setStaffId("");
              setBarberModalOpen(false);
            }}
            className={`chip-selectable col-span-2 rounded-2xl border-2 p-4 text-center font-extrabold sm:col-span-3 ${
              staffPreference === "any" ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
            }`}
          >
            🎲 أي حلاق متاح
          </button>
          {staffList.map((member) => {
            const photoSrc = resolveImageUrl(member.photo_url);
            const active = staffPreference === "has" && staffId === member.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setStaffPreference("has");
                  setStaffId(member.id);
                  setBarberModalOpen(false);
                }}
                className={`chip-selectable rounded-2xl border-2 p-3 text-center ${
                  active ? "chip-selected" : "border-borderline bg-surface-alt"
                }`}
              >
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={member.name}
                    className="mx-auto mb-2 h-16 w-16 rounded-full border-2 border-white object-cover shadow"
                  />
                ) : (
                  <ImagePlaceholder className="mx-auto mb-2 h-16 w-16 rounded-full" />
                )}
                <span className="text-sm font-bold">{member.name}</span>
              </button>
            );
          })}
          {staffList.length === 0 ? <p className="col-span-full text-sm text-textmuted">ماكاين حتى موظف متوفر دابا.</p> : null}
        </div>
      </SelectionModal>

      <SelectionModal open={dateModalOpen} title="اختار التاريخ" onClose={() => setDateModalOpen(false)}>
        <div className="grid grid-cols-2 gap-3">
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              onClick={() => {
                setDate(d.iso);
                setTime("");
                setDateModalOpen(false);
              }}
              className={`chip-selectable rounded-2xl border-2 p-3 text-center text-sm font-bold ${
                date === d.iso ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </SelectionModal>

      <SelectionModal open={productModalOpen} title="إضافة منتج" onClose={() => setProductModalOpen(false)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => {
            const selected = getProductQuantity(product.id) > 0;
            const imageSrc = resolveImageUrl(product.image_url);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className={`chip-selectable flex items-center gap-3 rounded-2xl border-2 p-3 text-right ${
                  selected ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
                }`}
              >
                {imageSrc ? (
                  <img src={imageSrc} alt={product.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                ) : (
                  <ImagePlaceholder className="h-14 w-14 shrink-0 rounded-xl" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-bold">{product.name}</span>
                    {selected ? <span>✓</span> : null}
                  </div>
                  <span className={`font-digits text-sm ${selected ? "text-white/85" : "text-textmuted"}`}>
                    {product.price_1} DH
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {products.length > 0 ? (
          <button
            type="button"
            onClick={() => setProductModalOpen(false)}
            className="btn-gradient mt-4 w-full rounded-2xl px-4 py-3"
          >
            تم
          </button>
        ) : null}
      </SelectionModal>

      <SelectionModal open={couponModalOpen} title="كود التخفيض" onClose={() => setCouponModalOpen(false)}>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-2xl border-2 border-borderline bg-surface-alt p-3 font-bold uppercase"
            placeholder="دخل الكود"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
          />
          <button type="button" onClick={checkCoupon} disabled={couponChecking} className="btn-gradient rounded-2xl px-5 text-sm">
            {couponChecking ? "..." : "تحقق"}
          </button>
        </div>
        {coupon ? (
          <p className={`mt-3 rounded-xl p-2 text-sm font-bold ${coupon.valid ? "bg-deepgreen/10 text-deepgreen" : "bg-ember/10 text-ember"}`}>
            {coupon.message}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setCoupon(null);
            setCouponInput("");
            setCouponModalOpen(false);
          }}
          className="btn-outline mt-4 w-full rounded-2xl px-4 py-3 text-sm"
        >
          متابعة بلا كود
        </button>
      </SelectionModal>

      {showOtpPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6 text-center">
            <div className="section-badge mx-auto mb-4 h-14 w-14 rounded-full text-2xl">🔐</div>
            <h2 className="font-heading text-xl font-extrabold text-ink">تأكيد الحجز</h2>
            <p className="mt-2 text-sm text-textmuted">دخل الكود اللي وصلك فالواتساب باش تأكد الحجز.</p>
            {devConfirmationCode ? (
              <p className="mt-3 rounded-xl bg-surface-alt p-3 text-sm text-textmuted">
                (مؤقتا، حيت الواتساب مازال كيتهيأ): كود التأكيد ديالك هو{" "}
                <span className="font-digits font-extrabold text-brass">{devConfirmationCode}</span>
              </p>
            ) : null}
            <input
              className="mt-4 w-full rounded-2xl border-2 border-borderline bg-surface-alt p-3 text-center font-digits text-2xl font-extrabold tracking-[0.5em]"
              placeholder="000000"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength={6}
            />
            {confirmError ? <p className="mt-2 text-sm font-bold text-ember">{confirmError}</p> : null}
            <button
              type="button"
              disabled={confirming || otpInput.trim().length === 0}
              onClick={confirmOtp}
              className="btn-gradient mt-4 w-full rounded-2xl px-4 py-3.5 disabled:opacity-50"
            >
              {confirming ? "...كنأكدو" : "أكد الكود"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
