'use client';
import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function PBLPage() {
    const [time, setTime] = useState(0);
    const [isWarning, setIsWarning] = useState(false);
    const [isStop, setIsStop] = useState(false);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => {
                const newTime = prevTime + 1;

                // 8-10 Mins Warning (480s - 600s)
                if (newTime >= 480 && newTime < 600) {
                    setIsWarning(true);
                }
                // 10 Mins Stop (600s)
                else if (newTime >= 600) {
                    setIsStop(true);
                    clearInterval(timer);
                    return 600;
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const initChart = () => {
        if (typeof window !== 'undefined' && window.Chart && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Manual Workflow', 'HappyInvoice'],
                    datasets: [{
                        data: [25, 100],
                        backgroundColor: ['#1e293b', '#3b82f6'],
                        borderRadius: 15,
                        barThickness: 50
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#ffffff05' }, ticks: { color: '#475569' } },
                        x: { grid: { display: false }, ticks: { color: '#475569' } }
                    }
                }
            });
        }
    };

    return (
        <>
            <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/chart.js" onLoad={initChart} />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                body { background-color: #020617; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; scroll-behavior: smooth; }
                .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); }
                .gradient-text { background: linear-gradient(90deg, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                /* TIMER UI - FIXED CONTRAST */
                #timerContainer { background: #ffffff; color: #020617; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border: 3px solid #3b82f6; z-index: 1000; }
                @keyframes flicker { 0%, 100% { background-color: #ffffff; } 50% { background-color: #fca5a5; } }
                .timer-warning { animation: flicker 1s infinite; border: 3px solid #ef4444 !important; color: #b91c1c !important; }
                .timer-stop { background-color: #991b1b !important; color: #ffffff !important; border: 3px solid #f87171 !important; animation: none; }
            `}</style>

            <div id="timerContainer" className={`fixed bottom-10 right-10 px-8 py-4 rounded-3xl flex items-center gap-4 transition-all ${isWarning ? 'timer-warning' : ''} ${isStop ? 'timer-stop' : ''}`}>
                <i className={`fas ${isStop ? 'fa-hourglass-end' : isWarning ? 'fa-hourglass-half' : 'fa-hourglass-start'} text-blue-600 text-2xl`}></i>
                <span id="displayTime" className="text-4xl font-black font-mono tracking-tighter">{formatTime(time)}</span>
            </div>

            <nav className="fixed w-full z-50 glass border-b border-slate-800/50 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded flex items-center justify-center shadow-md" style={{ height: '48px', width: '130px' }}>
                        {/* Placeholder logic for image error handling is simpler with standard img tag providing fallback via onError if needed, keeping it simple here */}
                        <img src="mujlogo.png" alt="MUJ" className="h-full w-auto object-contain" onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=MUJ'} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-xl font-black text-white leading-none uppercase tracking-tighter">PBL <span className="text-blue-500 italic">2026</span></span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dept. of Computer Science & Engineering</span>
                    </div>
                </div>
                <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-bold opacity-70">
                    <a href="#problem" className="hover:text-blue-400 transition">Problem</a>
                    <a href="#methodology" className="hover:text-blue-400 transition">Methodology</a>
                    <a href="#results" className="hover:text-blue-400 transition">Results</a>
                    <a href="#team" className="hover:text-blue-400 transition">Team</a>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-48 pb-32 space-y-32">

                <section className="text-center">
                    <div className="inline-block px-4 py-1 border border-slate-800 rounded-full text-slate-500 text-[10px] font-mono mb-6 uppercase tracking-widest">ID: 2427030309</div>
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-8 uppercase leading-tight"><span className="gradient-text uppercase">HappyInvoice</span></h1>
                    <p className="text-slate-400 max-w-2xl mx-auto italic text-lg leading-relaxed border-l-2 border-blue-500/30 pl-6 text-left">
                        "Hypothesis: Centralize the entire client project lifecycle for freelancers, startups, and small agencies into a single, smart workspace to eliminate administrative chaos."
                    </p>
                </section>

                <section id="problem" className="grid md:grid-cols-2 gap-12 items-stretch">
                    <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-center border-l-4 border-blue-600">
                        <h2 className="text-3xl font-extrabold mb-6">Problem Statement</h2>
                        <p className="text-slate-400 leading-relaxed text-justify">
                            Freelancers face "administrative chaos" due to fragmented workflows. Communication, invoicing, and contracts are scattered across apps like WhatsApp & Excel, leading to lost time and payment delays.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="glass p-7 rounded-3xl border-r-4 border-blue-500/50">
                            <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">Current Bottlenecks</h3>
                            <p className="text-sm text-slate-500 italic">Scattered Communication, Manual Invoicing Errors, and Cash Flow Instability due to lack of tracking.</p>
                        </div>
                        <div className="glass p-7 rounded-3xl border-r-4 border-purple-500/50">
                            <h3 className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">Proposed Innovation</h3>
                            <p className="text-sm text-slate-500 italic">A "One-Tap Automated Workflow" (Proposal → Contract → Invoice → Payment) with AI-powered dispute handling.</p>
                        </div>
                    </div>
                </section>

                <section id="methodology" className="space-y-12">
                    <h2 className="text-4xl font-black text-center uppercase tracking-tight">System <span className="text-blue-500">Architecture</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass p-8 rounded-3xl text-center">
                            <i className="fas fa-layer-group text-blue-500 text-3xl mb-4"></i>
                            <h3 className="font-bold mb-2 uppercase text-xs tracking-widest">Tech Stack</h3>
                            <p className="text-sm text-slate-500">Next.js, Tailwind CSS, Firebase (Auth/Functions), Firestore NoSQL</p>
                        </div>
                        <div className="glass p-8 rounded-3xl text-center">
                            <i className="fas fa-brain text-purple-500 text-3xl mb-4"></i>
                            <h3 className="font-bold mb-2 uppercase text-xs tracking-widest">AI & Logic</h3>
                            <p className="text-sm text-slate-500">OpenAI API for Proposals/Disputes & Razorpay/Stripe for Payments</p>
                        </div>
                        <div className="glass p-8 rounded-3xl text-center border-2 border-green-500/20 bg-green-500/5">
                            <i className="fas fa-bolt text-green-500 text-3xl mb-4"></i>
                            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-green-400">Live Execution</h3>
                            <a href='https://github.com/isyedsamad/happyinvoice' target='_blank' rel='noopener noreferrer'><div className="px-6 py-2 bg-green-600 rounded-full text-[10px] font-black hover:bg-green-500 transition shadow-lg shadow-green-900/40 uppercase">
                                View Code / Demo
                            </div></a>
                        </div>
                    </div>
                </section>

                <section id="results" className="glass p-12 rounded-[3.5rem] border-t-4 border-blue-500">
                    <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tight">Projected <span className="text-blue-500">Impact</span></h2>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="h-80"><canvas ref={chartRef} id="resultsChart"></canvas></div>
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-white/5 flex justify-between items-center border border-white/10 shadow-inner">
                                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Time Efficiency</span>
                                <span className="text-blue-400 font-mono font-black text-3xl">75%</span>
                            </div>
                            <p className="text-slate-500 text-sm italic text-justify leading-relaxed">
                                By automating administrative tasks, we achieve a 75% reduction in manual work, 100% transparency for clients, and 2x faster payments via automated reminders.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="team" className="text-center pt-10 border-t border-slate-900">
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-12">Project Team</h2>
                    <div className="flex flex-wrap justify-center gap-10">
                        <div className="glass px-12 py-8 rounded-[2rem] border-b-4 border-blue-600">
                            <p className="text-[9px] font-semibold text-blue-500 mb-2 uppercase tracking-widest">Project Guide</p>
                            <p className="font-bold text-xl text-slate-100">Dr. Aditya Sinha</p>
                        </div>
                        <div className="glass px-12 py-8 rounded-[2rem] border-b-4 border-blue-600">
                            <p className="text-[9px] font-semibold text-blue-500 mb-2 uppercase tracking-widest">Project Lead</p>
                            <p className="font-bold text-xl text-slate-100">Syed Samad Yaqoob</p>
                            <p className="text-[10px] text-slate-500 mt-1">Reg No: 2427030309</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 text-center bg-black/40 border-t border-slate-900">
                <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Manipal University Jaipur</p>
                <p className="text-slate-500 text-[9px] font-medium tracking-[0.2em] uppercase opacity-50">Department of Computer Science & Engineering • 2026</p>
            </footer>
        </>
    );
}