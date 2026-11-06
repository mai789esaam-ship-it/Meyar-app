import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-extrabold text-gold mb-3">مِعيار... طريقك نحو التميز القانوني</h1>
      <p className="mb-6">منصة تعليمية قانونية تجمع بين الدراسة الأكاديمية والتأهيل المهني.</p>
      <Link href="/subjects" className="btn">ابدأ التعلم</Link>
    </section>
  );
}
