import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "THEKUA | Authentic Indian Snacks & Sweets",
  description: "Premium handcrafted Indian snacks — Thekua, Gujia, Nimkin, and more. Made with love, tradition & the finest ingredients.",
  keywords: "thekua, gujia, nimkin, indian snacks, traditional sweets, handcrafted snacks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <div id="toast-root"></div>
        </Providers>
      </body>
    </html>
  );
}
