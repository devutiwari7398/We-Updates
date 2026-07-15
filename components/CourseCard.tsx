'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileText, PlayCircle, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Course } from '@/data/courses';

export function CourseCard({course}:{course:Course}) {
  return <motion.article initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} whileHover={{y:-6}} transition={{duration:.25}} className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,.055)] transition-shadow hover:shadow-[0_18px_42px_rgba(15,23,42,.12)]">
    <Link href={`/courses/${course.slug}`} className="relative block aspect-[1.68] overflow-hidden bg-slate-100"><Image fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" src={course.image} alt={course.title} className="object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/35 to-transparent"/><span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 backdrop-blur">{course.type==='PDF'?<FileText size={12}/>:<PlayCircle size={12}/>} {course.type} course</span></Link>
    <div className="flex flex-1 flex-col p-5 sm:p-6"><div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[.1em]"><span className="text-brand">{course.category}</span><span className="flex items-center gap-1 normal-case tracking-normal text-amber-500"><Star size={14} fill="currentColor"/>{course.rating}</span></div><h3 className="mt-3 text-[19px] font-extrabold leading-snug tracking-[-.025em] text-ink">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{course.description}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500"><span className="font-semibold text-slate-700">{course.instructor}</span><span className="flex items-center gap-1.5"><Users size={13}/>{course.students.toLocaleString()}</span></div><div className="mt-5 flex items-center justify-between"><div><span className="text-xl font-extrabold tracking-tight text-ink">${course.price}</span><span className="ml-2 text-xs text-slate-400 line-through">${course.originalPrice}</span></div><Link href={`/courses/${course.slug}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-brand transition group-hover:bg-brand group-hover:text-white" aria-label={`View ${course.title}`}><ArrowUpRight size={17}/></Link></div></div>
  </motion.article>;
}
