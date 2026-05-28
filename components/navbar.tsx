"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import { Menu, X, GraduationCap, Calendar, User, Search, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useUser();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const ADMIN_EMAIL = "your-email@example.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );

  useEffect(() => {
    async function checkUserRole() {
      if (!user) return;
      const { data, error } = await supabase
        .from("teachers")
        .select("id")
        .eq("id", user.id)
        .single();

      setIsTeacher(!!(data && !error));
    }
    checkUserRole();
  }, [user, supabase]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = !isOpen ? "hidden" : "unset";
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/main-logo.png" alt="logo" width={32} height={32} />
            <div className="flex flex-col leading-tight">
               <span className="font-bold text-lg text-gray-900 tracking-tight">Knoveryx</span>
               <span className="text-[10px] font-bold text-[#174933] uppercase tracking-widest">Education</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavItems />
            
            <SignedOut>
              <Link href="/become-a-tutor" className="text-sm font-medium hover:text-[#ff6a97] transition-colors">
                Become a Tutor
              </Link>
              <SignInButton>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-6">
                {isAdmin && (
                  <Link href="/admin/verify" className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                    <ShieldCheck size={12} /> Admin
                  </Link>
                )}

                <Link href="/tutors" className="text-sm font-medium hover:text-[#ff6a97] transition-colors">
                  Find Tutors
                </Link>

                {/* UNIFIED LINK FOR BOTH ROLES */}
                <Link href="/dashboard/lessons" className="text-sm font-medium hover:text-[#ff6a97]">
                  {isTeacher ? "Manage Lessons" : "My Bookings"}
                </Link>

                {isTeacher ? (
                  <Link href="/dashboard/tutor/profile" className="text-sm font-medium text-[#ff6a97] font-bold">
                    Tutor Profile
                  </Link>
                ) : (
                  <Link href="/become-a-tutor" className="text-sm font-medium hover:text-[#ff6a97] transition-colors">
                    Become a Tutor
                  </Link>
                )}

                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>

          <button onClick={toggleMenu} className="md:hidden p-2 text-slate-900 z-[110]">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-[105] flex flex-col md:hidden"
          >
            <div className="h-20 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="font-bold text-slate-900">Menu</span>
              <button onClick={toggleMenu} className="p-2"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SignedIn>
                <div className="px-6 py-8 flex items-center gap-4 bg-slate-50 border-b border-slate-100">
                  <UserButton />
                  <div>
                    <p className="font-bold text-slate-900 leading-none">{user?.fullName}</p>
                    <p className="text-[10px] mt-2 px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold uppercase tracking-wide w-fit">
                      {isTeacher ? "Tutor" : "Student"}
                    </p>
                  </div>
                </div>
              </SignedIn>

              <div className="flex flex-col py-2">
                <MobileActionLink href="/tutors" icon={<Search size={22}/>} label="Find Tutors" onClick={toggleMenu} />
                
                {isAdmin && (
                  <MobileActionLink 
                    href="/admin/verify" 
                    icon={<ShieldCheck size={22} className="text-amber-500" />} 
                    label="Admin Panel" 
                    onClick={toggleMenu} 
                  />
                )}
                
                <SignedIn>
                  {/* UNIFIED LINK FOR MOBILE */}
                  <MobileActionLink 
                    href="/dashboard/lessons" 
                    icon={<Calendar size={22}/>} 
                    label={isTeacher ? "Manage Lessons" : "My Bookings"} 
                    onClick={toggleMenu} 
                  />

                  {isTeacher ? (
                    <MobileActionLink href="/dashboard/tutor/profile" icon={<User size={22}/>} label="Tutor Profile" onClick={toggleMenu} isHighlight />
                  ) : (
                    <MobileActionLink 
                      href="/become-a-tutor" 
                      icon={<GraduationCap size={22}/>} 
                      label="Become a Tutor" 
                      onClick={toggleMenu} 
                    />
                  )}
                </SignedIn>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <SignedOut>
                <SignInButton>
                  <button className="w-full py-4 bg-[#174933] text-white rounded-xl font-bold text-lg mb-3">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <p className="text-center text-xs text-slate-400 italic">
                Empowering learners in Oman & Pakistan
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileActionLink = ({ href, icon, label, onClick, isHighlight = false }: any) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="flex items-center justify-between px-6 py-5 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <span className={isHighlight ? "text-[#ff6a97]" : "text-slate-400"}>{icon}</span>
      <span className={`font-bold ${isHighlight ? "text-[#ff6a97]" : "text-slate-800"}`}>{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300" />
  </Link>
);

export default Navbar;