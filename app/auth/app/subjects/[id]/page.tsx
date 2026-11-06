"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Subject() {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("subjects").select("name_ar").eq("id", id).single().then(({ data }) => setSubject(data));
    supabase.from("courses").select("id,title_ar,price_type,price_egp").eq("subject_id", id).then(({ data }) => setCourses(data ?? []));
  }, [id]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{subject?.name_ar}</h1>
      {courses.length === 0 && <p>لا توجد كورسات منشورة لهذه المادة بعد.</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {courses.map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`} className="card">
            <b>{c.title_ar}</b>
            <div className="text-sm">{c.price_type === "free" ? "مجاني" : `${c.price_egp} جنيه`}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
