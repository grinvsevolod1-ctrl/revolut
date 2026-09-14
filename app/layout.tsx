import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"

const aeonik = localFont({
  src: [
    { path: "../public/assets/AeonikPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/assets/AeonikPro-Medium.woff2", weight: "500 700", style: "normal" },
    { path: "../public/assets/AeonikPro-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
})

const inter = localFont({
  src: [{ path: "../public/assets/Inter-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
})

const faviconSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23191c1f'/%3E%3Ctext x='50%25' y='50%25' dy='.06em' font-family='Arial,sans-serif' font-size='40' font-weight='700' fill='%23fff' text-anchor='middle' dominant-baseline='central'%3ER%3C/text%3E%3C/svg%3E"

export const metadata: Metadata = {
  metadataBase: new URL("https://revolut-motion-study.vercel.app"),
  title: "Revolut — motion study",
  description:
    "A local, scroll-driven motion study reconstructing the Revolut homepage: banking hero, savings scenes, rotating 3D cards, AI, security and investing sections. Not affiliated with Revolut.",
  robots: "index,follow",
  alternates: { canonical: "/" },
  icons: { icon: faviconSvg },
  openGraph: {
    type: "website",
    title: "Revolut — motion study",
    description:
      "A local, scroll-driven motion study reconstructing the Revolut homepage. Not affiliated with Revolut.",
    images: ["/assets/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revolut — motion study",
    description:
      "A local, scroll-driven motion study reconstructing the Revolut homepage. Not affiliated with Revolut.",
    images: ["/assets/hero.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${aeonik.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
