import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://courtyardgrill.pk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Courtyard Grill — Best BBQ Restaurant in DHA Phase 2, Lahore",
    template: "%s — Courtyard Grill",
  },
  description:
    "Courtyard Grill is a charcoal BBQ restaurant in DHA Phase 2, Lahore, known for beef undercut tikka, malai boti and grilled fish. Dine-in, pickup and delivery. Rated 4.5 stars.",
  keywords: [
    "BBQ restaurant in DHA Lahore",
    "BBQ in DHA Phase 2 Lahore",
    "Courtyard Grill Lahore",
    "best BBQ DHA Lahore",
    "beef tikka Lahore",
    "charcoal grill Lahore",
  ],
  openGraph: {
    title: "Courtyard Grill — Authentic BBQ in DHA Phase 2, Lahore",
    description:
      "Freshly grilled BBQ and Pakistani favourites, served hot in the heart of DHA Lahore.",
    url: SITE_URL,
    siteName: "Courtyard Grill",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courtyard Grill — Authentic BBQ in DHA Phase 2, Lahore",
    description:
      "Freshly grilled BBQ and Pakistani favourites, served hot in the heart of DHA Lahore.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Courtyard Grill",
  image: `${SITE_URL}/og-image.jpg`,
  servesCuisine: ["BBQ", "Pakistani"],
  priceRange: "Rs 1,000–2,000",
  telephone: "+92-301-5174888",
  address: {
    "@type": "PostalAddress",
    streetAddress: "DHA T-Block, Lower Ground, 37-T, Phase 2 Commercial, behind Subway",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54500",
    addressCountry: "PK",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "806",
  },
  openingHours: "Mo-Su 13:00-01:00",
  acceptsReservations: "True",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
