"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { Calendar, Clock, Video, Loader2, User, CheckCircle } from "lucide-react";

export default function StudentClasses() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

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
        .order("start_time", { ascending: false });
      setLessons(data || []);
      setLoading(false);
    }
    if (isLoaded && user && session) fetchLessons();
  }, [user, isLoaded, session, supabase]);

  const now = new Date();
  const upcoming = lessons.filter(l => new Date(l.start_time) >= now).reverse();
  const past = lessons.filter(l => new Date(l.start_time) < now);
  const shown = tab === "upcoming" ? upcoming : past;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6a97]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Classes</h1>
        <p className="text-gray-500 text-sm mt-1">All your scheduled and past sessions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["upcoming", "past"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-bold capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-[#033D8B] text-[#033D8B]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t} ({t === "upcoming" ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {/* Lessons List */}
      {shown.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">
            {tab === "upcoming" ? "No upcoming classes. Find a tutor to get started!" : "No past classes yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((lesson) => {
            const isPast = new Date(lesson.start_time) < now;
            return (
              <div key={lesson.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Tutor Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden border">
                    {lesson.teachers?.image_url ? (
                      <Image src={lesson.teachers.image_url} alt="Tutor" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User className="text-gray-400 w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{lesson.teachers?.name || "Tutor"}</p>
                    <p className="text-sm text-[#033D8B] font-medium">{lesson.teachers?.subject || "Subject"}</p>
                  </div>
                </div>

                {/* Date/Time */}
                <div className="flex flex-col gap-1 text-sm shrink-0">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-[#ff6a97] shrink-0" />
                    {formatDate(lesson.start_time)}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    {formatTime(lesson.start_time)} · 50 min
                  </span>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isPast ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 px-4 py-2 rounded-xl">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => window.open(`https://meet.jit.si/knoveryx-${lesson.id}`, '_blank')}
                      className="flex items-center gap-2 bg-[#033D8B] hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                    >
                      <Video className="w-4 h-4" /> Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
