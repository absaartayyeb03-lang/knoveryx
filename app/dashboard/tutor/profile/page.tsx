"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  User,
  DollarSign,
  BookOpen,
  PenTool,
  Globe,
  Video,
  Upload,
  Trash2,
  Plus,
  Clock,
} from "lucide-react";
import { useUser, useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useSupabaseClient } from "../../../lib/supabase-client"; // Used for fetching data
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TutorProfileSetup() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    subject: "",
    topic: "",
    price: 0,
    bio: "",
    country: "Pakistan",
    video_url: "",
    image_url: "",
  });

  const [slots, setSlots] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (data) {
          setProfile({
            name: data.name || "",
            subject: data.subject || "",
            topic: data.topic || "",
            price: data.price || 0,
            bio: data.bio || "",
            country: data.country || "Pakistan",
            video_url: data.video_url || "",
            image_url: data.image_url || "",
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (userLoaded) fetchProfile();
  }, [user, userLoaded, supabase]);

  // Fetch slots
  const fetchSlots = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("availability")
      .select("*")
      .eq("teacher_id", user.id)
      .order("day_of_week", { ascending: true });
    if (data) setSlots(data);
  };

  useEffect(() => {
    if (userLoaded) fetchSlots();
  }, [user, userLoaded]);

  // Handle add slot
  const handleAddSlot = async () => {
    if (!user) return;

    const { data: teacherExists } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!teacherExists) {
      toast.error("Please save your Profile Details first!");
      setActiveTab("profile");
      return;
    }

    const { error } = await supabase.from("availability").insert([
      {
        teacher_id: user.id,
        ...newSlot,
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Time slot added!");
      fetchSlots();
    }
  };

  // Handle delete slot
  const handleDeleteSlot = async (slot: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("id", slot.id);

    if (error) {
      toast.error("Failed to delete slot");
    } else {
      toast.success("Slot removed");
      fetchSlots();
    }
  };

  // Handle file upload
  const startUpload = async (file: File, type: "image" | "video") => {
  if (!user || !user.primaryEmailAddress?.emailAddress) {
    toast.error("User email not found. Please log in again.");
    return;
  }

  if (!session) {
    toast.error("Authentication session not found.");
    return;
  }

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("File too large. Max 50MB");
    return;
  }

  const toastId = toast.loading(`Uploading ${type}...`);

  try {
    setUploading(true);

    // 1. Fetch the Clerk JWT for Supabase
    const token = await session.getToken({ template: "supabase" });
    if (!token) throw new Error("Could not retrieve Supabase token");

    // 2. Use the CORRECT environment variable names from your .env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; // Updated name

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are missing. Check your .env file.");
    }

    // 3. Initialize the temporary client
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const bucket = type === "image" ? "tutor-images" : "teacher-previews";
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;

    const userEmail = user.primaryEmailAddress.emailAddress.toLowerCase();
    const filePath = `${userEmail}/${fileName}`;

    // 4. Perform Upload
    const { error: uploadError } = await supabaseAuth.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // 5. Generate and Set Public URL
    const { data } = supabaseAuth.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    setProfile((prev) => ({
      ...prev,
      [type === "image" ? "image_url" : "video_url"]: publicUrl,
    }));

    toast.success(`${type} uploaded!`, { id: toastId });
  } catch (error: any) {
    console.error("Upload error details:", error);
    toast.error(`Upload failed: ${error.message}`, { id: toastId });
  } finally {
    setUploading(false);
  }
};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) startUpload(e.target.files[0], "image");
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) startUpload(e.target.files[0], "video");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0])
      startUpload(e.dataTransfer.files[0], "image");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const updateData = {
      id: user.id,
      name: profile.name,
      subject: profile.subject,
      topic: profile.topic,
      price: profile.price,
      bio: profile.bio,
      country: profile.country,
      video_url: profile.video_url || null,
      image_url: profile.image_url || user.imageUrl || null,
      email: user.primaryEmailAddress?.emailAddress || null,
      application_status: "pending_payment",
      is_displayed: false,
    };

    try {
      const { error } = await supabase
        .from("teachers")
        .upsert(updateData, { onConflict: "id" });

      if (error) throw error;
      toast.success("Details saved! Redirecting to payment...");
      router.push("/dashboard/tutor/pay");
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!userLoaded || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-[#ff6a97]" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="w-full flex flex-col lg:flex-row gap-8 xl:gap-16 items-start">
        <div className="w-full lg:w-1/2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tutor Settings</h1>
            <p className="text-gray-500 mb-6">
              Manage how students see you in search results.
            </p>

            <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "profile"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "schedule"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Availability
              </button>
            </div>
          </div>

          {activeTab === "profile" ? (
            <form
              onSubmit={handleSave}
              className="space-y-6 bg-white p-6 sm:p-8 border border-gray-100 rounded-3xl shadow-sm"
            >
              <div className="space-y-4 border-b border-gray-50 pb-6">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User size={16} /> Profile Photo
                </label>

                <div
                  className={`relative group border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
                    dragActive
                      ? "border-[#ff6a97] bg-pink-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={profile.image_url || user?.imageUrl}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">
                      Drag and drop your photo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WebP (Max 50MB)
                    </p>
                  </div>

                  <label className="cursor-pointer bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    required
                    className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <BookOpen size={16} /> Subject
                  </label>
                  <input
                    required
                    className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                    value={profile.subject}
                    onChange={(e) =>
                      setProfile({ ...profile, subject: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                    value={profile.price}
                    onChange={(e) =>
                      setProfile({ ...profile, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Globe size={16} /> Country
                  </label>
                  <input
                    className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <PenTool size={16} /> Profile Headline
                </label>
                <input
                  required
                  className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                  value={profile.topic}
                  onChange={(e) =>
                    setProfile({ ...profile, topic: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Video size={16} /> Introduction Video
                </label>
                <div className="flex gap-2">
                  <input
                    placeholder="YouTube URL or upload"
                    className="flex-1 p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                    value={profile.video_url}
                    onChange={(e) =>
                      setProfile({ ...profile, video_url: e.target.value })
                    }
                  />
                  <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-2xl flex items-center justify-center hover:bg-gray-800">
                    <Upload size={18} />
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Detailed Bio
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6a97]"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Profile
              </button>
            </form>
          ) : (
            <div className="space-y-8 bg-white p-6 sm:p-8 border border-gray-100 rounded-3xl shadow-sm">
              <div className="border-b border-gray-100 pb-6">
                <h2 className="text-xl font-bold mb-1">Weekly Schedule</h2>
                <p className="text-gray-500 text-sm font-medium">
                  Define your weekly availability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-5 rounded-3xl">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                    Day
                  </label>
                  <select
                    className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#ff6a97] text-sm font-bold"
                    value={newSlot.day_of_week}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, day_of_week: e.target.value })
                    }
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                    Start
                  </label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#ff6a97] text-sm font-bold"
                    value={newSlot.start_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, start_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                    End
                  </label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#ff6a97] text-sm font-bold"
                    value={newSlot.end_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, end_time: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleAddSlot}
                  className="bg-[#ff6a97] text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              <div className="space-y-6">
                {days.map((day) => {
                  const daySlots = slots.filter((s) => s.day_of_week === day);
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day}>
                      <h4 className="font-bold text-gray-900 mb-3 ml-1 text-sm">
                        {day}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm"
                          >
                            <Clock size={14} className="text-[#ff6a97]" />
                            <span className="text-xs font-bold text-gray-700">
                              {String(slot.start_time || "00:00").slice(0, 5)} -{" "}
                              {String(slot.end_time || "00:00").slice(0, 5)}
                            </span>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {slots.length === 0 && (
                  <div className="text-center py-10">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      No availability set yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 lg:sticky lg:top-10 lg:mt-[104px]">
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest text-center lg:text-left">
            Live Preview
          </h2>
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={profile.image_url || user?.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {profile.name || "Tutor Name"}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {profile.subject || "Subject"}
                </p>
              </div>
            </div>
            <p className="text-[#ff6a97] font-bold text-sm mb-3">
              ✨ {profile.topic || "Your headline..."}
            </p>
            <p className="text-gray-400 text-sm line-clamp-3 mb-6">
              {profile.bio ||
                "Fill out your bio to show students what makes you unique."}
            </p>
            <div className="flex justify-between items-center border-t border-gray-50 pt-5">
              <div>
                <span className="text-2xl font-black text-gray-900">
                  ${profile.price || 0}
                </span>
                <span className="text-gray-400 text-xs block font-medium">
                  50-min lesson
                </span>
              </div>
              <button className="bg-[#ff6a97] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg">
                Book Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
