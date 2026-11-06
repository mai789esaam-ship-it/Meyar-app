"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) setMsg(error.message); else router.push("/dashboard");
    } else if (mode === "register") {
      if (pass.length < 8) { setMsg("كلمة المرور 8 أحرف على الأقل"); setBusy(false); return; }
      const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
      if (error) setMsg(error.message);
      else if (data.session) router.push("/dashboard");
      else setMsg("تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد ثم سجّل الدخول.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/update` });
      setMsg(error ? error.message : "أرسلنا رابط استعادة كلمة المرور إلى بريدك.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-3 mt-8">
      <h1 className="text-2xl font-bold">
        {mode === "login" ? "تسجيل الدخول" : mode === "register" ? "إنشاء حساب" : "استعادة كلمة المرور"}
      </h1>
      {mode === "register" && <input className="inp" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required />}
      <input className="inp" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {mode !== "reset" && <input className="inp" type="password" placeholder="كلمة المرور" value={pass} onChange={(e) => setPass(e.target.value)} required />}
      <button className="btn w-full" disabled={busy}>{busy ? "..." : "متابعة"}</button>
      {msg && <p className="text-sm">{msg}</p>}
      <div className="flex gap-4 text-sm underline">
        <button type="button" onClick={() => setMode("login")}>دخول</button>
        <button type="button" onClick={() => setMode("register")}>حساب جديد</button>
        <button type="button" onClick={() => setMode("reset")}>نسيت كلمة المرور</button>
      </div>
    </form>
  );
}
