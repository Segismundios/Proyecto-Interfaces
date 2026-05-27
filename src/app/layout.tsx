import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { VisibilityProvider } from "@/context/VisibilityContext";
import { SecurityProvider } from "@/context/SecurityContext";

export const metadata: Metadata = {
  title: "DevHub",
  description: "Proyecto Interfaces - UX Improvements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <FavoritesProvider>
          <VisibilityProvider>
            <SecurityProvider>
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
            </SecurityProvider>
          </VisibilityProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
