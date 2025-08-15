import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimatedNote",
  description: "文章アニメーション付きブログプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-white text-gray-900">
          <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <Link className="text-lg font-semibold" href="/">
                AnimatedNote
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link className="hover:underline" href="/articles">
                  記事
                </Link>
                <Link className="hover:underline" href="/login">
                  ログイン
                </Link>
                <Link className="hover:underline" href="/register">
                  新規登録
                </Link>
                <Link
                  className="rounded bg-black px-3 py-1.5 text-white"
                  href="/articles/new"
                >
                  新規作成
                </Link>
              </nav>
            </div>
          </header>
          <QueryProvider>{children}</QueryProvider>
        </div>
      </body>
    </html>
  );
}
