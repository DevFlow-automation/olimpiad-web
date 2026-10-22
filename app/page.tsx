interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Всероссийская олимпиада по информатике 2026",
    category: "Олимпиада",
    date: "12 Октября 2026",
    excerpt: "Открыта регистрация на отборочный этап. К участию приглашаются школьники 9-11 классов. Победители получат квоты на поступление.",
  },
  {
    id: "2",
    title: "Хакатон по веб-разработке WebFest",
    category: "Конкурс",
    date: "05 Октября 2026",
    excerpt: "Ежегодный конкурс для молодых разработчиков. В этом году тема хакатона — образовательные технологии и доступность.",
  },
  {
    id: "3",
    title: "Олимпиада Ломоносов по математике",
    category: "Олимпиада",
    date: "28 Сентября 2026",
    excerpt: "Опубликованы результаты первого тура. Проходной балл составил 85 из 100. Финал состоится в очном формате.",
  }
];

export default function Home() {
  return (
    <section>
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Актуальные события</h2>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Следите за расписанием олимпиад, конкурсов и хакатонов. Участвуйте и развивайте свои навыки.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockNews.map((news) => (
          <article
            key={news.id}
            className="group flex flex-col p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                {news.category}
              </span>
              <time className="text-sm text-neutral-400">{news.date}</time>
            </div>

            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {news.title}
            </h3>

            <p className="text-neutral-600 leading-relaxed mb-6 flex-grow">
              {news.excerpt}
            </p>

            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center text-sm font-medium text-neutral-900">
              Подробнее
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
