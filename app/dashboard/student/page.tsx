"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, Calendar, Video, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

export default function StudentOverview() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({ template: "supabase" });
          const headers = new Headers(options.headers);
          if (clerkToken) headers.set("Authorization", `Bearer ${clerkToken}`);
          return fetch(url, { ...options, headers });
        },
      },
    }
  ), [session]);

  useEffect(() => {
    async function fetchLessons() {
      if (!user?.id) return;
      const { data } = await supabase
        .from("lessons")
        .select(`id, status, start_time, teacher_id, student_id, teachers (name, image_url, subject)`)
        .eq("student_id", user.id)
        .order("start_time", { ascending: true });
      setLessons(data || []);
      setLoading(false);
    }
    if (isLoaded && user && session) fetchLessons();
  }, [user, isLoaded, session, supabase]);

  const now = new Date();
  const upcoming = lessons.filter(l => new Date(l.start_time) >= now);
  const completed = lessons.filter(l => l.status === "completed" || new Date(l.start_time) < now);
  const nextClass = upcoming[0];

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6a97]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your learning overview.</p>
        </div>
        <Link href="/tutors" className="inline-flex items-center gap-2 bg-[#033D8B] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all">
          Find a Tutor <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: lessons.length, icon: BookOpen, color: "bg-blue-50 text-[#033D8B]" },
          { label: "Completed", value: completed.length, icon: CheckCircle, color: "bg-green-50 text-[#174933]" },
          { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-pink-50 text-[#ff6a97]" },
          { label: "Hours Studied", value: `${Math.round(completed.length * 0.83)}h`, icon: Clock, color: "bg-teal-50 text-[#43d2b1]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Next Class Card */}
      {nextClass ? (
        <div className="bg-gradient-to-br from-[#033D8B] to-[#0550b5] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
          <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-3">Next Class</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{nextClass.teachers?.subject || "Lesson"}</h2>
              <p className="text-blue-200 font-medium mt-1">with {nextClass.teachers?.name || "Your Tutor"}</p>
              <div className="flex gap-4 mt-3 text-sm text-blue-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(nextClass.start_time)}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatTime(nextClass.start_time)}</span>
              </div>
            </div>
            <button
              onClick={() => window.open(`https://meet.jit.si/knoveryx-${nextClass.id}`, '_blank')}
              className="flex items-center gap-2 bg-white text-[#033D8B] px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-all active:scale-95 self-start md:self-center whitespace-nowrap shadow-lg"
            >
              <Video className="w-4 h-4" /> Join Class
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No upcoming classes scheduled.</p>
          <Link href="/tutors" className="text-[#033D8B] font-bold text-sm mt-2 inline-block hover:underline">Browse tutors →</Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/student/classes", label: "All Classes", desc: "View and join your sessions", icon: BookOpen, color: "border-blue-100 hover:border-[#033D8B]" },
          { href: "/dashboard/student/progress", label: "Progress", desc: "Track your learning journey", icon: TrendingUp, color: "border-green-100 hover:border-[#174933]" },
          { href: "/dashboard/student/schedule", label: "Schedule", desc: "View your class calendar", icon: Calendar, color: "border-pink-100 hover:border-[#ff6a97]" },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link key={href} href={href} className={`bg-white border-2 ${color} rounded-2xl p-5 transition-all hover:shadow-md group`}>
            <Icon className="w-6 h-6 text-gray-400 group-hover:text-gray-700 mb-3 transition-colors" />
            <p className="font-bold text-gray-900">{label}</p>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
