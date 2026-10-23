import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import parse from "html-react-parser";
import RegistrationForm from "@/app/components/RegistrationForm";

export const revalidate = 60;

export default async function NewsArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 mb-16 animate-appear">
      {/* Кнопка возврата */}
      <Link
        href="/"
        className="group inline-flex items-center text-sm font-medium text-neutral-500 hover:text-blue-700 mb-8 transition-colors"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-200 group-hover:border-blue-200 group-hover:bg-blue-50 mr-3 transition-all">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
        Вернуться к списку
      </Link>

      <article className="bg-white border border-neutral-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="p-6 md:p-10 lg:p-12">
          {/* Метаданные (Категория и Дата) */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-800 font-bold text-xs uppercase tracking-wider border border-blue-100">
              {article.category}
            </span>
            <time className="text-sm text-neutral-400 font-medium flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {article.date}
            </time>
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 mb-10 leading-tight">
            {article.title}
          </h1>

          {/* Многослойный баннер с картинкой (Glassmorphism) */}
          {article.image_url && (
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden bg-blue-950 mb-10 group shadow-inner">
              {/* Задний фон: размытая копия картинки */}
              <div className="absolute inset-0">
                <img
                  src={article.image_url}
                  className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
                  alt=""
                />
              </div>
              {/* Передний фон: оригинальная картинка */}
              <img
                src={article.image_url}
                alt={article.title}
                className="relative z-10 w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-in-out drop-shadow-2xl"
              />
            </div>
          )}

          {/* Текст новости */}
          <div className="prose prose-lg max-w-none text-neutral-700 prose-headings:text-neutral-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-p:leading-relaxed whitespace-pre-wrap">
              {parse((article.content || article.excerpt).replace(/\n/g, '<br />'))}
          </div>
        </div>

        {/* Форма регистрации (визуально отделена от контента) */}
        <div className="bg-neutral-50 border-t border-neutral-100 p-6 md:p-10 lg:p-12">
          <RegistrationForm olympiadId={article.id} />
        </div>
      </article>
    </div>
  );
}
