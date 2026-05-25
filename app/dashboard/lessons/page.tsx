"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { Calendar, Clock, Video, Loader2, User } from "lucide-react";

export default function StudentDashboard() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => {
    return createBrowserClient(
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
    );
  }, [session]);

  useEffect(() => {
    async function fetchMyLessons() {
      if (!user?.id) return;

      try {
        // FIX: We check if user.id matches EITHER student_id OR teacher_id
        // We also fetch the teachers relationship data
        const { data, error } = await supabase
          .from("lessons")
          .select(`
            id,
            status,
            start_time,
            teacher_id,
            student_id,
            teachers (
              name,
              image_url,
              subject
            )
          `)
          .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
          .order("start_time", { ascending: true });

        if (error) {
          console.error("Supabase Query Error:", error.message);
          return;
        }

        setLessons(data || []);
      } catch (err: any) {
        console.error("Unexpected Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user && session) {
      fetchMyLessons();
    }
  }, [user, isLoaded, session, supabase]);

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6a97]" />
      </div>
    );
  }

  const formatTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
  const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : "No Date";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Lessons</h1>

      {lessons.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No lessons found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            // Logic to determine if we should show "Tutor" or "Student" info
            // If current user is the teacher, they might want to see student info 
            // (Note: This assumes you might add a 'students' join later, 
            // for now it shows the Tutor info from the teachers table join)
            const isUserTeacher = lesson.teacher_id === user?.id; // ✅ Safe
            
            return (
              <div key={lesson.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden border">
                    {lesson.teachers?.image_url ? (
                      <Image
                        src={lesson.teachers.image_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <User className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {lesson.teachers?.name || "User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isUserTeacher ? "Your Student" : `${lesson.teachers?.subject || "Subject"} Tutor`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full md:w-1/3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-[#ff6a97]" />
                    <span className="font-medium">{formatDate(lesson.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(lesson.start_time)} (50 min)</span>
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex justify-end">
                  <button 
                    onClick={() => window.open(`https://meet.jit.si/skillsphere-${lesson.id}`, '_blank')}
                    className="flex items-center gap-2 bg-[#ff6a97] hover:bg-[#ff4d8d] text-white px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 w-full md:w-auto justify-center"
                  >
                    <Video className="w-4 h-4" />
                    Join Class
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}