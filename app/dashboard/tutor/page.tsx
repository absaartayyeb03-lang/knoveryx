"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, Calendar, Users, TrendingUp, ArrowRight, Loader2, Video } from "lucide-react";

export default function TutorOverview() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomLoading, setZoomLoading] = useState<string | null>(null);

  async function startZoom(lessonId: string) {
    setZoomLoading(lessonId);
    try {
      const res = await fetch("/api/create-zoom-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, topic: "Knoveryx Class" }),
      });
      const data = await res.json();
      if (data.start_url) window.open(data.start_url, "_blank");
    } finally {
      setZoomLoading(null);
    }
  }

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
        .select("id, status, start_time, teacher_id, student_id")
        .eq("teacher_id", user.id)
        .order("start_time", { ascending: true });
      setLessons(data || []);
      setLoading(false);
    }
    if (isLoaded && user && session) fetchLessons();
  }, [user, isLoaded, session, supabase]);

  const now = new Date();
  const upcoming = lessons.filter(l => new Date(l.start_time) >= now);
  const completed = lessons.filter(l => l.status === "completed" || new Date(l.start_time) < now);
  const nextLesson = upcoming[0];
  const uniqueStudents = new Set(lessons.map(l => l.student_id)).size;

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
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your teaching overview.</p>
        </div>
        <Link href="/dashboard/tutor/schedule" className="inline-flex items-center gap-2 bg-[#033D8B] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all">
          View Schedule <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Lessons", value: lessons.length, icon: BookOpen, color: "bg-blue-50 text-[#033D8B]" },
          { label: "Completed", value: completed.length, icon: CheckCircle, color: "bg-green-50 text-[#174933]" },
          { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-pink-50 text-[#ff6a97]" },
          { label: "Total Students", value: uniqueStudents, icon: Users, color: "bg-teal-50 text-[#43d2b1]" },
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

      {/* Next Lesson Card */}
      {nextLesson ? (
        <div className="bg-gradient-to-br from-[#174933] to-[#1e6040] rounded-2xl p-6 text-white shadow-xl shadow-green-900/20">
          <p className="text-green-200 text-xs font-black uppercase tracking-widest mb-3">Next Lesson</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Upcoming Session</h2>
              <div className="flex gap-4 mt-3 text-sm text-green-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(nextLesson.start_time)}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatTime(nextLesson.start_time)}</span>
              </div>
            </div>
            <button
              onClick={() => startZoom(nextLesson.id)}
              disabled={zoomLoading === nextLesson.id}
              className="flex items-center gap-2 bg-white text-[#174933] px-6 py-3 rounded-xl font-black text-sm hover:bg-green-50 transition-all active:scale-95 self-start md:self-center whitespace-nowrap shadow-lg disabled:opacity-70"
            >
              {zoomLoading === nextLesson.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
              {zoomLoading === nextLesson.id ? "Starting…" : "Start Class"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No upcoming lessons scheduled.</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/tutor/lessons", label: "All Lessons", desc: "View and manage your sessions", icon: BookOpen, color: "border-blue-100 hover:border-[#033D8B]" },
          { href: "/dashboard/tutor/students", label: "My Students", desc: "Track student progress", icon: TrendingUp, color: "border-green-100 hover:border-[#174933]" },
          { href: "/dashboard/tutor/schedule", label: "Schedule", desc: "Manage your availability", icon: Calendar, color: "border-pink-100 hover:border-[#ff6a97]" },
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
