import type { Metadata } from "next";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { PixelLoader } from "@/components/pixel-loader";

const siteDescription = "صالون حلاقة رجالية GLOSSIA GROUPS بأكادير — حجز أونلاين، خدمات حلاقة ولحية، ومنتجات عناية أصلية.";

export const metadata: Metadata = {
  metadataBase: new URL("https://glossia.it.com"),
  title: {
    default: "GLOSSIA GROUPS — صالون حلاقة رجالية بأكادير",
    template: "%s | GLOSSIA GROUPS",
  },
  description: siteDescription,
  openGraph: {
    title: "GLOSSIA GROUPS — صالون حلاقة رجالية بأكادير",
    description: siteDescription,
    url: "https://glossia.it.com",
    siteName: "GLOSSIA GROUPS",
    locale: "ar_MA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PixelLoader />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBookCta />
      </body>
    </html>
  );
}
