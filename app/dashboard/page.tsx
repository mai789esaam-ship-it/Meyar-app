"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);
  const [name, setName] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      setLogged(!!s.session); setReady(true);
      if (!s.session) return;
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", s.session.user.id).single();
      setName(p?.full_name ?? "");
      const { data } = await supabase.from("enrollments").select("id,status,courses(id,title_ar)");
      setRows(data ?? []);
    })();
  }, []);
  if (!ready) return <p>...</p>;
  if (!logged) return <Link href="/auth" className="btn inline-block">سجّل الدخول أولاً</Link>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">أهلاً {name}</h1>
      <h2 className="font-bold mb-2">كورساتي</h2>
      {rows.length === 0 && <p>لم تلتحق بأي كورس بعد.</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((r) => <Link key={r.id} href={`/courses/${r.courses?.id}`} className="card">{r.courses?.title_ar}</Link>)}
      </div>
    </div>
  );
}
