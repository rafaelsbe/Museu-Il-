import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ilè Asè Alaketù Oyá Igbalè | Museu Vivo",
    template: "%s | Ilè Asè Alaketù Oyá Igbalè",
  },
  description:
    "Museu vivo de memória, acolhimento e educação sobre a cultura afro-brasileira em Aracaju.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${montserrat.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo
        </a>
        <Navbar />
        <div id="main-content" className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
