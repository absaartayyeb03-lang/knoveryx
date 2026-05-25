"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { CheckCircle, XCircle, ExternalLink, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. SECURITY CHECK ---
  // Change this to your actual Clerk email address
  const ADMIN_EMAIL = "salmanabdullah619@gmail.com"; 

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

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("application_status", "pending_review");

    if (!error) setTeachers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isSessionLoaded && session && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      fetchPending();
    }
  }, [session, isSessionLoaded, user]);

 const updateStatus = async (id: string, status: string) => {
    // We create the update object
    const updateData: any = { application_status: status };

    // IF we are approving, we MUST also set is_displayed to true
    if (status === "approved") {
      updateData.is_displayed = true;
    }

    const { error } = await supabase
      .from("teachers")
      .update(updateData) // Use the object we just built
      .eq("id", id);

    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success(`Teacher ${status}!`);
      fetchPending(); 
    }
  };

  // --- 2. PERMISSION UI ---
  if (!isUserLoaded || !isSessionLoaded) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10 bg-red-50 rounded-3xl border border-red-100">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-xl font-bold text-red-900">Access Denied</h1>
          <p className="text-red-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2 text-slate-900">
        <UserCheck className="text-blue-600" size={32} /> Pending Approvals
      </h1>

      <div className="grid gap-6">
        {loading ? (
           <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>
        ) : teachers.length === 0 ? (
          <p className="text-slate-500 bg-white p-10 rounded-2xl text-center border border-dashed">No pending applications found.</p>
        ) : (
          teachers.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden relative border-2 border-slate-50">
                  <img src={t.image_url || "/placeholder-tutor.jpg"} className="object-cover w-full h-full" alt="" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{t.name || "Unnamed Tutor"}</h3>
                  <p className="text-sm text-slate-500">{t.subject} · {t.country}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">ID: {t.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {t.receipt_url && (
                  <a 
                    href={t.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-all"
                  >
                    <ExternalLink size={16} /> View Receipt
                  </a>
                )}
                
                <button 
                  onClick={() => updateStatus(t.id, "approved")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shadow-md shadow-green-100 transition-all active:scale-95"
                >
                  <CheckCircle size={16} /> Approve
                </button>

                <button 
                  onClick={() => updateStatus(t.id, "rejected")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}