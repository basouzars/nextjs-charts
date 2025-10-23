import type { Metadata } from "next";
import ThemeRegistry from './ThemeRegistry';
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Analysis Dashboard",
  description: "Upload and analyze Excel files with interactive charts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
