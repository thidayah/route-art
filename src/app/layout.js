import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RouteArt — Lari Dengan Gaya",
  description:
    "Temukan dan ikuti rute lari kreatif berbentuk hewan, bunga, dan karya seni di kotamu. RouteArt mengubah setiap lari menjadi pengalaman artistik.",
  keywords: ["lari", "running route", "rute lari", "seni", "RouteArt"],
  authors: [{ name: "RouteArt" }],
  openGraph: {
    title: "RouteArt — Lari Dengan Gaya",
    description:
      "Temukan dan ikuti rute lari kreatif berbentuk hewan, bunga, dan karya seni di kotamu.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
