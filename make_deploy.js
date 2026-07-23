const fs = require("fs");

const layout = `import type { Metadata } from "next";
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
`;

const nextConfig = `import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
`;

const postcss = `const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
`;

const files = [
  { file: "package.json", data: fs.readFileSync("package.json", "utf8") },
  { file: "tsconfig.json", data: fs.readFileSync("tsconfig.json", "utf8") },
  { file: "next.config.ts", data: nextConfig },
  { file: "postcss.config.mjs", data: postcss },
  { file: "src/app/layout.tsx", data: layout },
  { file: "src/app/globals.css", data: fs.readFileSync("src/app/globals.css", "utf8") },
  { file: "src/app/page.tsx", data: fs.readFileSync("src/app/page.tsx", "utf8") },
];

fs.writeFileSync("full_deploy_files.json", JSON.stringify(files));
console.log("count", files.length, "size", Buffer.byteLength(JSON.stringify(files)));
files.forEach((f) => console.log(f.file, f.data.length));
