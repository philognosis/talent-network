import type { Metadata } from "next";
import "./globals.css";

// Font roles (--font-display / --font-body / --font-data) are defined as
// system-font stacks in globals.css rather than next/font/google, so
// production builds never depend on reaching Google Fonts at build time.
// Swap in next/font/local + bundled woff2 files here if you want the exact
// Space Grotesk / Inter / JetBrains Mono look in an environment with
// unrestricted network access.

export const metadata: Metadata = {
  title: "Talent Atlas",
  description: "Find talent, teams, and networks anywhere in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full h-full overflow-hidden">{children}</body>
    </html>
  );
}
