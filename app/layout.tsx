import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lokita - Rendez-vous médicaux au Bénin",
  description:
    "Prenez rendez-vous dans les hôpitaux de Cotonou et Abomey-Calavi en quelques clics. Santé digitale accessible à tous.",
  keywords: [
    "santé",
    "hôpital",
    "rendez-vous",
    "médecin",
    "Bénin",
    "Cotonou",
    "Abomey-Calavi",
  ],
  authors: [{ name: "Lokita" }],
  creator: "Lokita",
  publisher: "Lokita",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lokita",
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: "https://lokita.app",
    title: "Lokita - Rendez-vous médicaux au Bénin",
    description:
      "Prenez rendez-vous dans les hôpitaux de Cotonou et Abomey-Calavi en quelques clics",
    siteName: "Lokita",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokita - Rendez-vous médicaux au Bénin",
    description:
      "Prenez rendez-vous dans les hôpitaux de Cotonou et Abomey-Calavi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#00A86B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
