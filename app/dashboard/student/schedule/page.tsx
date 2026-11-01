"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2, Video, CheckCircle, User } from "lucide-react";
import Image from "next/image";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function StudentSchedule() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [zoomLoading, setZoomLoading] = useState<string | null>(null);

  async function joinZoom(lessonId: string) {
    setZoomLoading(lessonId);
    try {
      const res = await fetch("/api/create-zoom-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, topic: "Knoveryx Class" }),
      });
      const data = await res.json();
      if (data.join_url) window.open(data.join_url, "_blank");
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
        .select(`id, status, start_time, teacher_id, student_id, teachers (name, image_url, subject)`)
        .eq("student_id", user.id)
        .order("start_time", { ascending: true });
      setLessons(data || []);
      setLoading(false);
    }
    if (isLoaded && user && session) fetchLessons();
  }, [user, isLoaded, session, supabase]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map lessons to date strings
  const lessonsByDate: Record<string, typeof lessons> = {};
  for (const l of lessons) {
    const d = new Date(l.start_time);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!lessonsByDate[key]) lessonsByDate[key] = [];
    lessonsByDate[key].push(l);
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : null;
  const selectedLessons = selectedKey ? (lessonsByDate[selectedKey] || []) : [];

  const now = new Date();
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isPast = (d: Date) => d < new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6a97]" />
      </div>
    );
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">View all your upcoming and past sessions by date.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-black text-gray-900">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const d = new Date(year, month, day);
              const key = `${year}-${month}-${day}`;
              const hasLesson = !!lessonsByDate[key]?.length;
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              const todayDay = isToday(d);
              const pastDay = isPast(d);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : d)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all relative ${
                    isSelected
                      ? "bg-[#033D8B] text-white shadow-md"
                      : todayDay
                      ? "bg-[#ff6a97]/10 text-[#ff6a97] ring-2 ring-[#ff6a97]"
                      : pastDay
                      ? "text-gray-300 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                  {hasLesson && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-[#ff6a97]"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff6a97] inline-block" /> Has class
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#033D8B] inline-block" /> Selected
            </span>
          </div>
        </div>

        {/* Selected Day Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          {selectedDate ? (
            <>
              <h3 className="font-black text-gray-900 mb-4">
                {selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              {selectedLessons.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <Calendar className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No classes on this day</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {selectedLessons.map(l => {
                    const past = new Date(l.start_time) < now;
                    return (
                      <div key={l.id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden border">
                            {l.teachers?.image_url ? (
                              <Image src={l.teachers.image_url} alt="Tutor" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="text-gray-400 w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate">{l.teachers?.name || "Tutor"}</p>
                            <p className="text-xs text-[#033D8B] font-medium">{l.teachers?.subject || "Subject"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(l.start_time)} · 50 min
                        </div>
                        {past ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                            <CheckCircle className="w-4 h-4" /> Completed
                          </div>
                        ) : (
                          <button
                            onClick={() => joinZoom(l.id)}
                            disabled={zoomLoading === l.id}
                            className="w-full flex items-center justify-center gap-2 bg-[#033D8B] text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition-all disabled:opacity-70"
                          >
                            {zoomLoading === l.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                            {zoomLoading === l.id ? "Joining…" : "Join Class"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Calendar className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">Select a date to see your classes</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ff6a97]" />
          Next 7 Days
        </h2>
        {(() => {
          const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const upcoming7 = lessons.filter(l => {
            const t = new Date(l.start_time);
            return t >= now && t <= in7;
          });
          if (upcoming7.length === 0) {
            return (
              <p className="text-sm text-gray-400 text-center py-6 font-medium">No classes in the next 7 days.</p>
            );
          }
          return (
            <div className="space-y-2">
              {upcoming7.map(l => (
                <div key={l.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[36px]">
                      <p className="text-xs text-gray-400 font-medium leading-none">{DAYS[new Date(l.start_time).getDay()]}</p>
                      <p className="text-lg font-black text-gray-900 leading-tight">{new Date(l.start_time).getDate()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{l.teachers?.subject || "Lesson"}</p>
                      <p className="text-xs text-gray-400">with {l.teachers?.name || "Tutor"} · {formatTime(l.start_time)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => joinZoom(l.id)}
                    disabled={zoomLoading === l.id}
                    className="flex items-center gap-1.5 bg-[#033D8B] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800 transition-all disabled:opacity-70"
                  >
                    {zoomLoading === l.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                    {zoomLoading === l.id ? "…" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
