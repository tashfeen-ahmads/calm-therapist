import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/ui/RegisterServiceWorker";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Calm Therapist" },
  title: {
    default: "Calm Therapist — AI Therapy That Actually Remembers You",
    template: "%s | Calm Therapist",
  },
  description:
    "Calm Therapist is an AI therapist that builds on every session. Voice, chat, journaling, and crisis support — with radical privacy and no waiting lists.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Calm Therapist",
    title: "Calm Therapist — AI Therapy That Actually Remembers You",
    description:
      "An AI therapist that builds on every session. Voice, chat, journaling, and crisis support — with radical privacy.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calm Therapist",
    description:
      "AI therapy that remembers you. Backed by Implenix.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", apple: "/icons/icon-192.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
