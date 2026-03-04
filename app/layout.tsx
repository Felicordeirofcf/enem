import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

// Configurando as fontes
const fontHeading = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontBody = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Plataforma ENEM | Painel do Professor",
  description: "Banco de questões do ENEM de 2015 a 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${fontHeading.variable} ${fontBody.variable} font-body bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}