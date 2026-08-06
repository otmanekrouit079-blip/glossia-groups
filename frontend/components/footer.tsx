import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-brass">GLOSSIA GROUP</h3>
          <p className="mt-2 text-sm text-white/80">صالون حلاقة رجالية + منتجات عناية أصلية.</p>
        </div>
        <div>
          <h4 className="font-bold">روابط</h4>
          <ul className="mt-2 space-y-2 text-sm text-white/80">
            <li><Link href="/services">الخدمات</Link></li>
            <li><Link href="/shop">المتجر</Link></li>
            <li><Link href="/booking">الحجز</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">تواصل</h4>
          <p className="mt-2 text-sm text-white/80">WhatsApp: 212600000000+</p>
          <p className="text-sm text-white/80">Casablanca, Morocco</p>
        </div>
      </div>
    </footer>
  );
}
