import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-game",
});

export const metadata: Metadata = {
  title: "Redactify | Intelligent Document Redaction",
  description: "Secure, AI-powered document redaction for the modern enterprise.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} ${pressStart2P.variable} antialiased font-sans`} suppressHydrationWarning>
        <SmoothScroll />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
