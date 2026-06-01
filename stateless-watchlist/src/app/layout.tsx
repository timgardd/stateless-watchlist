import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Provider";

export const metadata: Metadata = {
  title: "Stateless Watchlist",
  description: "Movie watchlist built with Next.js, Prisma, and Tanstack Query",
};

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}