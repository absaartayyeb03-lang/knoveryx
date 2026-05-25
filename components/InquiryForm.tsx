"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  gmail: z.string().email("Please enter a valid Gmail address"),
  whatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),
  message: z.string().min(10, "Please tell us a bit more about your needs"),
});

export const InquiryForm = ({ subject }: { subject: string }) => {
  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", gmail: "", whatsapp: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof inquirySchema>) => {
    // Construct the WhatsApp Message
    const encodedMessage = encodeURIComponent(
      `*New Inquiry from SkillSphere*\n\n` +
      `*Interested In:* ${subject}\n` +
      `*Parent Name:* ${values.name}\n` +
      `*Gmail:* ${values.gmail}\n` +
      `*Message:* ${values.message}`
    );
    
    // Replace 'your-number' with your client's actual WhatsApp number (including country code)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 text-left">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} className="rounded-xl" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Gmail Address</FormLabel>
                <FormControl><Input placeholder="example@gmail.com" {...field} className="rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">WhatsApp Number</FormLabel>
                <FormControl><Input placeholder="+1 234..." {...field} className="rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">How can we help the student?</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the student's goals or specific board needs..." {...field} className="rounded-xl min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-[#033D8B] hover:bg-[#022c66] text-white py-7 text-lg font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95">
          Submit Inquiry
        </Button>
      </form>
    </Form>
  );
};