'use client'

import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";
import * as UAParser from "ua-parser-js";

import Head from "next/head";

export default function EnrichedLogView() {
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState()
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchLogs();
    fetchDevices()
  }, []);

  async function fetchLogs() {
    const { data, error } = await supabase
      .from("enriched_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Error fetching logs:", error);
    } else {
      setLogs(data || []);
    }
  }

  const fetchDevices = async () => {
  const { data, error } = await supabase
    .from("logs")
    .select("fingerprint, useragent")
    .order("timestamp", { ascending: false })
    .limit(200);

  if (!error) {
    // Convert to object keyed by fingerprint
    const map = {};
    data.forEach((entry) => {
      map[entry.fingerprint] = entry.useragent;
    });
    setDevices(map);
  } else {
    console.error("Failed to load useragents:", error);
  }
};

  const filteredLogs = logs.filter((log) => {
    const q = query.toLowerCase();
    return (
      log.fingerprint?.toLowerCase().includes(q) ||
      (log.reason_tags || []).join(",").toLowerCase().includes(q) ||
      String(log.suspicion_score || "").includes(q) ||
      String(log.is_suspicious).includes(q) ||
      String(log.is_known_bad_actor).includes(q)
    );
  });

  return (
    <>
      <Head>
        <title>Enriched Logs (Internal)</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Enriched Logs</h1>

        <input
          type="text"
          placeholder="Search any field..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 p-2 border rounded w-full max-w-md"
        />

        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2">Score</th>
                <th className="p-2">Fingerprint</th>
                <th className="p-2">Suspicious</th>
                <th className="p-2">Tags</th>
                <th className="p-2">Bad Actor</th>
                <th className="p-2">Device / OS / Browser</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const userAgent = devices?.[log.fingerprint] || "";
                const parser = new UAParser.UAParser(userAgent);
                const os = parser.getOS();
                const device = parser.getDevice();
                const browser = parser.getBrowser();

    return (
    <tr
      key={log.id}
      className={`border-b ${log.is_suspicious ? "bg-red-50" : ""}`}
    >
      <td className="p-2 font-bold">{log.suspicion_score}</td>
      <td className="p-2">{log.fingerprint}</td>
      <td className="p-2">{log.is_suspicious ? "✅" : "—"}</td>
      <td className="p-2">
        {(log.reason_tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 text-xs font-medium rounded px-2 py-1 mr-1 mb-1"
          >
            {tag}
          </span>
        ))}
      </td>
      <td className="p-2">{log.is_known_bad_actor ? "Yes" : "No"}</td>
      <td className="p-2 text-xs">
        {browser.name} {browser.version} <br />
        {os.name} {os.version} <br />
        {device.model || "Desktop"}
      </td>
      <td className="p-2 text-xs text-gray-500">
        {new Date(log.created_at).toLocaleString()}
      </td>
    </tr>
  );
})}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <p className="text-gray-400 p-4">No logs found.</p>
          )}
        </div>
      </div>
    </>
  );
}
