import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio — Interior Design",
  description: "Interior design portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            Studio
          </Link>
          <nav>
            <Link href="/">Work</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          All rights reserved © {new Date().getFullYear()} Studio
        </footer>
      </body>
    </html>
  );
}
