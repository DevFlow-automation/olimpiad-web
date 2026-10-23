"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RegistrationForm({ olympiadId }: { olympiadId: string }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("registrations").insert([{
      olympiad_id: olympiadId,
      student_name: studentName,
      student_class: studentClass,
      teacher_email: session.user.email
    }]);

    if (error) {
      alert("Ошибка при регистрации: " + error.message);
    } else {
      setSuccess(true);
      setStudentName(""); // Мгновенно очищаем для следующего
      setStudentClass("");
      setTimeout(() => setSuccess(false), 3000); // Убираем плашку через 3 секунды
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="animate-pulse h-32 bg-neutral-100 rounded-2xl mt-8"></div>;

  if (!session) {
    return (
      <div className="mt-12 p-6 bg-neutral-50 border border-neutral-200 rounded-2xl text-center">
        <h3 className="text-lg font-semibold mb-2">Регистрация участников</h3>
        <p className="text-neutral-600 mb-4">Для записи учеников на это мероприятие необходимо войти в систему.</p>
        <Link href="/admin" className="inline-flex items-center justify-center bg-neutral-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors">
          Войти в личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 p-6 md:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl">
      <h3 className="text-2xl font-bold tracking-tight mb-2">Записать ученика</h3>
      <p className="text-neutral-600 mb-6">Вы вошли как: <span className="font-medium text-neutral-900">{session.user.email}</span></p>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium animate-pulse">
          ✅ Ученик записан! Можете сразу вводить следующего.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-neutral-700">ФИО ученика</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Например: Иванов Иван"
            className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-48">
          <label className="text-sm font-medium text-neutral-700">Класс</label>
          <input
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="Например: 10 А"
            className="p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto whitespace-nowrap bg-neutral-900 text-white p-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Отправка..." : "Зарегистрировать"}
        </button>
      </form>
    </div>
  );
}
