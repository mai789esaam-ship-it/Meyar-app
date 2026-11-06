"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Subjects() {
  const [fac, setFac] = useState<any[]>([]);
  const [yrs, setYrs] = useState<any[]>([]);
  const [sem, setSem] = useState<any[]>([]);
  const [f, setF] = useState(""); const [y, setY] = useState(""); const [s, setS] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("faculties").select("id,name_ar,universities(name_ar)"),
        supabase.from("academic_years").select("*").order("year_no"),
        supabase.from("semesters").select("*").order("semester_no"),
      ]);
      if (a.error) { setErr(a.error.message); return; }
      setFac(a.data ?? []); setYrs(b.data ?? []); setSem(c.data ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!f || !y || !s) { setRows([]); return; }
    supabase.from("subjects").select("id,name_ar").eq("faculty_id", f).eq("academic_year_id", y).eq("semester_id", s)
      .then(({ data, error }) => { if (error) setErr(error.message); setRows(data ?? []); });
  }, [f, y, s]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">المواد الجامعية</h1>
      <div className="grid sm:grid-cols-3 gap-2 mb-4">
        <select className="inp" value={f} onChange={(e) => setF(e.target.value)}>
          <option value="">الجامعة</option>
          {fac.map((x) => <option key={x.id} value={x.id}>{x.universities?.name_ar}</option>)}
        </select>
        <select className="inp" value={y} onChange={(e) => setY(e.target.value)}>
          <option value="">الفرقة</option>
          {yrs.map((x) => <option key={x.id} value={x.id}>{x.name_ar}</option>)}
        </select>
        <select className="inp" value={s} onChange={(e) => setS(e.target.value)}>
          <option value="">الفصل</option>
          {sem.map((x) => <option key={x.id} value={x.id}>{x.name_ar}</option>)}
        </select>
      </div>
      {err && <p className="text-red-700">{err}</p>}
      {f && y && s && rows.length === 0 && <p>لا توجد مواد مضافة بعد. تضيفها من لوحة الإدارة.</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((r) => <Link key={r.id} href={`/subjects/${r.id}`} className="card font-bold">{r.name_ar}</Link>)}
      </div>
    </div>
  );
}
