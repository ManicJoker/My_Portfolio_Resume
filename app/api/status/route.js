import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const useragent = req.headers.get("user-agent") || null;
    const language = req.headers.get("accept-language") || null;

    const {
      event = "unknown",
      fingerprint,
      confidence,
      ip: geo_ip,
      country,
      region,
      city,
      org,
      timezone,
      latitude,
      longitude,
      user_agent,
      platform,
      screen_resolution,
      touch_support,
      hardware_concurrency,
      device_memory,
      cookies_enabled,
    } = body;

    const { error } = await supabase.from("logs").insert({
      timestamp: new Date().toISOString(),
      ip,
      event,
      fingerprint,
      confidence,
      geo_ip,
      country,
      region,
      city,
      org,
      timezone,
      latitude,
      longitude,
      user_agent, // from headers
      language,
      user_agent, // from navigator
      platform,
      screen_resolution,
      touch_support,
      hardware_concurrency,
      device_memory,
      cookies_enabled,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track Error:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
