import type { Metadata } from "next";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PixelLoader } from "@/components/pixel-loader";

export const metadata: Metadata = {
  title: "GLOSSIA GROUP",
  description: "صالون حلاقة رجالية + متجر منتجات عناية مع حجز أونلاين",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PixelLoader />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
