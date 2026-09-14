"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/shop", label: "المتجر" },
  { href: "/gallery", label: "معرض الصور" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-borderline bg-warm/90 backdrop-blur-md"
          : "border-b border-transparent bg-warm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-heading text-xl font-extrabold text-ink">
          GLOSSIA <span className="text-brass">GROUPS</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-semibold text-textmuted transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/booking" className="cta-pulse btn-gradient rounded-xl px-5 py-2.5 text-sm">
            احجز الآن
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="فتح القائمة"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderline text-ink md:hidden"
        >
          <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-borderline bg-warm px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 font-semibold text-textmain transition hover:bg-surface-alt hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="btn-gradient mt-3 rounded-xl px-5 py-3 text-center text-sm"
            >
              احجز الآن
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
