"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { ImagePlaceholder } from "@/components/image-placeholder";
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

function SectionCard({
  number,
  icon,
  title,
  subtitle,
  children,
}: {
  number: number;
  icon: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="card card-hover p-5 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="section-badge h-10 w-10 shrink-0 rounded-2xl text-lg font-extrabold">{number}</span>
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
            <span>{icon}</span>
            {title}
          </h2>
          {subtitle ? <p className="text-xs text-textmuted">{subtitle}</p> : null}
        </div>
      </div>
      {children}
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

  const [wantsCoupon, setWantsCoupon] = useState<"" | "yes" | "no">("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [devConfirmationCode, setDevConfirmationCode] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const branchId = branches[0]?.id || "";

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

  function setProductQuantity(productId: string, quantity: number) {
    setSelectedProducts((prev) => {
      const without = prev.filter((item) => item.product_id !== productId);
      if (quantity === 0) return without;
      return [...without, { product_id: productId, quantity }];
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
      setCoupon({
        code: couponInput.trim(),
        valid: Boolean(data.valid),
        message: data.message || "",
        discountType: data.discount_type,
        discountValue: data.discount_value ? Number(data.discount_value) : undefined,
      });
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
    (wantsCoupon === "no" || wantsCoupon === "" || (wantsCoupon === "yes" && Boolean(coupon?.valid))) &&
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
          note,
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

  if (confirmed) {
    return (
      <section className="hero-glow flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="card w-full max-w-md p-10 text-center">
          <div className="section-badge mx-auto mb-5 h-16 w-16 rounded-full text-3xl">✓</div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">تأكد الحجز ديالك بنجاح!</h1>
          <p className="mt-3 text-textmuted">غادي نتصلو بيك 30 دقيقة قبل الموعد باش نذكروك.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hero-glow px-4 pb-16 pt-14 text-center">
        <span className="badge-gradient">📅 حجز أونلاين</span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-white md:text-4xl">احجز وقتك فGLOSSIA</h1>
        <p className="mx-auto mt-2 max-w-md text-white/70">عمر المعلومات لي تحت وأكد الحجز فالأخير، فدقيقتين.</p>
      </section>

      <section className="mx-auto -mt-10 max-w-2xl px-4 pb-40">
        <div className="space-y-5">
          <SectionCard number={1} icon="💈" title="اختار العروض ديالك">
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
                      {service.price} DH
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard number={2} icon="🧑‍🔧" title="اختار شكون بغيتيه يخدمك">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStaffPreference("has")}
                className={`chip-selectable rounded-2xl border-2 p-4 text-center font-extrabold ${
                  staffPreference === "has" ? "chip-selected" : "border-borderline text-textmain"
                }`}
              >
                عندي مفضل
              </button>
              <button
                type="button"
                onClick={() => {
                  setStaffPreference("any");
                  setStaffId("");
                }}
                className={`chip-selectable rounded-2xl border-2 p-4 text-center font-extrabold ${
                  staffPreference === "any" ? "chip-selected" : "border-borderline text-textmain"
                }`}
              >
                اللي خاوي، أنا مزروب
              </button>
            </div>

            {staffPreference === "has" ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {staffList.map((member) => {
                  const photoSrc = resolveImageUrl(member.photo_url);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setStaffId(member.id)}
                      className={`chip-selectable rounded-2xl border-2 p-3 text-center ${
                        staffId === member.id ? "chip-selected" : "border-borderline"
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
                {staffList.length === 0 ? <p className="text-sm text-textmuted">ماكاين حتى موظف متوفر دابا.</p> : null}
              </div>
            ) : null}
          </SectionCard>

          <SectionCard number={3} icon="📅" title="اختار اليوم">
            <input
              className="w-full rounded-2xl border-2 border-borderline p-4 font-digits text-lg font-bold"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
            />
          </SectionCard>

          {date ? (
            <SectionCard number={4} icon="⏰" title="اختار الوقت">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setTime(slot.time)}
                      className={`chip-selectable rounded-xl border-2 p-2 font-digits text-sm font-extrabold ${
                        time === slot.time ? "chip-selected" : "border-borderline text-textmain"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                {slots.filter((slot) => slot.available).length === 0 ? (
                  <p className="col-span-full text-sm text-textmuted">ماكاين حتى وقت خالي هاد النهار، جرب يوم آخر.</p>
                ) : null}
              </div>
            </SectionCard>
          ) : null}

          <SectionCard number={5} icon="🛍️" title="اختار منتوج" subtitle="اختياري">
            <div className="grid gap-3 sm:grid-cols-2">
              {products.map((product) => {
                const selected = getProductQuantity(product.id) > 0;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setProductQuantity(product.id, selected ? 0 : 1)}
                    className={`chip-selectable rounded-2xl border-2 p-4 text-right ${
                      selected ? "chip-selected" : "border-borderline bg-surface-alt text-textmain"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">{product.name}</span>
                      {selected ? <span className="text-lg">✓</span> : null}
                    </div>
                    <span className={`font-digits text-sm ${selected ? "text-white/85" : "text-textmuted"}`}>
                      {product.price_1} DH
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard number={6} icon="🎟️" title="تأكيد الطلب وكود التخفيض">
            <div className="rounded-2xl border border-brass/30 bg-surface-alt p-4">
              <p className="text-sm text-textmuted">المجموع</p>
              <p className="font-digits text-2xl font-extrabold text-ink">{subtotal.toFixed(2)} DH</p>
            </div>

            <p className="mb-2 mt-4 font-extrabold text-ink">واش عندك كود تخفيض؟</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWantsCoupon("yes")}
                className={`chip-selectable rounded-2xl border-2 p-3 text-center font-extrabold ${
                  wantsCoupon === "yes" ? "chip-selected" : "border-borderline text-textmain"
                }`}
              >
                عندي كود
              </button>
              <button
                type="button"
                onClick={() => {
                  setWantsCoupon("no");
                  setCoupon(null);
                  setCouponInput("");
                }}
                className={`chip-selectable rounded-2xl border-2 p-3 text-center font-extrabold ${
                  wantsCoupon === "no" ? "chip-selected" : "border-borderline text-textmain"
                }`}
              >
                ماعنديش كود
              </button>
            </div>

            {wantsCoupon === "yes" ? (
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded-2xl border-2 border-borderline p-3 font-bold uppercase"
                  placeholder="دخل الكود"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={checkCoupon}
                  disabled={couponChecking}
                  className="btn-gradient rounded-2xl px-5 text-sm"
                >
                  {couponChecking ? "..." : "تحقق"}
                </button>
              </div>
            ) : null}
            {coupon ? (
              <p
                className={`mt-2 rounded-xl p-2 text-sm font-bold ${
                  coupon.valid ? "bg-deepgreen/10 text-deepgreen" : "bg-ember/10 text-ember"
                }`}
              >
                {coupon.message}
              </p>
            ) : null}

            {discountAmount > 0 ? (
              <p className="mt-3 text-textmain">
                بعد التخفيض: <span className="font-digits text-xl font-extrabold text-brass">{total.toFixed(2)} DH</span>
              </p>
            ) : null}
          </SectionCard>

          <SectionCard number={7} icon="📱" title="المعلومات الشخصية">
            <div className="grid gap-3">
              <input
                className="rounded-2xl border-2 border-borderline p-4 font-bold"
                placeholder="الاسم الكامل"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <input
                className="rounded-2xl border-2 border-borderline p-4 font-bold font-digits"
                placeholder="رقم الواتساب (06XXXXXXXX)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
              <p className="rounded-xl bg-brass/10 p-2 text-xs font-bold text-brass-dark">
                رقم الواتساب ضروري باش نصيفطو ليك كود التأكيد ديال الحجز.
              </p>
              <textarea
                className="rounded-2xl border-2 border-borderline p-4"
                placeholder="ملاحظة (اختياري)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </SectionCard>

          {submitError ? (
            <p className="rounded-xl bg-ember/10 p-3 text-sm font-bold text-ember">{submitError}</p>
          ) : null}
        </div>
      </section>

      <div className="sticky-bar fixed inset-x-0 bottom-0 z-40 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="shrink-0">
            <p className="text-xs text-textmuted">المجموع</p>
            <p className="font-digits text-xl font-extrabold text-brass">{total.toFixed(2)} DH</p>
          </div>
          <button
            type="button"
            disabled={submitting || !canSubmit}
            onClick={submitBooking}
            className={`btn-gradient flex-1 rounded-2xl px-4 py-3.5 text-base disabled:animate-none ${
              canSubmit ? "cta-pulse" : ""
            }`}
          >
            {submitting ? "...كنصيفطو" : "أكد الحجز 🚀"}
          </button>
        </div>
      </div>

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
              className="mt-4 w-full rounded-2xl border-2 border-borderline p-3 text-center font-digits text-2xl font-extrabold tracking-[0.5em]"
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
