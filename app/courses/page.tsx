'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories, courses } from '@/data/courses';
import { CourseCard } from '@/components/CourseCard';

const pageSize = 6;

export default function Courses() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [price, setPrice] = useState('All');
  const [sort, setSort] = useState('Popular');
  const [page, setPage] = useState(1);
  const list = useMemo(() => courses.filter((course) => {
    const matchesPrice = price === 'All' || (price === 'Under $25' ? course.price < 25 : price === '$25–$49' ? course.price >= 25 && course.price < 50 : course.price >= 50);
    return (category === 'All' || course.category === category) && (type === 'All' || course.type === type) && matchesPrice && `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(query.toLowerCase());
  }).sort((a,b) => sort === 'Price: low to high' ? a.price-b.price : sort === 'Price: high to low' ? b.price-a.price : sort === 'Rating' ? b.rating-a.rating : b.students-a.students), [query, category, type, price, sort]);
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleCourses = list.slice((activePage - 1) * pageSize, activePage * pageSize);
  const resetPage = () => setPage(1);
  return <>
    <section className="bg-slate-950 py-16 text-white"><div className="container"><p className="eyebrow text-blue-300">Explore the catalogue</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Courses built for your next move.</h1><p className="mt-4 max-w-2xl text-slate-300">Focused PDF guides and in-depth video courses for practical progress, whenever and wherever you learn best.</p></div></section>
    <section className="section"><div className="container"><div className="rounded-2xl border bg-white p-3 shadow-soft"><div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]"><label className="flex items-center gap-2 rounded-xl bg-slate-50 px-4"><Search size={18} className="text-slate-400"/><input value={query} onChange={e => {setQuery(e.target.value);resetPage();}} className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Search courses, skills, or instructors" aria-label="Search courses"/></label><select value={category} onChange={e => {setCategory(e.target.value);resetPage();}} className="rounded-xl border px-3 py-3 text-sm" aria-label="Filter by category">{categories.map(item => <option key={item}>{item}</option>)}</select><select value={type} onChange={e => {setType(e.target.value);resetPage();}} className="rounded-xl border px-3 py-3 text-sm" aria-label="Filter by course type"><option>All</option><option>PDF</option><option>Video</option></select><select value={price} onChange={e => {setPrice(e.target.value);resetPage();}} className="rounded-xl border px-3 py-3 text-sm" aria-label="Filter by price"><option>All</option><option>Under $25</option><option>$25–$49</option><option>$50 and up</option></select><select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl border px-3 py-3 text-sm" aria-label="Sort courses"><option>Popular</option><option>Rating</option><option>Price: low to high</option><option>Price: high to low</option></select></div></div><div className="mt-8 flex items-center justify-between"><p className="text-sm text-slate-600"><b className="text-ink">{list.length}</b> courses found</p><span className="inline-flex items-center gap-2 text-sm text-slate-500"><SlidersHorizontal size={16}/> Filters update instantly</span></div>{visibleCourses.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visibleCourses.map(course => <CourseCard key={course.slug} course={course}/>)}</div> : <div className="mt-6 rounded-2xl border border-dashed p-12 text-center"><h2 className="text-xl font-bold">No courses match those filters</h2><p className="mt-2 text-sm text-slate-600">Try another search, category, or price range.</p><button onClick={() => {setQuery('');setCategory('All');setType('All');setPrice('All');resetPage();}} className="btn btn-secondary mt-5">Clear filters</button></div>}{totalPages > 1 && <nav className="mt-12 flex justify-center gap-2" aria-label="Course pages"><button onClick={() => setPage(Math.max(1, activePage-1))} disabled={activePage === 1} className="rounded-lg border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Previous</button>{Array.from({length:totalPages}, (_, index) => <button onClick={() => setPage(index+1)} aria-current={activePage === index+1 ? 'page' : undefined} className={`rounded-lg px-4 py-2 text-sm font-bold ${activePage === index+1 ? 'bg-brand text-white' : 'border'}`} key={index}>{index+1}</button>)}<button onClick={() => setPage(Math.min(totalPages, activePage+1))} disabled={activePage === totalPages} className="rounded-lg border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Next</button></nav>}</div></section>
  </>;
}
