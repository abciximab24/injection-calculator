import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Injection Calculator",
  description: "Clinical injection interval calculator and 2D barcode generator",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
