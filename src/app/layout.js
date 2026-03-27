import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-poppins" });

export const metadata = {
  title: "THEKUA | Authentic Indian Snacks & Sweets",
  description: "Premium handcrafted Indian snacks — Thekua, Gujia, Nimkin, and more. Made with love, tradition & the finest ingredients.",
  keywords: "thekua, gujia, nimkin, indian snacks, traditional sweets, handcrafted snacks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={`${playfair.variable} ${poppins.variable}`}>
        <Providers>
          {children}
          <div id="toast-root"></div>
        </Providers>
      </body>
    </html>
  );
}
