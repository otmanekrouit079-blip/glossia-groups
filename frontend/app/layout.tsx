import type { Metadata } from "next";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { PixelLoader } from "@/components/pixel-loader";

const siteDescription = "صالون حلاقة رجالية GLOSSIA GROUP فالدار البيضاء — حجز أونلاين، خدمات حلاقة ولحية، ومنتجات عناية أصلية.";

export const metadata: Metadata = {
  metadataBase: new URL("https://glossia.it.com"),
  title: {
    default: "GLOSSIA GROUP — صالون حلاقة رجالية بالدار البيضاء",
    template: "%s | GLOSSIA GROUP",
  },
  description: siteDescription,
  openGraph: {
    title: "GLOSSIA GROUP — صالون حلاقة رجالية بالدار البيضاء",
    description: siteDescription,
    url: "https://glossia.it.com",
    siteName: "GLOSSIA GROUP",
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
