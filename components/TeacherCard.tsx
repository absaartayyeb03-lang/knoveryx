"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Languages,
  TrendingUp,
  Heart,
  X,
  Play,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { startConversation } from "@/lib/actions/chat";
import { createBrowserClient } from "@supabase/ssr";
import { useSession, useUser } from "@clerk/nextjs";
import { GeneratedSlot } from "@/types";

export default function TeacherCard({ teacher }: { teacher: any }) {
  const { user, isSignedIn } = useUser();
  const { session } = useSession();

  // Initialize Supabase with Clerk Auth
  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({ template: "supabase" });
            const headers = new Headers(options.headers);
            if (clerkToken) {
              headers.set("Authorization", `Bearer ${clerkToken}`);
            }
            // As you requested, we rely on the JWT template for claims 
            // and do not manually inject 'sub' to avoid reserved claim errors.
            return fetch(url, { ...options, headers });
          },
        },
      }
    );
  }, [session]);

  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Data mapping
  const videoSrc = teacher?.video_url || teacher?.preview_video || teacher?.previewVideo;
  const isYouTube = videoSrc?.includes("youtube.com") || videoSrc?.includes("youtu.be");
  const displayImage = teacher?.image_url || teacher?.image || "/placeholder-tutor.jpg";
  const displayName = teacher?.name || "New Tutor";
  const displayPrice = teacher?.price || "0";
  const displaySubject = teacher?.subject || "English";
  const displayHeadline = teacher?.topic || teacher?.headline || "Certified Tutor";
  const displayBio = teacher?.bio || "No biography provided yet.";
  const displayCountryEmoji = teacher?.country_emoji || "🇺🇸";

  // Helpers
  const formatSlotDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  
  const formatSlotTime = (dateStr: string) => 
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let clean = url;
    if (url.includes("watch?v=")) clean = url.replace("watch?v=", "embed/").split("&")[0];
    else if (url.includes("youtu.be/")) clean = `https://www.youtube.com/embed/${url.split("/").pop()}`;
    return `${clean}?autoplay=1&mute=1&modestbranding=1&rel=0`;
  };

  // Generate date-specific slots for the next 14 days
  const generateAvailableSlots = (weeklySlots: any[]) => {
    const slots: GeneratedSlot[] = [];
    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];

      const daySlotsForThisDay = weeklySlots.filter(
        (slot) => slot.day_of_week === dayName && !slot.is_booked
      );

      daySlotsForThisDay.forEach((slot) => {
        const [startHour, startMin] = slot.start_time.split(":").map(Number);
        const [endHour, endMin] = slot.end_time.split(":").map(Number);
        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(endHour, endMin, 0, 0);

        if (startTime > new Date()) {
          slots.push({
            id: `${slot.id}-${date.toISOString()}`,
            original_id: slot.id, // This is the integer (e.g., 1)
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            teacher_id: slot.teacher_id,
          });
        }
      });
    }
    return slots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  useEffect(() => {
    if (showBooking && teacher?.id) {
      const fetchAvailability = async () => {
        setLoadingSlots(true);
        const { data, error } = await supabase
          .from("availability")
          .select("*")
          .eq("teacher_id", teacher.id)
          .eq("is_booked", false);

        if (!error && data) setAvailability(generateAvailableSlots(data));
        setLoadingSlots(false);
      };
      fetchAvailability();
    }
  }, [showBooking, teacher?.id, supabase]);

  const handleBooking = async () => {
    if (!isSignedIn || !user?.id) return alert("Please log in to book.");
    if (!selectedSlot) return alert("Please select a time slot.");

    setIsPending(true);
    try {
      // 1. Create Lesson Record
      // Since you changed the DB type to int8, original_id (integer 1) will now be accepted.
      const { error: lessonError } = await supabase.from("lessons").insert({
        teacher_id: teacher.id,
        student_id: user.id,
        availability_id: selectedSlot.original_id, 
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        status: "confirmed",
      });

      if (lessonError) throw lessonError;

      // 2. Mark Slot as Booked in the availability table
      await supabase
        .from("availability")
        .update({ is_booked: true })
        .eq("id", selectedSlot.original_id);

      alert(`Success! Lesson booked with ${displayName}`);
      setShowBooking(false);
      setSelectedSlot(null);
    } catch (error: any) {
      console.error("Booking Error:", error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isSignedIn) return alert("Please log in to message.");
    setIsPending(true);
    try {
      await startConversation(teacher.id);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative" onMouseEnter={() => !showBooking && setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={`bg-white border rounded-xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-300 max-w-[850px] relative overflow-hidden ${hovered ? "border-black shadow-lg" : "border-gray-200"}`}>
        
        {/* Avatar Section */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] cursor-pointer group" onClick={() => videoSrc && setIsWatching(true)}>
            <Image src={displayImage} alt={displayName} fill className="rounded-lg object-cover" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#26ba7c] border-2 border-white rounded-sm" />
            {videoSrc && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                <Play className="text-white fill-current w-12 h-12" />
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{displayName}</h3>
            <ShieldCheck className="w-5 h-5 text-gray-700" fill="currentColor" fillOpacity={0.1} />
            <span className="text-lg">{displayCountryEmoji}</span>
          </div>
          <div className="space-y-1 mb-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {displaySubject} tutor</div>
            <div className="flex items-center gap-2"><Languages className="w-4 h-4" /> {teacher.languages || "English"}</div>
          </div>
          <div className={`text-sm text-gray-800 transition-all ${expanded ? "max-h-full" : "max-h-[72px] line-clamp-3"}`}>
            <span className="text-orange-400 mr-1">✨</span>
            <span className="font-semibold">{displayHeadline}</span> — {displayBio}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="mt-2 text-sm font-bold underline underline-offset-4">
            {expanded ? "Show less" : "Learn more"}
          </button>
          <div className="mt-4 flex items-center gap-2 text-[#3bb574] font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Very popular · Booked recently</span>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="w-full md:w-[220px] flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold">${displayPrice}</div>
              <div className="text-xs text-gray-500">50-min lesson</div>
            </div>
            <Heart className="w-6 h-6 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
          <div className="grid grid-cols-3 text-center border-y py-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            <div><div className="text-sm text-black">{teacher.rating || 5}★</div>REVIEWS</div>
            <div><div className="text-sm text-black">{teacher.student_count || 0}</div>STUDENTS</div>
            <div><div className="text-sm text-black">{teacher.lesson_count || 0}</div>LESSONS</div>
          </div>
          <button onClick={() => setShowBooking(true)} className="w-full bg-[#ff6a97] text-white font-bold py-3 rounded-lg hover:bg-[#ff4d8d] transition-transform active:scale-95">
            Book trial
          </button>
          <button onClick={handleSendMessage} disabled={isPending} className="w-full border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 transition-transform active:scale-95">
            {isPending ? "Connecting..." : "Message"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">Book with {displayName.split(" ")[0]}</h2>
              <X className="w-6 h-6 cursor-pointer text-gray-400 hover:text-black" onClick={() => setShowBooking(false)} />
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingSlots ? (
                <div className="flex flex-col items-center py-10 text-gray-400">
                  <Loader2 className="animate-spin text-[#ff6a97] mb-2" /> Loading...
                </div>
              ) : availability.length > 0 ? (
                <div className="space-y-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-[#ff6a97]" /> Available Lessons
                  </span>
                  {availability.map((slot) => (
                    <button key={slot.id} onClick={() => setSelectedSlot(slot)} className={`w-full p-4 border rounded-xl flex justify-between items-center transition-all ${selectedSlot?.id === slot.id ? "border-[#ff6a97] bg-pink-50 ring-1 ring-[#ff6a97]" : "hover:border-gray-400"}`}>
                      <div className="text-left">
                        <div className="text-xs text-gray-400 font-bold uppercase">{formatSlotDate(slot.start_time)}</div>
                        <div className="font-bold">{formatSlotTime(slot.start_time)} - {formatSlotTime(slot.end_time)}</div>
                      </div>
                      <Clock className={`w-5 h-5 ${selectedSlot?.id === slot.id ? "text-[#ff6a97]" : "text-gray-200"}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">No availability found for this tutor.</div>
              )}
            </div>
            <div className="p-4 border-t">
              <button onClick={handleBooking} disabled={!selectedSlot || isPending} className="w-full bg-[#ff6a97] text-white font-bold py-4 rounded-xl disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-2 transition-all">
                {isPending ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                {!isPending && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isWatching && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" onClick={() => setIsWatching(false)}>
          <div className="w-full max-w-4xl relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-[120] text-white bg-black/50 p-2 rounded-full hover:bg-black" onClick={() => setIsWatching(false)}><X className="w-6 h-6" /></button>
            {isYouTube ? (
              <iframe className="w-full h-full" src={getEmbedUrl(videoSrc)} allow="autoplay" allowFullScreen />
            ) : (
              <video src={videoSrc} controls autoPlay className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}