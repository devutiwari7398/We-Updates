import Link from 'next/link';
import { ArrowUpRight, GraduationCap, Mail } from 'lucide-react';

export function Footer() {
  return <footer className="mt-auto bg-slate-950 text-slate-300"><div className="container py-14 sm:py-16">
    <div className="grid gap-12 lg:grid-cols-[1.45fr_.7fr_.7fr_1fr]"><div>
      <Link href="/" className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.04em] text-white">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-sky">
        <GraduationCap size={19}/></span>WeUpdates</Link>
        <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">Thoughtfully crafted learning for people building their next chapter.</p>
        </div><div><h3 className="text-sm font-extrabold text-white">Explore</h3><div className="mt-5 grid gap-3 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white">All courses</Link><Link href="/about" className="hover:text-white">About us</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy-policy">
  Privacy Policy
</Link>
<Link href="/terms-and-conditions">
  Terms & Conditions
</Link></div>
</div><div><h3 className="text-sm font-extrabold text-white">Categories</h3>
<div className="mt-5 grid gap-3 text-sm text-slate-400"><Link href="/courses" className="hover:text-white">Programming</Link>
<Link href="/courses" className="hover:text-white">AI & Data</Link><Link href="/courses" className="hover:text-white">Career skills</Link>
</div></div><div><h3 className="text-sm font-extrabold text-white">A useful note, weekly</h3>
<p className="mt-4 text-sm leading-6 text-slate-400">Fresh ideas and practical learning inspiration in your inbox.</p>
<Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white">
<Mail size={15}/> weupdatesoffical@gmail.com <ArrowUpRight size={14}/></Link>
</div></div><div className="mt-14 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
  <span>© 2026 WeUpdates. Learn skills. Build your future.</span><span>Made for curious learners everywhere.</span>
  </div></div></footer>;
}
