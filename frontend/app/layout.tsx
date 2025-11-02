import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toaster from "./components/layouts/toaster/toaster";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodSnap",
  description:
    "FoodSnapは、料理メニューを中心にアプローチし、料理の魅力を直感的に伝えるアプリです。直感的なデザインと操作性で、食べたいと思える飲食店を見つけられます。",
  keywords : ["FoodSnap", "飲食店", "料理", "メニュー", "直感的なデザイン", "操作性", "食べたいと思える飲食店", "直感的な操作性" , "近くの飲食店"],
  creator : "takuya0202"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#3d3d3d]`}>
        {/* muiのhydrationエラーを回避するため */}
        <AppRouterCacheProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
