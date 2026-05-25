

"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import PromoSection from "@/components/PromoSection";
import { UserPlus, ShieldCheck, Rocket, User } from "lucide-react";
import Footer from "@/components/Footer";
import TextAnimation from "@/components/TextAnimation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const steps = [
  {
    step: "01",
    icon: <UserPlus className="w-6 h-6" />,
    title: "Sign up",
    desc: "Create your expert profile and record a short video to introduce your teaching style.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    step: "02",
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Get verified",
    desc: "Complete the verification fee. Our quality team reviews your credentials within 48 hours.",
    color: "bg-[#43d2b1]/10 text-[#43d2b1]",
  },
  {
    step: "03",
    icon: <Rocket className="w-6 h-6" />,
    title: "Start earning",
    desc: "Once approved, set your own rates and start receiving bookings from students globally.",
    color: "bg-purple-50 text-purple-600",
  },
];

export default function BecomeTutorPage() {
  const ctaStyling = "px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg text-center hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95";

  return (
    <main className="bg-white pt-20">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight">
            Make money teaching <span className="text-[#43d2b1]">online</span>
          </h1>

          <TextAnimation>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Connect with thousands of students worldwide. Set your own hours,
              choose your own rates, and teach from the comfort of your home.
            </p>
          </TextAnimation>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Logic: If Logged In, go to link. If Logged Out, show Sign In Modal */}
            <SignedIn>
              <Link href="/dashboard/tutor/profile" className={ctaStyling}>
                Get started now
              </Link>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard/tutor/profile">
                <button className={ctaStyling}>
                  Get started now
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                ].map((url, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden relative shadow-sm">
                    <Image src={url} alt={`Tutor ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-[3px] border-white bg-[#43d2b1] flex items-center justify-center text-white text-[10px] font-black shadow-sm ring-2 ring-[#43d2b1]/10">
                  +1k
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Top rated mentors</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image src="/images/tutor-hero.jpg" alt="Smiling Tutor" fill className="object-cover" priority />
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="bg-slate-50 py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-4xl font-black text-slate-900">$15 - $50</p>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Average hourly rate</p>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900">100+</p>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Subjects to teach</p>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900">Anytime</p>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Flexible schedule</p>
          </div>
        </div>
      </section>

      {/* --- PROMO SECTION --- */}
      <div className="py-20">
        <PromoSection
          title="Teach your way"
          description="SkillSphere gives you the tools to grow your own business. You decide when and how much you work."
          points={[
            "Set your own price",
            "Teach anytime, anywhere",
            "Grow your personal brand",
          ]}
          buttonText="Register as a tutor"
          buttonHref="/dashboard/tutor/profile"
          imageSrc="/images/tutor-man.png"
          bgColor="bg-[#43d2b1]"
          reverse={true}
          requireAuth={true} // New prop added
        />
      </div>

      {/* --- STEPS --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#ff6a97] font-bold tracking-widest uppercase text-xs">Simple Onboarding</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 text-slate-900">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative group">
                {index !== steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-slate-100 -z-10" />
                )}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-black text-slate-300 tracking-tighter uppercase">Step {item.step}</span>
                    <div className="h-px flex-1 bg-slate-50" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-balance">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}