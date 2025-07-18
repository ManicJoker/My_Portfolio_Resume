"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/app/lib/supabase";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(200);

      if (!error) {
        setLogs(data);
        setFilteredLogs(data);
      } else {
        console.error("Failed to load logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = logs.filter((log) => {
      return (
        log.ip?.toLowerCase().includes(value) ||
        log.fingerprint?.toLowerCase().includes(value) ||
        log.geo?.country?.toLowerCase().includes(value)
      );
    });

    setFilteredLogs(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Log Status Dashboard</h1>

      <input
        type="text"
        placeholder="Search by IP, fingerprint, or country"
        value={search}
        onChange={handleSearch}
        className="w-full md:w-1/2 px-4 py-2 mb-4 border rounded"
      />

      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-sm text-left">
              <th className="px-4 py-2 border">Fingerprint</th>
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">Event</th>
              <th className="px-4 py-2 border">IP</th>
              <th className="px-4 py-2 border">Country</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No logs found.
                </td>
              </tr>
            )}
            {filteredLogs.map((log) => (
              <tr key={log.id} className="text-sm border-t">
                <td className="px-4 py-2 border text-xs">{log.fingerprint}</td>
                <td className="px-4 py-2 border text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{log.event}</td>
                <td className="px-4 py-2 border">{log.ip}</td>
                <td className="px-4 py-2 border">
                  {log.country || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}