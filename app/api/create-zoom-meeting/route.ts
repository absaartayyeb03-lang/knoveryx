import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lessonId, topic, startTime } = await req.json();

    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Zoom token error:", err);
      return NextResponse.json({ error: "Failed to get Zoom token" }, { status: 500 });
    }

    const { access_token } = await tokenRes.json();

    const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic || `Knoveryx Class`,
        type: 1, // instant meeting
        settings: {
          join_before_host: true,
          waiting_room: false,
          host_video: true,
          participant_video: true,
        },
      }),
    });

    if (!meetingRes.ok) {
      const err = await meetingRes.text();
      console.error("Zoom meeting create error:", err);
      return NextResponse.json({ error: "Failed to create Zoom meeting" }, { status: 500 });
    }

    const meeting = await meetingRes.json();
    return NextResponse.json({
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      meeting_id: meeting.id,
    });
  } catch (error) {
    console.error("Zoom API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
