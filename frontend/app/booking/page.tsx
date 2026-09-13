"use client";

import { useEffect, useMemo, useState } from "react";

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
      <section className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="card p-8">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">تأكد الحجز ديالك بنجاح!</h1>
          <p className="mt-3 text-textmuted">غادي نتصلو بيك 30 دقيقة قبل الموعد باش نذكروك.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="card p-6 md:p-8">
        <h1 className="font-heading text-2xl font-extrabold text-ink">حجز الموعد</h1>
        <p className="mt-1 text-sm text-textmuted">عمر المعلومات لي تحت وأكد الحجز فالأخير.</p>

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">1. اختار العروض ديالك</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex items-center gap-2 rounded-xl border border-borderline bg-surface-alt p-3"
              >
                <input type="checkbox" checked={serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} />
                <span>
                  {service.name} ({service.price} DH)
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">2. اختار شكون بغيتيه يخدمك</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStaffPreference("has")}
              className={`rounded-xl border p-4 text-center font-semibold ${
                staffPreference === "has" ? "border-brass bg-brass/10 text-brass" : "border-borderline text-textmain"
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
              className={`rounded-xl border p-4 text-center font-semibold ${
                staffPreference === "any" ? "border-brass bg-brass/10 text-brass" : "border-borderline text-textmain"
              }`}
            >
              اللي خاوي، أنا مزروب
            </button>
          </div>

          {staffPreference === "has" ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {staffList.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setStaffId(member.id)}
                  className={`rounded-xl border p-3 text-center ${
                    staffId === member.id ? "border-brass bg-brass/10" : "border-borderline"
                  }`}
                >
                  <img
                    src={resolveImageUrl(member.photo_url)}
                    alt={member.name}
                    className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold text-ink">{member.name}</span>
                </button>
              ))}
              {staffList.length === 0 ? <p className="text-sm text-textmuted">ماكاين حتى موظف متوفر دابا.</p> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">3. اختار اليوم</h2>
          <input
            className="w-full rounded-xl border border-borderline p-3"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
          />
        </div>

        {date ? (
          <div className="mt-6 border-t border-borderline pt-6">
            <h2 className="mb-3 font-bold text-ink">4. اختار الوقت</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.filter((slot) => slot.available).map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setTime(slot.time)}
                  className={`rounded-xl border p-2 text-sm font-semibold ${
                    time === slot.time ? "border-brass bg-brass/10 text-brass" : "border-borderline text-textmain"
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

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">5. اختار منتوج (اختياري)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-borderline bg-surface-alt p-3">
                <img src={resolveImageUrl(product.image_url)} alt={product.name} className="mb-2 h-28 w-full rounded-lg object-cover" />
                <p className="font-semibold text-ink">{product.name}</p>
                <select
                  className="mt-2 w-full rounded-lg border border-borderline p-2"
                  onChange={(e) => setProductQuantity(product.id, Number(e.target.value))}
                  defaultValue="0"
                >
                  <option value="0">ما بغيتش</option>
                  <option value="1">قطعة وحدة ({product.price_1} DH)</option>
                  <option value="2">جوج قطع ({product.price_2} DH)</option>
                  <option value="3">3 قطع ({product.price_3} DH)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">6. تأكيد الطلب وكود التخفيض</h2>
          <div className="rounded-xl border border-borderline bg-surface-alt p-4">
            <p className="text-textmain">
              المجموع: <span className="font-digits text-lg font-extrabold text-brass">{subtotal.toFixed(2)} DH</span>
            </p>
          </div>

          <p className="mb-2 mt-4 font-semibold text-ink">واش عندك كود تخفيض؟</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWantsCoupon("yes")}
              className={`rounded-xl border p-3 text-center font-semibold ${
                wantsCoupon === "yes" ? "border-brass bg-brass/10 text-brass" : "border-borderline text-textmain"
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
              className={`rounded-xl border p-3 text-center font-semibold ${
                wantsCoupon === "no" ? "border-brass bg-brass/10 text-brass" : "border-borderline text-textmain"
              }`}
            >
              ماعنديش كود
            </button>
          </div>

          {wantsCoupon === "yes" ? (
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-borderline p-3"
                placeholder="دخل الكود"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                type="button"
                onClick={checkCoupon}
                disabled={couponChecking}
                className="btn-gradient rounded-xl px-4 py-2 text-sm"
              >
                {couponChecking ? "..." : "تحقق"}
              </button>
            </div>
          ) : null}
          {coupon ? <p className={`mt-2 text-sm ${coupon.valid ? "text-deepgreen" : "text-ember"}`}>{coupon.message}</p> : null}

          {discountAmount > 0 ? (
            <p className="mt-3 text-textmain">
              بعد التخفيض: <span className="font-digits text-xl font-extrabold text-brass">{total.toFixed(2)} DH</span>
            </p>
          ) : null}
        </div>

        <div className="mt-6 border-t border-borderline pt-6">
          <h2 className="mb-3 font-bold text-ink">7. المعلومات الشخصية</h2>
          <div className="grid gap-3">
            <input
              className="rounded-xl border border-borderline p-3"
              placeholder="الاسم الكامل"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <input
              className="rounded-xl border border-borderline p-3"
              placeholder="رقم الواتساب (06XXXXXXXX)"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
            <p className="text-xs text-textmuted">رقم الواتساب ضروري باش نصيفطو ليك كود التأكيد ديال الحجز.</p>
            <textarea
              className="rounded-xl border border-borderline p-3"
              placeholder="ملاحظة (اختياري)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {submitError ? <p className="mt-4 text-sm text-ember">{submitError}</p> : null}

        <button
          type="button"
          disabled={submitting || !canSubmit}
          onClick={submitBooking}
          className="btn-gradient mt-6 w-full rounded-xl px-4 py-3 disabled:opacity-50"
        >
          {submitting ? "...كنصيفطو" : `أكد الحجز (${total.toFixed(2)} DH)`}
        </button>
      </div>

      {showOtpPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-sm p-6 text-center">
            <h2 className="font-heading text-xl font-extrabold text-ink">تأكيد الحجز</h2>
            <p className="mt-2 text-sm text-textmuted">دخل الكود اللي وصلك فالواتساب باش تأكد الحجز.</p>
            {devConfirmationCode ? (
              <p className="mt-3 rounded-xl bg-surface-alt p-3 text-sm text-textmuted">
                (مؤقتا، حيت الواتساب مازال كيتهيأ): كود التأكيد ديالك هو{" "}
                <span className="font-digits font-extrabold text-brass">{devConfirmationCode}</span>
              </p>
            ) : null}
            <input
              className="mt-4 w-full rounded-xl border border-borderline p-3 text-center font-digits text-lg tracking-widest"
              placeholder="000000"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength={6}
            />
            {confirmError ? <p className="mt-2 text-sm text-ember">{confirmError}</p> : null}
            <button
              type="button"
              disabled={confirming || otpInput.trim().length === 0}
              onClick={confirmOtp}
              className="btn-gradient mt-4 w-full rounded-xl px-4 py-3 disabled:opacity-50"
            >
              {confirming ? "...كنأكدو" : "أكد الكود"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
