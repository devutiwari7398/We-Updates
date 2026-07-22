import Image from 'next/image'; import { Heart, Lightbulb, Target } from 'lucide-react';
export default function About(){return <><section className="bg-slate-950 py-20 text-center text-white">
    <div className="container max-w-3xl">
        <p className="eyebrow text-blue-300">About WeUpdates</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">A better way to keep moving forward.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">We make useful learning feel focused, encouraging, and beautifully simple.</p>
        </div></section>
        <section className="section">
            <div className="container grid items-center gap-12 lg:grid-cols-2">
            <Image className="rounded-3xl object-cover" 
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1000&q=85" width={800} 
            height={600} alt="Team collaborating"/>
            <div><p className="eyebrow">Our story</p>
            <h2 className="heading">Built for the person ready to grow.</h2>
            <p className="muted mt-5">WeUpdates began with a simple belief: the right lesson at the right moment can change a
                 person&apos;s direction. We created a home for clear, practical learning that respects your time.</p>
                 <p className="muted mt-4">Whether you are beginning, changing careers, or leveling up, we want every course to 
                    leave you more capable than when you arrived.</p>
                    </div>
                    </div>
                    </section>
                    <section className="section bg-slate-50">
                        <div className="container grid gap-5 md:grid-cols-3">
                            {[[Target,'Our mission','Make practical, confidence-building learning available to everyone.'],
                            [Lightbulb,'Our vision','A world where opportunity is shaped by curiosity, not access.'],
                            [Heart,'Why we started','Because meaningful progress deserves a better learning experience.']]
                            .map(([Icon,title,copy])=>{const I=Icon as typeof Target;return <div key={title as string} 
                            className="rounded-2xl bg-white p-7 shadow-soft"><I className="text-brand"/>
                            <h2 className="mt-5 text-xl font-bold">{title as string}</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{copy as string}</p>
                            </div>})}</div></section>
                            <section className="section">
                                <div className="container">
                                    <div className="max-w-2xl">
                                        <p className="eyebrow">Learning philosophy</p>
                                        <h2 className="heading">Clear paths. Useful practice. Lasting confidence.</h2>
                                        <p className="muted mt-4">We believe learning works best when it is grounded in real outcomes. 
                                            That is why every WeUpdates course is designed around essential concepts, useful exercises, 
                                            and the next meaningful step.</p></div>
                                            <div className="mt-10 grid gap-5 sm:grid-cols-3">{['Maya Singh — Product & Learning',
                                            'Aarav Mehta — Engineering','Sofia Reyes — Learner Success'].map((x,i)=>
                                            <div className="rounded-2xl border p-6" key={x}>
                                                <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 font-bold text-brand">{i+1}</div>
                                                <p className="mt-4 font-bold">{x}</p>
                                                <p className="mt-1 text-sm text-slate-500">Building a more useful way to learn.</p>
                                                </div>)}</div></div></section></>}
