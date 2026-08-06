import Link from "next/link";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/shop", label: "المتجر" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-borderline bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-heading text-xl font-extrabold text-ink">
          GLOSSIA <span className="text-brass">GROUP</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-textmuted transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/booking" className="cta-pulse rounded-full bg-ember px-4 py-2 text-sm font-bold text-white">
          احجز دابا
        </Link>
      </div>
    </header>
  );
}
