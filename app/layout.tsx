import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionInitializer from "@/components/SessionInitializer";
import Toaster from "@/components/Toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Customer Service Demo",
  description: "Customer Service Demo with support agent and user view",
  icons: {
    icon: "/openai_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionInitializer />
        <main className="min-h-screen bg-background text-foreground">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
