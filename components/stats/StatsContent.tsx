"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Search } from "lucide-react";
import { STATS_DATA, getAvailableDates } from "@/lib/stats-data";
import { SAMPLE_DEVICES } from "@/lib/sensing-data";

/** 디바이스별 차트 색상 */
const DEVICE_COLORS: Record<string, string> = {
  "PM-YI-001": "#059669",
  "PM-YI-002": "#d97706",
  "PM-YI-003": "#3b82f6",
};

export default function StatsContent() {
  const allDates = useMemo(() => getAvailableDates(), []);
  const minDate = allDates[0] ?? "";
  const maxDate = allDates[allDates.length - 1] ?? "";

  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(maxDate);
  const [selectedDevice, setSelectedDevice] = useState("all");

  const filteredData = useMemo(
    () =>
      STATS_DATA.filter((r) => {
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
        if (selectedDevice !== "all" && r.deviceId !== selectedDevice)
          return false;
        return true;
      }),
    [startDate, endDate, selectedDevice]
  );

  const chartData = useMemo(() => {
    const deviceIds =
      selectedDevice === "all"
        ? SAMPLE_DEVICES.map((d) => d.id)
        : [selectedDevice];
    const dates = [...new Set(filteredData.map((r) => r.date))].sort();
    return dates.map((date) => {
      const row: Record<string, string | number | null> = { date };
      for (const id of deviceIds) {
        const rec = filteredData.find(
          (r) => r.date === date && r.deviceId === id
        );
        row[id] = rec ? rec.pm25 : null;
      }
      return row;
    });
  }, [filteredData, selectedDevice]);

  const visibleDevices = useMemo(
    () =>
      selectedDevice === "all"
        ? SAMPLE_DEVICES
        : SAMPLE_DEVICES.filter((d) => d.id === selectedDevice),
    [selectedDevice]
  );

  const tableData = useMemo(
    () => [...filteredData].sort((a, b) => a.date.localeCompare(b.date)),
    [filteredData]
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-100">
      {/* ===== 1. 검색 영역 ===== */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="stats-start" className="mb-1 block text-xs font-medium text-slate-500">
              시작일
            </label>
            <input
              id="stats-start"
              type="date"
              value={startDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="stats-end" className="mb-1 block text-xs font-medium text-slate-500">
              종료일
            </label>
            <input
              id="stats-end"
              type="date"
              value={endDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="stats-device" className="mb-1 block text-xs font-medium text-slate-500">
              디바이스
            </label>
            <select
              id="stats-device"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">전체 디바이스</option>
              {SAMPLE_DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setStartDate(minDate);
              setEndDate(maxDate);
              setSelectedDevice("all");
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-700"
          >
            <Search className="h-3.5 w-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* ===== 2. 라인 차트 ===== */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          미세먼지(PM2.5) 추이
        </h3>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  label={{
                    value: "㎍/m³",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 12, fill: "#94a3b8" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    value != null ? `${value} ㎍/m³` : "—",
                    String(name),
                  ]}
                />
                <Legend
                  formatter={(value: string) => {
                    const dev = visibleDevices.find((d) => d.id === value);
                    return dev ? dev.name : value;
                  }}
                />
                {visibleDevices.map((d) => (
                  <Line
                    key={d.id}
                    type="monotone"
                    dataKey={d.id}
                    stroke={DEVICE_COLORS[d.id] ?? "#64748b"}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* ===== 3. 그리드 테이블 ===== */}
      <div className="min-h-0 flex-1 overflow-auto bg-white px-5 py-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          측정 결과 상세
        </h3>
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2.5 font-medium text-slate-600">
                측정일
              </th>
              <th className="px-3 py-2.5 font-medium text-slate-600">
                디바이스명
              </th>
              <th className="px-3 py-2.5 font-medium text-slate-600">
                미세먼지(PM2.5)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <tr
                  key={`${row.date}-${row.deviceId}`}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2.5 text-slate-700">{row.date}</td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {row.deviceName}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-slate-800">
                    {row.pm25} ㎍/m³
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-8 text-center text-sm text-slate-400"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}