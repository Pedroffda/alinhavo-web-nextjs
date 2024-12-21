import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Alinhavo - Roupas Personalizadas",
  description:
    "Crie e compre roupas personalizadas feitas por costureiros talentosos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
