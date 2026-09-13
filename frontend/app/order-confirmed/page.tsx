type OrderConfirmedPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const bookingId = searchParams?.bookingId;

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-deepgreen/10 text-4xl">✅</div>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink">تم تأكيد حجزك</h1>
        <p className="mt-3 text-textmuted">رقم الحجز: {bookingId ?? "-"}</p>
        <p className="mt-2 text-textmuted">الخلاص كيوقع فالمحل عند الوصول.</p>
      </div>
    </section>
  );
}
