"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePassword() {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pass });
    if (error) setMsg(error.message); else router.push("/dashboard");
  }
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-3 mt-8">
      <h1 className="text-2xl font-bold">كلمة مرور جديدة</h1>
      <input className="inp" type="password" minLength={8} value={pass} onChange={(e) => setPass(e.target.value)} required />
      <button className="btn w-full">حفظ</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
