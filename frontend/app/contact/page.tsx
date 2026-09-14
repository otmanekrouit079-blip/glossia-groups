export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <span className="badge-pill">تواصل معنا</span>
      <h1 className="mt-4 font-heading text-3xl font-extrabold text-ink md:text-4xl">تواصل معنا</h1>
      <div className="card mt-8 grid gap-6 p-8 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brass">العنوان</p>
          <p className="mt-2 text-textmuted">Agadir, Ben Sergaou, Wifaq Lkbir</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brass">WhatsApp</p>
          <p className="mt-2 text-textmuted">+212600000000</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brass">Instagram</p>
          <p className="mt-2 text-textmuted">@glossiagroup</p>
        </div>
      </div>
    </section>
  );
}
