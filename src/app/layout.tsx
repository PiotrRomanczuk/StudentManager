import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
// import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Student Manager",
  description: "Student Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <Toaster />
        <Analytics />
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
