'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About'], ['/contact', 'Contact']];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
    <div className="container flex h-[72px] items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.04em] text-ink" aria-label="WeUpdates home"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-sky text-white shadow-lg shadow-blue-200"><GraduationCap size={19}/></span>We<span className="text-brand">Updates</span></Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">{links.map(([href,label]) => <Link className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-brand" href={href} key={href}>{label}</Link>)}</nav>
      <div className="hidden items-center gap-2 md:flex"><button type="button" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:text-brand">Log in</button><Link href="/courses" className="btn btn-primary px-4 py-2.5">Get started <ArrowRight size={15}/></Link></div>
      <button className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    </div>
    {open && <nav className="container grid gap-1 border-t border-slate-100 bg-white py-4 md:hidden" aria-label="Mobile navigation">{links.map(([href,label]) => <Link onClick={() => setOpen(false)} href={href} key={href} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand">{label}</Link>)}<Link onClick={() => setOpen(false)} href="/courses" className="btn btn-primary mt-2">Get started <ArrowRight size={15}/></Link></nav>}
  </header>;
}
