"use client";

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
import type { SensingDevice } from "@/types/sensing";

/** 디바이스별 차트 색상 */
const DEVICE_COLORS: Record<string, string> = {
  "PM-YI-001": "#059669",
  "PM-YI-002": "#d97706",
  "PM-YI-003": "#3b82f6",
};

export type ChartRow = Record<string, string | number | null>;

type StatsLineChartProps = {
  chartData: ChartRow[];
  visibleDevices: SensingDevice[];
  deviceNameMap: Map<string, string>;
};

export default function StatsLineChart({
  chartData,
  visibleDevices,
  deviceNameMap,
}: StatsLineChartProps) {
  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickFormatter={(v) => String(v).slice(5)}
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
            deviceNameMap.get(String(name)) ?? String(name),
          ]}
        />
        <Legend
          formatter={(value: string) => deviceNameMap.get(value) ?? value}
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
  );
}