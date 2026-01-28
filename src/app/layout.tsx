import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { QuestionsProvider } from "@/context/QuestionsContext";

import "./globals.css";
import QueryProvider from "./provider/QueryProvider";

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
    <QueryProvider>
      <AuthProvider>
        <QuestionsProvider>
          <html lang="en">
            <body className={`${inter.className}`}>
              <NavBar />
              {children}
              <Analytics />
              <Toaster />
            </body>
          </html>
        </QuestionsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
