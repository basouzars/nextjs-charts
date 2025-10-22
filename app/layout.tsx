import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excel Data Grids & Charts Comparison",
  description: "Compare AG Grid, MUI Data Grid Premium and charts from AG Charts, MUI Charts, and ECharts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
