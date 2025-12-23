import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
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
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased font-sans`} suppressHydrationWarning>
          <SmoothScroll />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
