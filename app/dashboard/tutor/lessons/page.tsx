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

// --- Types & Interfaces ---
interface TeacherProps {
  id: string;
  name?: string;
  image_url?: string;
  image?: string;
  video_url?: string;
  preview_video?: string;
  previewVideo?: string;
  price?: string | number;
  subject?: string;
  topic?: string;
  headline?: string;
  bio?: string;
  country_emoji?: string;
  languages?: string;
  rating?: number;
  reviews_count?: number;
  student_count?: number;
  lesson_count?: number;
}

interface DisplaySlot {
  id: string;
  original_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
}

export default function TeacherCard({ teacher }: { teacher: TeacherProps }) {
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
            return fetch(url, { ...options, headers });
          },
        },
      }
    );
  }, [session]);

  // State Management
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availability, setAvailability] = useState<DisplaySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DisplaySlot | null>(null);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Guard for missing teacher data
  if (!teacher) return null;

  // Metadata parsing
  const videoSrc = teacher?.video_url || teacher?.preview_video || teacher?.previewVideo;
  const isYouTube = videoSrc?.includes("youtube.com") || videoSrc?.includes("youtu.be");
  const displayImage = teacher?.image_url || teacher?.image || "/placeholder-tutor.jpg";
  const displayName = teacher?.name || "New Tutor";
  const displayPrice = teacher?.price || "0";
  const displaySubject = teacher?.subject || "English";
  const displayHeadline = teacher?.topic || teacher?.headline || "Certified Tutor";
  const displayBio = teacher?.bio || "No biography provided yet.";
  const displayCountryEmoji = teacher?.country_emoji || "🇵🇰";

  /**
   * Logic to map recurring weekly availability to specific dates
   */
  const generateAvailableSlots = (weeklySlots: any[]): DisplaySlot[] => {
    const slots: DisplaySlot[] = [];
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
        const startTimeStr = String(slot.start_time);
        const endTimeStr = String(slot.end_time);
        
        const [startHour, startMin] = startTimeStr.split(":").slice(0, 2).map(Number);
        const [endHour, endMin] = endTimeStr.split(":").slice(0, 2).map(Number);

        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(endHour, endMin, 0, 0);

        if (startTime > new Date()) {
          slots.push({
            id: `${slot.id}-${date.toISOString()}`,
            original_id: slot.id,
            day_of_week: slot.day_of_week,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            teacher_id: slot.teacher_id,
          });
        }
      });
    }

    return slots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  // Fetch Availability when modal opens
  useEffect(() => {
    if (showBooking && teacher?.id) {
      const fetchAvailability = async () => {
        setLoadingSlots(true);
        const { data, error } = await supabase
          .from("availability")
          .select("*")
          .eq("teacher_id", teacher.id)
          .eq("is_booked", false);

        if (!error && data) {
          const slots = generateAvailableSlots(data);
          setAvailability(slots);
        }
        setLoadingSlots(false);
      };
      fetchAvailability();
    }
  }, [showBooking, teacher?.id, supabase]);

  // Video Utils
  const getEmbedUrl = (url: string, isAutoplay: boolean = false) => {
    if (!url) return "";
    let cleanUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      cleanUrl = url.replace("watch?v=", "embed/").split("&")[0];
    } else if (url.includes("youtu.be/")) {
      const id = url.split("/").pop();
      cleanUrl = `https://www.youtube.com/embed/${id}`;
    }

    if (isAutoplay && cleanUrl.includes("youtube.com/embed")) {
      const videoId = cleanUrl.split("/").pop();
      return `${cleanUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
    }
    return cleanUrl;
  };

  // Handlers
  const handleMouseEnter = () => {
    if (isWatching || showBooking) return;
    hoverTimeout.current = setTimeout(() => {
      setHovered(true);
      setShowPreview(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
    setShowPreview(false);
  };

  const handleSendMessage = async () => {
    if (!isSignedIn) return alert("Please log in to send a message.");
    setIsPending(true);
    try {
      await startConversation(teacher.id);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleBooking = async () => {
    if (!user?.id) return alert("Please log in to book a lesson.");
    if (!selectedSlot) return alert("Please select a time slot.");

    setIsPending(true);
    try {
      const { error: lessonError } = await supabase.from("lessons").insert({
        teacher_id: teacher.id,
        student_id: user.id,
        availability_id: selectedSlot.original_id, 
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        status: "confirmed",
      });

      if (lessonError) throw lessonError;

      await supabase
        .from("availability")
        .update({ is_booked: true })
        .eq("id", selectedSlot.original_id);

      alert(`Successfully booked with ${displayName}!`);
      setShowBooking(false);
      setAvailability(prev => prev.filter(s => s.id !== selectedSlot.id));
      setSelectedSlot(null);

    } catch (error: any) {
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };

  // Formatting Utils
  const formatSlotDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  
  const formatSlotTime = (dateStr: string) => 
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`bg-white border rounded-xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-300 max-w-[850px] relative overflow-hidden ${
          hovered ? "border-black shadow-lg" : "border-gray-200 hover:shadow-md"
        }`}
      >
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] cursor-pointer group"
            onClick={() => videoSrc && setIsWatching(true)}
          >
            <Image
              src={displayImage}
              alt={displayName}
              fill
              className="rounded-lg object-cover transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#26ba7c] border-2 border-white rounded-sm" />
          </div>
          {videoSrc && (
            <p className="mt-2 text-[11px] font-medium text-gray-500 md:hidden uppercase tracking-tight">
              Tap photo to watch intro
            </p>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[20px] sm:text-[22px] font-bold text-gray-900 truncate">
              {displayName}
            </h3>
            <ShieldCheck
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              fillOpacity={0.1}
            />
            <span className="text-lg">{displayCountryEmoji}</span>
          </div>
          <div className="space-y-1.5 mb-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{displaySubject} tutor</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span>{teacher.languages || "English (Native)"}</span>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-gray-800">
            <div
              className={`transition-all duration-300 overflow-hidden ${
                expanded ? "max-h-[1000px]" : "max-h-[72px]"
              }`}
            >
              <p>
                <span className="text-orange-400 mr-1">✨</span>
                <span className="font-semibold">{displayHeadline}</span> —{" "}
                {displayBio}
              </p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-semibold text-gray-900 underline underline-offset-4"
            >
              {expanded ? "Show less" : "Learn more"}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[#3bb574] font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Very popular · Booked recently</span>
          </div>
        </div>

        <div className="w-full md:w-[240px] flex flex-col gap-4">
          <div className="flex items-start justify-between w-full">
            <div>
              <div className="text-[26px] font-bold text-gray-900 leading-none">
                ${displayPrice}
              </div>
              <div className="text-gray-500 text-sm mt-1">50-min lesson</div>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
              <Heart className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-gray-50 md:border-none">
            <div>
              <div className="font-bold text-[16px]">
                {teacher.rating || 5} ★
              </div>
              <span className="text-xs text-gray-400 lowercase block">
                {teacher.reviews_count || 0} reviews
              </span>
            </div>
            <div>
              <div className="font-bold text-[16px]">
                {teacher.student_count || 0}
              </div>
              <span className="text-xs text-gray-400 lowercase block">
                students
              </span>
            </div>
            <div>
              <div className="font-bold text-[16px]">
                {teacher.lesson_count || 0}
              </div>
              <span className="text-xs text-gray-400 lowercase block">
                lessons
              </span>
            </div>
          </div>
          <div className="space-y-2 mt-auto">
            <button
              onClick={() => setShowBooking(true)}
              className="w-full bg-[#ff6a97] hover:bg-[#ff4d8d] text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              Book trial lesson
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isPending}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Connecting..." : "Send message"}
            </button>
          </div>
        </div>

        {isWatching && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
            onClick={() => setIsWatching(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWatching(false);
              }}
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[110] active:scale-90"
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="w-full max-w-6xl px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full overflow-hidden bg-black rounded-2xl shadow-2xl border border-white/10"
                style={{ paddingBottom: "56.25%" }}
              >
                {isYouTube ? (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={getEmbedUrl(videoSrc || "")}
                    title="Tutor Introduction"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoSrc}
                    controls
                    autoPlay
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowBooking(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900">
                Book with {displayName.split(" ")[0]}
              </h2>
              <button
                onClick={() => setShowBooking(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[70vh]">
              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#ff6a97]" />
                  <p className="text-sm font-medium">Loading availability...</p>
                </div>
              ) : availability.length > 0 ? (
                <div className="space-y-3">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Calendar className="w-4 h-4 text-[#ff6a97]" /> Available
                    Lessons
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {availability.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex items-center justify-between p-4 border rounded-xl transition-all text-left ${
                          selectedSlot?.id === slot.id
                            ? "border-[#ff6a97] bg-pink-50 ring-1 ring-[#ff6a97]"
                            : "hover:border-gray-400 text-gray-600"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                            {formatSlotDate(slot.start_time)}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formatSlotTime(slot.start_time)} - {formatSlotTime(slot.end_time)}
                          </span>
                        </div>
                        <Clock
                          className={`w-4 h-4 ${
                            selectedSlot?.id === slot.id
                              ? "text-[#ff6a97]"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No available slots for the next 2 weeks.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {displayName.split(" ")[0]} hasn't set their availability yet.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white">
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || isPending}
                className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  selectedSlot
                    ? "bg-[#ff6a97] hover:bg-[#ff4d8d] text-white shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } ${isPending ? "opacity-70 cursor-wait" : ""}`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    {selectedSlot ? "Confirm Booking" : "Select a time slot"}{" "}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && !isWatching && !showBooking && videoSrc && (
        <div
          onClick={() => {
            setIsWatching(true);
            setShowPreview(false);
          }}
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-full ml-6 w-[320px] z-50 cursor-pointer"
        >
          <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl border-2 border-transparent hover:border-[#ff6a97] transition-all group/preview">
            <div className="w-full h-[200px] pointer-events-none">
              {isYouTube ? (
                <iframe
                  className="w-full h-full scale-[1.5]"
                  src={`${getEmbedUrl(
                    videoSrc
                  )}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                  allow="autoplay"
                />
              ) : (
                <video
                  src={videoSrc}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover/preview:bg-black/40 transition-colors">
              <div className="w-14 h-14 bg-[#ff6a97]/90 rounded-full flex items-center justify-center group-hover/preview:scale-110 transition-transform shadow-xl">
                <Play className="w-6 h-6 text-white ml-1 fill-current" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}