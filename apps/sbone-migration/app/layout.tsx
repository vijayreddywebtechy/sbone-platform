import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// SB design system: Benton Sans, colour tokens and base styles. Loaded after globals.css so they take precedence.
import "@sbone/shared/styles/global.scss";
import "@/styles/app.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SBOne | Standard Bank",
  description: "Standard Bank’s business banking hub: bring your most popular business banking services onto one convenient platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // styles/app.scss sets smooth scrolling for in-page links; this tells Next not to animate route changes
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
