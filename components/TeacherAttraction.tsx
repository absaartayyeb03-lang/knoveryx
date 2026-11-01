"use client";

import { TEACHER_PATHWAYS } from "@/constants/teacher-info";
import {
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  MessageSquare,
  Rocket,
} from "lucide-react";
import { Button } from "./ui/button";
import { InquiryForm } from "./InquiryForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TextAnimation from "./TextAnimation";
import Link from "next/link";

export const TeacherAttraction = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <TextAnimation delay={0.2}>
            <h2 className="text-sm font-bold tracking-widest text-[#366740] uppercase mb-4">
              Global Educational Excellence
            </h2>
          </TextAnimation>
          <TextAnimation>
            <h3 className="text-4xl font-extrabold text-[#033D8B] sm:text-6xl tracking-tight leading-[1.1]">
              Teach & Learn <br className="hidden sm:block" /> Across Borders.
            </h3>
          </TextAnimation>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Knoveryx is the global bridge for expertise. We map teaching to
            International, British, and Regional boards through a unified
            curriculum engine.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {TEACHER_PATHWAYS.map((path) => (
            <Dialog key={path.title}>
              <DialogTrigger asChild>
                <div
                  className={`group cursor-pointer relative p-8 md:p-10 rounded-[2.5rem] border-2 ${path.border} ${path.bg} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full`}
                >
                  <div className="mb-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${path.text} bg-white border ${path.border}`}
                    >
                      {path.grades}
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-6">
                    {path.title}
                  </h4>

                  <div className="space-y-8 flex-grow text-left">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Global Alignment
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {path.boards.map((board) => (
                          <span
                            key={board}
                            className="text-[11px] font-medium bg-white px-3 py-1 rounded-lg border border-gray-100 text-gray-600"
                          >
                            {board}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Core Subjects
                      </p>
                      <ul className="space-y-3">
                        {path.subjects.map((sub) => (
                          <li
                            key={sub}
                            className="flex items-start text-sm font-medium text-gray-700"
                          >
                            <CheckCircle2 className="w-5 h-5 mr-3 text-[#366740] shrink-0 mt-0.5" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-200/50 flex items-center text-[#033D8B] font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                    Inquire for this Pathway{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-6 md:p-10 border-none shadow-2xl">
                <DialogHeader className="space-y-3 text-left">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
                    <MessageSquare className="text-[#033D8B] w-6 h-6" />
                  </div>
                  <DialogTitle className="text-3xl font-bold tracking-tight text-[#033D8B]">
                    Parent Inquiry
                  </DialogTitle>
                  <DialogDescription className="text-base text-gray-500">
                    Inquiring about{" "}
                    <span className="font-bold text-[#366740]">
                      {path.title}
                    </span>
                    . Our team will contact you via Gmail and WhatsApp.
                  </DialogDescription>
                </DialogHeader>
                <InquiryForm subject={path.title} />
              </DialogContent>
            </Dialog>
          ))}
        </div>
        <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto bg-slate-50/80 rounded-[3rem] p-8 md:p-16 border border-slate-100 overflow-hidden relative shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            {/* International Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="bg-[#366740]/10 text-[#366740] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#366740]/20">
                Global Learning Hub
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Master Any Subject, <br />
              <span className="text-[#033D8B]">From Anywhere.</span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Knoveryx connects you with world-class tutors across British, International, and Professional curriculums through a borderless platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/become-a-tutor" className="w-full sm:w-auto">
                <button className="w-full bg-[#033D8B] hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
                  Join the Community <Rocket className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/tutors" className="w-full sm:w-auto">
                <button className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-8 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5 text-[#366740]" /> Browse Tutors
                </button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center items-center">
            {/* Brand Glow using Forest Green */}
            <div className="absolute inset-0 bg-[#366740]/5 blur-[120px] rounded-full" />

            <div className="relative z-10 w-full max-w-[500px]">
              <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl" aria-label="Knoveryx tutor illustration">
                {/* Background circle */}
                <circle cx="240" cy="240" r="220" fill="#f0fdf4" />
                <circle cx="240" cy="240" r="180" fill="#dcfce7" opacity="0.6" />
                {/* Desk */}
                <rect x="80" y="310" width="320" height="16" rx="8" fill="#174933" />
                <rect x="110" y="326" width="12" height="60" rx="6" fill="#174933" />
                <rect x="358" y="326" width="12" height="60" rx="6" fill="#174933" />
                {/* Laptop base */}
                <rect x="130" y="270" width="220" height="40" rx="8" fill="#1e293b" />
                <rect x="140" y="275" width="200" height="30" rx="4" fill="#334155" />
                {/* Laptop screen */}
                <rect x="150" y="150" width="180" height="128" rx="10" fill="#1e293b" />
                <rect x="158" y="158" width="164" height="112" rx="6" fill="#033D8B" />
                {/* Screen content lines */}
                <rect x="170" y="172" width="80" height="8" rx="4" fill="white" opacity="0.9" />
                <rect x="170" y="188" width="120" height="6" rx="3" fill="white" opacity="0.5" />
                <rect x="170" y="202" width="100" height="6" rx="3" fill="white" opacity="0.5" />
                <rect x="170" y="216" width="60" height="6" rx="3" fill="#43d2b1" opacity="0.9" />
                {/* Video call avatar on screen */}
                <circle cx="282" cy="210" r="28" fill="#ff6a97" opacity="0.3" />
                <circle cx="282" cy="203" r="12" fill="#ff6a97" />
                <path d="M262 230 Q282 218 302 230" stroke="#ff6a97" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Person/tutor silhouette */}
                <circle cx="240" cy="110" r="36" fill="#174933" />
                <circle cx="240" cy="104" r="22" fill="#fde68a" />
                {/* Face details */}
                <circle cx="233" cy="102" r="2.5" fill="#1e293b" />
                <circle cx="247" cy="102" r="2.5" fill="#1e293b" />
                <path d="M234 110 Q240 115 246 110" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Body */}
                <path d="M200 270 Q210 230 240 225 Q270 230 280 270" fill="#033D8B" />
                {/* Floating globe */}
                <circle cx="370" cy="170" r="32" fill="white" stroke="#43d2b1" strokeWidth="2" />
                <ellipse cx="370" cy="170" rx="32" ry="14" stroke="#43d2b1" strokeWidth="1.5" fill="none" />
                <line x1="338" y1="170" x2="402" y2="170" stroke="#43d2b1" strokeWidth="1.5" />
                <line x1="370" y1="138" x2="370" y2="202" stroke="#43d2b1" strokeWidth="1.5" />
                {/* Stars / sparkles */}
                <circle cx="108" cy="160" r="5" fill="#ff6a97" />
                <circle cx="108" cy="160" r="8" fill="#ff6a97" opacity="0.2" />
                <circle cx="390" cy="290" r="4" fill="#43d2b1" />
                <circle cx="390" cy="290" r="7" fill="#43d2b1" opacity="0.2" />
                <circle cx="130" cy="240" r="3" fill="#fbbf24" />
              </svg>
              
              {/* Floating Success Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-2xl border border-slate-50 hidden lg:flex items-center gap-4">
                <div className="w-12 h-12 bg-[#366740] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/20">
                  24/7
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Support</p>
                  <p className="font-bold text-slate-900">Always available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      </div>
    </section>
  );
};
