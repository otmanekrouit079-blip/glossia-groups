import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-borderline bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-brass">GLOSSIA GROUP</h3>
          <p className="mt-2 text-sm text-textmuted">صالون حلاقة رجالية + منتجات عناية أصلية.</p>
        </div>
        <div>
          <h4 className="font-bold text-ink">روابط</h4>
          <ul className="mt-2 space-y-2 text-sm text-textmuted">
            <li><Link href="/services" className="transition hover:text-brass">الخدمات</Link></li>
            <li><Link href="/shop" className="transition hover:text-brass">المتجر</Link></li>
            <li><Link href="/booking" className="transition hover:text-brass">الحجز</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-ink">تواصل</h4>
          <p className="mt-2 text-sm text-textmuted">WhatsApp: 212600000000+</p>
          <p className="text-sm text-textmuted">Casablanca, Morocco</p>
        </div>
      </div>
    </footer>
  );
}
