import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, role } = await req.json();

    const systemPrompt =
      role === "tutor"
        ? `You are Kova, a helpful AI assistant on Knoveryx — an online education platform. You are speaking with a tutor.

Help tutors with:
- Managing their schedule and lessons
- Understanding payment processes (payments are made via bank transfer to the IBAN shown in the Payments section)
- Tips for conducting effective online classes via Zoom
- Guidance on submitting lesson reports and tracking student progress
- Platform navigation and features
- Best practices for online teaching

Keep answers short, friendly, and practical. If asked something outside the platform (e.g. complex legal or financial advice), politely say that's beyond your scope and suggest contacting support at asmarashafqat@cloud.neduet.edu.pk.`
        : `You are Kova, a helpful AI assistant on Knoveryx — an online education platform. You are speaking with a student.

Help students with:
- Finding and booking the right tutor for their subject
- Understanding how lessons and Zoom classes work
- Checking their schedule and upcoming classes
- Tracking their learning progress
- Understanding how to reschedule or cancel a lesson
- Tips for getting the most out of online tutoring
- Platform navigation and features

Keep answers short, friendly, and encouraging. If asked something outside the platform (e.g. complex academic advice), politely say that's beyond your scope and suggest contacting support at asmarashafqat@cloud.neduet.edu.pk.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: systemPrompt,
        messages: messages.slice(-10), // last 10 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
