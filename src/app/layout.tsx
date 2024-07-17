import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import favicon from "";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FiestaTour",
  description: "피에스타 투어",
  icons: {
    // icon: favicon.src,
  },
};

export default function HTMLLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
