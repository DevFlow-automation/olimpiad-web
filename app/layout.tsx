import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Олимпиады и Конкурсы",
  description: "Актуальные новости об образовательных олимпиадах и конкурсах.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-neutral-50 text-neutral-900 antialiased min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-tight">OlympiadNews</h1>
            <nav>
              <button className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                Вход для администратора
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full">
          {children}
        </main>

        <footer className="border-t border-neutral-200 py-8 mt-12">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} OlympiadNews. Все права защищены.
          </div>
        </footer>
      </body>
    </html>
  );
}
