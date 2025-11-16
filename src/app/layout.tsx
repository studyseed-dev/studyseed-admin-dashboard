import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Providers>
            <NavBar />
            {children}
            <Analytics />
            <Toaster />
          </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
