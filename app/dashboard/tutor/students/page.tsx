"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { Users, BookOpen, CheckCircle, Clock, Loader2, User, TrendingUp, ChevronRight, ArrowLeft } from "lucide-react";

interface StudentData {
  student_id: string;
  total: number;
  completed: number;
  lastSession: string;
  subjects: Record<string, { total: number; completed: number }>;
}

export default function TutorStudents() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

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
        .select("id, status, start_time, teacher_id, student_id, subject")
        .eq("teacher_id", user.id)
        .order("start_time", { ascending: false });
      setLessons(data || []);
      setLoading(false);
    }
    if (isLoaded && user && session) fetchLessons();
  }, [user, isLoaded, session, supabase]);

  const now = new Date();

  // Group by student
  const studentMap: Record<string, StudentData> = {};
  for (const l of lessons) {
    const sid = l.student_id;
    if (!studentMap[sid]) {
      studentMap[sid] = { student_id: sid, total: 0, completed: 0, lastSession: l.start_time, subjects: {} };
    }
    studentMap[sid].total++;
    const isPast = new Date(l.start_time) < now || l.status === "completed";
    if (isPast) studentMap[sid].completed++;
    if (new Date(l.start_time) > new Date(studentMap[sid].lastSession)) {
      studentMap[sid].lastSession = l.start_time;
    }
    const subj = l.subject || "General";
    if (!studentMap[sid].subjects[subj]) studentMap[sid].subjects[subj] = { total: 0, completed: 0 };
    studentMap[sid].subjects[subj].total++;
    if (isPast) studentMap[sid].subjects[subj].completed++;
  }

  const students = Object.values(studentMap).sort((a, b) => b.total - a.total);
  const selectedStudent = selected ? studentMap[selected] : null;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6a97]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {selected && (
          <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {selected ? "Student Detail" : "My Students"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {selected ? "Progress breakdown for this student" : `${students.length} student${students.length !== 1 ? "s" : ""} taught so far`}
          </p>
        </div>
      </div>

      {/* Summary Stats (list view only) */}
      {!selected && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: students.length, icon: Users, color: "bg-blue-50 text-[#033D8B]" },
            { label: "Total Sessions", value: lessons.length, icon: BookOpen, color: "bg-pink-50 text-[#ff6a97]" },
            { label: "Completed", value: lessons.filter(l => new Date(l.start_time) < now || l.status === "completed").length, icon: CheckCircle, color: "bg-green-50 text-[#174933]" },
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
      )}

      {/* Student List */}
      {!selected && (
        <>
          {students.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500">No students yet. Once you have lessons booked, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((s) => {
                const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
                const subjectCount = Object.keys(s.subjects).length;
                return (
                  <button
                    key={s.student_id}
                    onClick={() => setSelected(s.student_id)}
                    className="w-full bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5 shadow-sm hover:shadow-md hover:border-[#033D8B]/20 transition-all text-left group"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#033D8B]/10 to-[#ff6a97]/10 rounded-full flex items-center justify-center border">
                      <User className="text-gray-400 w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">Student #{s.student_id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {subjectCount} subject{subjectCount !== 1 ? "s" : ""} · Last session {formatDate(s.lastSession)}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#033D8B] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#033D8B] w-10 text-right">{pct}%</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 shrink-0 text-center">
                      <div>
                        <p className="text-xl font-black text-gray-900">{s.total}</p>
                        <p className="text-xs text-gray-400 font-medium">Total</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-green-600">{s.completed}</p>
                        <p className="text-xs text-gray-400 font-medium">Done</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-[#ff6a97]">{s.total - s.completed}</p>
                        <p className="text-xs text-gray-400 font-medium">Left</p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#033D8B] transition-colors shrink-0 hidden md:block" />
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Student Detail View */}
      {selected && selectedStudent && (
        <div className="space-y-5">
          {/* Summary card */}
          <div className="bg-gradient-to-br from-[#033D8B] to-[#0550b5] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold">Student #{selectedStudent.student_id.slice(-6).toUpperCase()}</p>
                <p className="text-blue-200 text-sm">Last session {formatDate(selectedStudent.lastSession)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Total Sessions", value: selectedStudent.total },
                { label: "Completed", value: selectedStudent.completed },
                { label: "Remaining", value: selectedStudent.total - selectedStudent.completed },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-blue-200 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#033D8B]" />
                <h2 className="font-bold text-gray-900">Overall Progress</h2>
              </div>
              <span className="text-2xl font-black text-[#033D8B]">
                {selectedStudent.total > 0 ? Math.round((selectedStudent.completed / selectedStudent.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#033D8B] to-[#0550b5] rounded-full transition-all duration-700"
                style={{ width: `${selectedStudent.total > 0 ? Math.round((selectedStudent.completed / selectedStudent.total) * 100) : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selectedStudent.completed} of {selectedStudent.total} sessions completed
            </p>
          </div>

          {/* Subject breakdown */}
          {Object.keys(selectedStudent.subjects).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h2 className="font-bold text-gray-900">Progress by Subject</h2>
              <div className="space-y-4">
                {Object.entries(selectedStudent.subjects).map(([subject, data]) => {
                  const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-gray-900 text-sm">{subject}</span>
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
                            background: pct === 100 ? "#174933" : pct >= 60 ? "#033D8B" : "#ff6a97",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Session history */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff6a97]" />
              Session History
            </h2>
            <div className="space-y-2">
              {lessons
                .filter(l => l.student_id === selected)
                .map(l => {
                  const past = new Date(l.start_time) < now || l.status === "completed";
                  return (
                    <div key={l.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[40px]">
                          <p className="text-xs text-gray-400 font-medium leading-none">
                            {new Date(l.start_time).toLocaleDateString([], { weekday: "short" })}
                          </p>
                          <p className="text-lg font-black text-gray-900 leading-tight">
                            {new Date(l.start_time).getDate()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{l.subject || "Session"}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(l.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                            {new Date(l.start_time).toLocaleDateString([], { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                        past
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-[#033D8B]"
                      }`}>
                        {past ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
