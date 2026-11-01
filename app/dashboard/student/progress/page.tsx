"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { TrendingUp, BookOpen, CheckCircle, Clock, Loader2, Award } from "lucide-react";

export default function StudentProgress() {
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
  const completed = lessons.filter(l => l.status === "completed" || new Date(l.start_time) < now);
  const upcoming = lessons.filter(l => new Date(l.start_time) >= now);
  const totalHours = Math.round(completed.length * 0.83);

  // Group completed lessons by subject
  const subjectMap: Record<string, { total: number; completed: number; tutors: Set<string> }> = {};
  for (const l of lessons) {
    const subject = l.teachers?.subject || "General";
    if (!subjectMap[subject]) subjectMap[subject] = { total: 0, completed: 0, tutors: new Set() };
    subjectMap[subject].total++;
    if (completed.includes(l)) subjectMap[subject].completed++;
    if (l.teachers?.name) subjectMap[subject].tutors.add(l.teachers.name);
  }
  const subjects = Object.entries(subjectMap).sort((a, b) => b[1].completed - a[1].completed);

  const overallPct = lessons.length > 0 ? Math.round((completed.length / lessons.length) * 100) : 0;

  // Streak: count consecutive weeks with at least 1 lesson
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  let streak = 0;
  if (completed.length > 0) {
    const sortedCompleted = [...completed].sort((a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );
    let checkWeekStart = new Date(now.getTime() - weekMs);
    for (let i = 0; i < 52; i++) {
      const weekEnd = new Date(checkWeekStart.getTime() + weekMs);
      const hasLesson = sortedCompleted.some(l => {
        const t = new Date(l.start_time);
        return t >= checkWeekStart && t < weekEnd;
      });
      if (!hasLesson) break;
      streak++;
      checkWeekStart = new Date(checkWeekStart.getTime() - weekMs);
    }
  }

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
        <h1 className="text-2xl font-black text-gray-900">My Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your learning journey across all subjects.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Classes Done", value: completed.length, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Hours Learned", value: `${totalHours}h`, icon: Clock, color: "bg-blue-50 text-[#033D8B]" },
          { label: "Subjects", value: subjects.length, icon: BookOpen, color: "bg-pink-50 text-[#ff6a97]" },
          { label: "Week Streak", value: `${streak}w`, icon: Award, color: "bg-teal-50 text-[#43d2b1]" },
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

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#033D8B]" />
            <h2 className="font-bold text-gray-900">Overall Completion</h2>
          </div>
          <span className="text-2xl font-black text-[#033D8B]">{overallPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#033D8B] to-[#0550b5] rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completed.length} of {lessons.length} total sessions completed
          {upcoming.length > 0 && ` · ${upcoming.length} upcoming`}
        </p>
      </div>

      {/* Subject Breakdown */}
      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">No classes yet. Book a tutor to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-gray-900">Progress by Subject</h2>
          <div className="space-y-5">
            {subjects.map(([subject, data]) => {
              const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              const tutors = Array.from(data.tutors).join(", ");
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{subject}</span>
                      {tutors && (
                        <span className="text-xs text-gray-400 ml-2">with {tutors}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{data.completed}/{data.total} classes</span>
                      <span className="font-bold text-[#033D8B]">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100
                          ? "#174933"
                          : pct >= 60
                          ? "#033D8B"
                          : "#ff6a97",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestone badges */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Milestones</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "First Class", threshold: 1, emoji: "🎉" },
              { label: "5 Classes", threshold: 5, emoji: "⭐" },
              { label: "10 Classes", threshold: 10, emoji: "🏅" },
              { label: "25 Classes", threshold: 25, emoji: "🥇" },
              { label: "50 Classes", threshold: 50, emoji: "🚀" },
            ].map(({ label, threshold, emoji }) => {
              const earned = completed.length >= threshold;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    earned
                      ? "bg-[#033D8B] text-white border-[#033D8B] shadow-md"
                      : "bg-gray-50 text-gray-300 border-gray-100"
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
