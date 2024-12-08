import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { i18n, Locale } from "../../../i18n-config";

const inter = Inter({ subsets: ["latin"] });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // userScalable: 'no',
  // viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Poker Anywhere',
  description: 'Poker Anywhere',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Poker Anywhere',
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Poker Anywhere" />
        {/* <link rel="apple-touch-icon" href="/icon-192x192.png" /> */}
      </head>
      <body className={notoSansTC.className}>{children}</body>
    </html>
  );
}
