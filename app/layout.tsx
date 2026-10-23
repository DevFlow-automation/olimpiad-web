import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "NGS Олимпиады и конкурсы",
  description: "Олимпиады и конкурсы New Generation School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-neutral-50 text-neutral-900 min-h-screen flex flex-col`}>
        <header className="bg-blue-900 text-white border-b border-blue-950 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-amber-400 hover:text-amber-300 transition-colors">
              Олимпиады и конкурсы
            </Link>
            <Link className="text-sm font-medium text-blue-100 hover:text-white transition-colors" href="/admin">
              Вход для сотрудников
            </Link>
          </div>
        </header>

        <main className="flex-grow max-w-5xl mx-auto px-6 py-8 w-full">
          {children}
        </main>

        <footer className="bg-blue-950 text-blue-200 py-8 border-t border-blue-900 mt-auto">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm">
            © {new Date().getFullYear()} New Generation School. Все права защищены.
          </div>
        </footer>
      </body>
    </html>
  );
}
