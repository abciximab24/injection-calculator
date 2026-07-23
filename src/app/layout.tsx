import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Injection Calculator",
  description:
    "Stage 1 interval calculator and Stage 2 clinical 2D barcode generator for anti-VEGF injection scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
