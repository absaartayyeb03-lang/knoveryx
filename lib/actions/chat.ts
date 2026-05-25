"use server"

import { redirect } from "next/navigation";
import { createSupabaseClient } from "../supabase";

export async function startConversation(teacherId: string) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login"); // Send them to login if not authenticated
  }

  // 1. Try to insert a new conversation
  // .upsert with 'onConflict' handles the "unique" constraint we set in SQL
  const { data, error } = await supabase
    .from("conversations")
    .upsert({ 
        student_id: user.id, 
        teacher_id: teacherId 
    }, { onConflict: 'student_id, teacher_id' })
    .select()
    .single();

  if (error) {
    console.error("Error starting conversation:", error);
    return;
  }

  // 2. Redirect the user to the chat page for this conversation
  redirect(`/messages/${data.id}`);
}