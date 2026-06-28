import "./globals.css";
import { ReactNode } from "react";
import MainLayout from "@/ui/layout/main-layout";
import { AuthProvider } from "@/ui/components/auth/auth-context";
import { CartProvider } from "@/ui/components/cart";

export const metadata = {
  title: "Ammoo Arcade",
  description: "E-commerce store with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <MainLayout>{children}</MainLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
