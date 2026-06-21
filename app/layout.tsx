import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Centinela México",
    template: "%s | Centinela México",
  },
  description:
    "Base de datos interactiva y educativa sobre las fuerzas de seguridad y defensa de México. Fuentes oficiales y de acceso público.",
  keywords: [
    "SEDENA",
    "SEMAR",
    "Guardia Nacional",
    "Fuerza Aérea",
    "fuerzas armadas México",
    "seguridad México",
    "defensa México",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Centinela México",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`dark ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg-base text-text antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
