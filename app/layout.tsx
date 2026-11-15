import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import "./styles/tokens.css";
import "./styles/ui.css";
import ScrollToTop from "@/components/common/ScrollToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--ff-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Olivera de Schwab Propiedades",
  description: "Inmobiliaria Olivera de Schwab Propiedades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
