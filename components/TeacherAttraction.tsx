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
            SkillSphere is the global bridge for expertise. We map teaching to
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
              SkillSphere connects you with world-class tutors across British, International, and Professional curriculums through a borderless platform.
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
              <img
                src="/images/path-to-your-illustration.png" 
                alt="International SkillSphere Tutor"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
              />
              
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
