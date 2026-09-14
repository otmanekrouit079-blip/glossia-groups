"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileBookCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/booking" || !visible) {
    return null;
  }

  return (
    <div className="sticky-bar fixed inset-x-0 bottom-0 z-40 px-4 py-3 md:hidden">
      <Link href="/booking" className="btn-gradient block rounded-xl py-3 text-center text-base">
        احجز الآن
      </Link>
    </div>
  );
}
