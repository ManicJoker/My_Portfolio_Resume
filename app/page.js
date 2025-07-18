 "use client"

import { useEffect, useState } from "react";
import Fingerprintjs from "@fingerprintjs/fingerprintjs"

export default function Home() {
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date()

  const thisMonth = month[d.getMonth()]
  const year = d.getFullYear()

  useEffect(() => {
    const sendTracking = async () => {
      try {
        const fp = await Fingerprintjs.load();
        const result = await fp.get();

        const geoRes = await fetch("https://ipapi.co/json");
        const geo = await geoRes.json();

        const payload = {
          event: "page load",
          fingerprint: result.visitorId,
          confidence: result.confidence?.score,

          ip: geo.ip,
          country: geo.country_name,
          region: geo.region,
          city: geo.city,
          org: geo.org,
          timezone: geo.timezone,
          latitude: geo.latitude,
          longitude: geo.longitude,

          user_agent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          touch_support: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
          hardware_concurrency: navigator.hardwareConcurrency,
          device_memory: navigator.deviceMemory,
          cookies_enabled: navigator.cookieEnabled,
        };

        await fetch("/api/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Tracking failed:", err);
      }
    };
    sendTracking()
  },[])

  const handleClick = () => {
    fetch('api/status', {
      method:"POST",
      body: JSON.stringify({"event": "resume click"}),
      header: {
        "Content-Type":"application/json"
      }
    })
  }
  return (
    <div className="min-h-screen bg-stone-400 flex flex-col item-center justify-center p-6 font-sans text-gray-800">
        <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2"><span className="text-orange-300">Wesley</span> Salesberry</h1>
          <p className="text-gray-600 mb-6">System Analyst | Software Engineer</p>
          <hr className="my-6 border-t" />
          <p className="mb-4">Experienced System Analyst and System Programmer with a strong background in mainframe and distributed systems. Skilled in system design, performance tuning, and automation of complex IT infrastructures. Adept at bridging technical and business needs to deliver scalable, efficient solutions.</p>
          <a
            href="/wesley_resume.pdf"
            onClick={handleClick}
            className="inline-block mt-4 px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded shadow"
          > 
           Resume Download
          </a>
          <hr className="my-6 border-t" />
          <p className="text-sm text-gray-500">
            {`Last updated on ${thisMonth} ${year} `}
          </p>
      </div>
    </div>
  );
}
