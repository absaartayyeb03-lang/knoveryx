"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { Check, Upload, Loader2, ArrowRight, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function ManualPaymentPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const router = useRouter();
  
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");

  // 1. Memoized client for Database queries (upserting the URL later)
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

  // 2. The working Upload Handler (Synced with your Tutor Profile logic)
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Immediate capture of the file and input target
    const file = e.target.files?.[0];
    const inputTarget = e.target;

    if (!file || !user?.primaryEmailAddress?.emailAddress) return;

    const toastId = toast.loading("Uploading receipt...");

    try {
      setUploading(true);

      // Fetch fresh Clerk JWT
      const token = await session?.getToken({ template: "supabase" });
      if (!token) throw new Error("Could not retrieve authentication token");

      // Initialize temporary client specifically for Storage (Production-reliable pattern)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

      const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      // Match the pathing logic of your Tutor Profile
      const userEmail = user.primaryEmailAddress.emailAddress.toLowerCase();
      const fileExt = file.name.split(".").pop();
      const fileName = `receipt-${Date.now()}.${fileExt}`;
      const filePath = `${userEmail}/${fileName}`;

      // Perform the Upload to the 'payment-receipts' bucket
      const { error: uploadError } = await supabaseAuth.storage
        .from("payment-receipts")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Generate Public URL
      const { data } = supabaseAuth.storage.from("payment-receipts").getPublicUrl(filePath);
      
      setReceiptUrl(data.publicUrl);
      toast.success("Receipt uploaded successfully!", { id: toastId });

    } catch (error: any) {
      console.error("❌ UPLOAD FAILED:", error);
      toast.error(error.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (inputTarget) inputTarget.value = ""; // Clear input for re-uploads
    }
  };

  // 3. Finalize DB Update
  const finalizeApplication = async () => {
    if (!receiptUrl) return toast.error("Please upload your payment receipt first.");
    
    const loadingToast = toast.loading("Finalizing your application...");

    const { error } = await supabase.from("teachers").upsert({ 
      id: user?.id, 
      receipt_url: receiptUrl,
      application_status: "pending_review"
    }, { onConflict: 'id' });

    if (error) {
      toast.error("Update failed: " + error.message, { id: loadingToast });
    } else {
      toast.success("Application submitted!", { id: loadingToast });
      router.push("/dashboard/tutor/pending"); // Or wherever you want them to go
    }
  };

  if (!isUserLoaded || !isSessionLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6">
      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Bank Details */}
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-6">Verify your profile</h1>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-[#174933]">
              <Banknote size={20} /> Bank Transfer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Bank Name</span>
                <span className="font-bold">Meezan Bank</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Account Title</span>
                <span className="font-bold">SkillSphere Education</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">IBAN / Account #</span>
                <span className="font-bold">PK00MEZN000102030405</span>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl text-[#ff6a97] font-bold text-center">
                Fee Amount: 5,000 PKR / 10 OMR
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 px-2">
            * Once uploaded, our team will verify your payment within 24-48 hours.
          </p>
        </div>

        {/* Right Side: Upload Card */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Submit Proof of Payment</h2>
          
          <label className="group relative w-full h-48 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all mb-8">
            {receiptUrl ? (
              <div className="text-center">
                <Check className="text-[#43d2b1] mx-auto mb-2" size={40} />
                <p className="text-sm font-bold text-slate-700">Receipt Attached</p>
                <p className="text-[10px] text-slate-400">Click to change file</p>
              </div>
            ) : (
              <>
                {uploading ? (
                  <Loader2 className="animate-spin text-[#ff6a97]" size={32} />
                ) : (
                  <Upload className="text-slate-300 group-hover:text-[#ff6a97] mb-2" size={32} />
                )}
                <p className="text-sm font-bold text-slate-500">
                  {uploading ? "Uploading..." : "Click to upload screenshot"}
                </p>
              </>
            )}
            
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              disabled={uploading}
              onChange={(e) => handleReceiptUpload(e)} 
            />
          </label>

          <button 
            onClick={finalizeApplication}
            disabled={!receiptUrl || uploading}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {uploading ? "Processing..." : "Complete Application"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}