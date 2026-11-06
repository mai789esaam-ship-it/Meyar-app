"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Nav() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <header className="bg-navy text-beige sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center gap-4 p-3 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="font-extrabold text-gold text-xl">مِعيار</Link>
        <Link href="/subjects">المواد الجامعية</Link>
        <Link href="/dashboard">لوحتي</Link>
        <div className="flex-1" />
        {email ? (
          <button className="text-gold" onClick={() => supabase.auth.signOut()}>خروج</button>
        ) : (
          <Link href="/auth" className="btn">دخول / تسجيل</Link>
        )}
      </div>
    </header>
  );
}
