'use client';

import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase-browser";


const links = [['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About'], ['/contact', 'Contact']];

export function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"admin" | "student" | null>(null);

useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (
      profileRef.current &&
      !profileRef.current.contains(e.target as Node)
    ) {
      setProfileOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClick);

  return () =>
    document.removeEventListener("mousedown", handleClick);
}, []);
  
useEffect(() => {
  async function checkUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    setLoggedIn(false);
    setRole(null);
    return;
  }

  setLoggedIn(true);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  setRole(profile?.role ?? "student");
}

  checkUser();

  const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(() => {
  checkUser();
});

  return () => {
    subscription.unsubscribe();
  };
}, []);


  return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
    <div className="container flex h-[72px] items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-.04em] text-ink" aria-label="WeUpdates home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-sky 
      text-white shadow-lg shadow-blue-200"><GraduationCap size={19}/></span>We<span className="text-brand">Updates</span></Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">{links.map(([href,label]) => 
        <Link className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-brand" 
        href={href} key={href}>{label}</Link>)}</nav>
      <div className="flex items-center gap-2">
    {loggedIn ? (
  <div className="relative" ref={profileRef}>
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 hover:bg-blue-200"
    >
      <User size={20} />
    </button>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-52 rounded-xl border bg-white shadow-xl">

        <Link
    href="/profile"
    className="block px-4 py-3 hover:bg-slate-100"
    onClick={() => setProfileOpen(false)}
  >
    My Profile
  </Link>

        {role === "admin" && (
  <Link
    href="/admin"
    className="block px-4 py-3 hover:bg-slate-100"
    onClick={() => setProfileOpen(false)}
  >
    Admin Panel
  </Link>
)}

        <button
          onClick={async () => {
  await supabase.auth.signOut();

  setLoggedIn(false);
  setRole(null);

  setProfileOpen(false);

  window.location.href = "/";

  
}}
          className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-red-50"
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>
    )}
  </div>
) : (
  <>
    <Link
      href="/login"
      className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:text-brand"
    >
      Log in
    </Link>

    <Link
      href="/register"
  className="btn btn-primary px-4 py-2.5 hidden md:inline-flex"
    >
      Get Started
    </Link>
  </>
)}
</div>
      <button className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50 md:hidden" 
      onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>
        {open ? <X size={19}/> : <Menu size={19}/>}</button>
    </div>
    {open && (
  <nav
    className="container grid gap-1 border-t border-slate-100 bg-white py-4 md:hidden"
    aria-label="Mobile navigation"
  >
    {links.map(([href, label]) => (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand"
      >
        {label}
      </Link>
    ))}

    {loggedIn ? (
      <>
        <Link
          href="/profile"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
        >
          My Profile
        </Link>

        <Link
          href="/profile/my-courses"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
        >
          My Courses
        </Link>

        {role === "admin" && (
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
          >
            Admin Panel
          </Link>
        )}

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setLoggedIn(false);
            setRole(null);
            setOpen(false);
            window.location.href = "/";
          }}
          className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
        >
          Log in
        </Link>

        <Link
          href="/register"
          onClick={() => setOpen(false)}
          className="btn btn-primary mt-2"
        >
          Get Started <ArrowRight size={15} />
        </Link>
      </>
    )}
  </nav>
)}
  </header>;
}
