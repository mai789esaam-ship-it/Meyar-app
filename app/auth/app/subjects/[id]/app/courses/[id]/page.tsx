"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [logged, setLogged] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    setLogged(!!s.session);
    const { data: c } = await supabase.from("courses").select("*").eq("id", id).single();
    setCourse(c);
    if (s.session) {
      const { data: e } = await supabase.from("enrollments").select("id").eq("course_id", id).maybeSingle();
      setEnrolled(!!e);
    }
    // RLS returns lectures only for enrolled students
    const { data: l } = await supabase.from("lectures").select("*").eq("course_id", id).order("position");
    setLectures(l ?? []);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function enroll() {
    setMsg("");
    if (course.price_type === "free") {
      const { error } = await supabase.rpc("enroll_free", { cid: id });
      if (error) setMsg(error.message); else load();
    } else {
      const { error } = await supabase.rpc("create_order", { cid: id });
      setMsg(error ? error.message : "تم إنشاء طلب بحالة «معلّق». الدفع الإلكتروني لم يُفعَّل بعد، وسيُفتح الكورس بعد تأكيد الدفع.");
    }
  }

  if (!course) return <p>...</p>;
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{course.title_ar}</h1>
      <p>{course.description}</p>
      <p className="font-bold">{course.price_type === "free" ? "مجاني" : `${course.price_egp} جنيه`}</p>
      {!logged ? <Link href="/auth" className="btn inline-block">سجّل الدخول للالتحاق</Link>
        : enrolled ? <p className="text-green-800 font-bold">أنت ملتحق بهذا الكورس</p>
        : <button className="btn" onClick={enroll}>{course.price_type === "free" ? "التحق مجاناً" : "اطلب الكورس"}</button>}
      {msg && <p className="text-sm">{msg}</p>}
      {enrolled && (
        <ul className="space-y-2">
          {lectures.map((l) => (
            <li key={l.id} className="card">
              <b>{l.title}</b>
              <div className="flex gap-3 text-sm underline">
                {l.video_url && <a href={l.video_url} target="_blank" rel="noreferrer">فيديو</a>}
                {l.zoom_url && <a href={l.zoom_url} target="_blank" rel="noreferrer">Zoom</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
