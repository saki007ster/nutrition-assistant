import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Nutrition Assistant - Your AI-Powered Nutrition Guide",
  description: "Get personalized nutrition advice, meal plans, and recipes tailored to your dietary preferences and health goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
