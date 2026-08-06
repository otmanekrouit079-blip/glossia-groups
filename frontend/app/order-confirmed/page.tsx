type OrderConfirmedPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const bookingId = searchParams?.bookingId;

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <div className="rounded-3xl border border-deepgreen bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold">تم تأكيد حجزك</h1>
        <p className="mt-3 text-textmuted">رقم الحجز: {bookingId ?? "-"}</p>
        <p className="mt-2 text-textmuted">الخلاص كيوقع فالمحل عند الوصول.</p>
      </div>
    </section>
  );
}
