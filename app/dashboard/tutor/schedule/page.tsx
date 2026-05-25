"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { Calendar as CalendarIcon, Clock, Plus, Loader2, CheckCircle2 } from "lucide-react";

export default function TutorSchedule() {
  const { user } = useUser();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !time) return;

    setIsPending(true);
    setSuccess(false);

    try {
      // Combine date and time into an ISO string
      const startTime = new Date(`${date}T${time}`).toISOString();

      const { error } = await supabase
        .from("availability")
        .insert({
          teacher_id: user.id, // Assuming the Tutor's ID matches their Clerk ID
          start_time: startTime,
          is_booked: false
        });

      if (error) throw error;

      setSuccess(true);
      setTime(""); // Reset time after success
    } catch (error: any) {
      console.error("Error adding slot:", error.message);
      alert("Failed to add slot. Make sure your teacher_id matches your Clerk ID.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Manage Your Schedule</h1>
        <p className="text-gray-500 mb-8">Add new time slots for students to book trial lessons.</p>

        <form onSubmit={handleAddSlot} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Select Date
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#ff6a97] outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Start Time
              </label>
              <input
                type="time"
                required
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#ff6a97] outline-none"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Open Time Slot
          </button>
        </form>

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Slot added successfully! It is now visible on your profile.</span>
          </div>
        )}
      </div>
    </div>
  );
}