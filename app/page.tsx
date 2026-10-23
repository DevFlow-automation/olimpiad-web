import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 60;

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image_url: string;
}

export default async function Home() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="mt-12 p-6 bg-red-50/50 border border-red-100 rounded-2xl text-red-600 text-center">
        Произошла ошибка при загрузке данных.
      </section>
    );
  }

  return (
    <section>
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Актуальные события</h2>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Следите за расписанием олимпиад, конкурсов и хакатонов. Участвуйте и развивайте свои навыки.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news && news.length > 0 ? (
          news.map((item: NewsItem) => (
            <Link
              href={`/news/${item.id}`}
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer overflow-hidden"
            >
              {item.image_url ? (
                <div className="w-full h-72 bg-neutral-100 border-b border-neutral-100 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-full h-48 bg-neutral-100 border-b border-neutral-100 flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">Нет обложки</span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                    {item.category}
                  </span>
                  <time className="text-sm text-neutral-400">{item.date}</time>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-neutral-600 leading-relaxed mb-6 flex-grow text-sm">
                  {item.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center text-sm font-medium text-neutral-900">
                  Подробнее
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-500 border-2 border-dashed border-neutral-200 rounded-2xl">
            Пока нет добавленных новостей.
          </div>
        )}
      </div>
    </section>
  );
}
