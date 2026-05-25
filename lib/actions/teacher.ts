"use server";
import { createSupabaseClient } from "@/lib/supabase"; // Ensure this uses your service_role or correct config
import { revalidatePath } from "next/cache";

export const getAllTeachers = async ({ 
  limit = 10, 
  page = 1, 
  subject, 
  topic 
}: { 
  limit?: number; 
  page?: number; 
  subject?: string; 
  topic?: string 
}) => {
    const supabase = createSupabaseClient();
    let query = supabase.from('teachers').select('*');

    // ONLY show approved and displayed teachers to the public
    query = query.eq('application_status', 'approved');
    query = query.eq('is_displayed', true);

    if(subject && subject !== "All") {
        query = query.ilike('subject', `%${subject}%`);
    }
    
    if(topic) {
        query = query.or(`name.ilike.%${topic}%,bio.ilike.%${topic}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: teachers, error } = await query;
    if(error) throw new Error(error.message);

    return teachers;
};

export const approveTeacher = async (teacherId: string) => {
  const supabase = createSupabaseClient();

  // 1. Log the attempt
  console.log("🚀 Starting approval for:", teacherId);

  const { data, error } = await supabase
    .from('teachers')
    .update({ 
      application_status: 'approved', 
      is_displayed: true // Make sure this matches your DB column name exactly
    })
    .eq('id', teacherId)
    .select(); // This tells us what actually changed

  if (error) {
    console.error("❌ Supabase Update Error:", error.message);
    throw new Error(error.message);
  }

  console.log("✅ Update Successful. New Data:", data);

  // 2. Force Next.js to clear the cache for these pages
  revalidatePath("/tutors");
  revalidatePath("/dashboard/admin");
  
  return data;
};