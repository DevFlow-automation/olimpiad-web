"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"news" | "registrations">("news");

  // Состояния для новостей
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Олимпиада");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Состояния для заявок
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.user_metadata?.role === "admin";

  useEffect(() => {
    if (isAdmin && activeTab === "registrations") {
      fetchRegistrations();
    }
  }, [isAdmin, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Ошибка авторизации: " + error.message);
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    const { data, error } = await supabase
      .from("registrations")
      .select('id, created_at, student_name, student_class, teacher_email, news (title)')
      .order("created_at", { ascending: false });

    if (error) alert("Ошибка загрузки заявок: " + error.message);
    else setRegistrations(data || []);
    setLoadingRegs(false);
  };

  const exportToExcel = () => {
    if (registrations.length === 0) return alert("Нет данных для выгрузки");
    const dataForExcel = registrations.map(reg => ({
      "Дата заявки": new Date(reg.created_at).toLocaleDateString('ru-RU'),
      "Мероприятие": reg.news?.title || "Удаленное мероприятие",
      "ФИО ученика": reg.student_name,
      "Класс": reg.student_class,
      "Руководитель (email)": reg.teacher_email
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки");
    XLSX.writeFile(workbook, `Заявки_Олимпиады_${new Date().toLocaleDateString('ru-RU')}.xlsx`);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let image_url = null;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('news-images').upload(fileName, file);
      if (uploadError) {
        alert("Ошибка при загрузке картинки: " + uploadError.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('news-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }

    const { error } = await supabase.from("news").insert([{ title, category, date, excerpt, content, image_url }]);
    if (error) alert("Ошибка при сохранении: " + error.message);
    else {
      alert("Новость успешно опубликована!");
      setTitle(""); setDate(""); setExcerpt(""); setContent(""); setFile(null);
    }
    setLoading(false);
  };

  // 1. Форма входа для всех неавторизованных
  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Вход в систему</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email (Admin / Учитель)" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" required />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" required />
          <button type="submit" disabled={loading} className="mt-2 bg-blue-900 text-white p-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    );
  }

  // 2. Личный кабинет УЧИТЕЛЯ (если нет метки admin)
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Личный кабинет</h2>
        <p className="text-neutral-600 mb-6">
          Вы успешно авторизованы как <span className="font-medium text-neutral-900">{session.user.email}</span>.
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          Теперь вам доступна запись учеников. Перейдите на страницу нужного мероприятия, чтобы заполнить форму регистрации.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="bg-blue-900 text-white p-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Перейти к списку мероприятий
          </Link>
          <button onClick={() => supabase.auth.signOut()} className="mt-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  }

  // 3. Личный кабинет АДМИНИСТРАТОРА
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8 border-b border-neutral-200 pb-4">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab("news")} className={`text-2xl font-bold tracking-tight transition-colors ${activeTab === "news" ? "text-blue-900" : "text-neutral-400 hover:text-blue-800"}`}>
            Публикация
          </button>
          <span className="text-2xl text-neutral-300">/</span>
          <button onClick={() => setActiveTab("registrations")} className={`text-2xl font-bold tracking-tight transition-colors ${activeTab === "registrations" ? "text-blue-900" : "text-neutral-400 hover:text-blue-800"}`}>
            База заявок
          </button>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          Выйти из аккаунта
        </button>
      </div>

      {activeTab === "news" && (
        <form onSubmit={handleAddNews} className="flex flex-col gap-5 bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Обложка (картинка)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="p-2 border border-neutral-300 rounded-lg focus:outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Заголовок</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Тип</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white">
                <option value="Олимпиада">Олимпиада</option>
                <option value="Конкурс">Конкурс</option>
                <option value="Хакатон">Хакатон</option>
                <option value="Программа">Программа</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Дата</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Анонс</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">Контент</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y" required />
          </div>
          <button type="submit" disabled={loading} className="mt-4 bg-blue-900 text-white p-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50">
            {loading ? "Сохранение..." : "Опубликовать"}
          </button>
        </form>
      )}

      {activeTab === "registrations" && (
        <div className="bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Список всех зарегистрированных участников</h3>
            <button onClick={exportToExcel} disabled={registrations.length === 0} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Скачать Excel
            </button>
          </div>
          {loadingRegs ? (
            <div className="text-center py-8 text-neutral-500">Загрузка данных...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500">Пока нет ни одной заявки.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-900 font-medium">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Ученик</th>
                    <th className="p-4">Класс</th>
                    <th className="p-4">Мероприятие</th>
                    <th className="p-4">Руководитель (Email)</th>
                    <th className="p-4 rounded-tr-lg">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-medium text-neutral-900">{reg.student_name}</td>
                      <td className="p-4">{reg.student_class}</td>
                      <td className="p-4 max-w-[200px] truncate" title={reg.news?.title}>{reg.news?.title || "Мероприятие удалено"}</td>
                      <td className="p-4">{reg.teacher_email}</td>
                      <td className="p-4 whitespace-nowrap">{new Date(reg.created_at).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
