"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Construction,
  WifiOff,
} from "lucide-react";
import DeviceDetailPopup from "@/components/dashboard/DeviceDetailPopup";
import { SAMPLE_DEVICES, STATUS_COLOR } from "@/lib/sensing-data";
import type { MenuKey, SensingDevice } from "@/types/sensing";

const SensingMap = dynamic(() => import("@/components/dashboard/SensingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
      지도를 불러오는 중...
    </div>
  ),
});

type DashboardContentProps = {
  activeMenu: MenuKey;
};

/** 우측 콘텐츠 영역: 메뉴별 화면. 현재는 대시보드(지도)만 구현 */
export default function DashboardContent({
  activeMenu,
}: DashboardContentProps) {
  const [selectedDevice, setSelectedDevice] = useState<SensingDevice | null>(
    null,
  );

  if (activeMenu !== "dashboard") {
    const title = activeMenu === "stats" ? "통계페이지" : "사용자페이지";

    return (
      <section className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Construction className="h-10 w-10" aria-hidden />
          <p className="text-lg font-semibold text-slate-700">{title}</p>
          <p className="text-sm">이 화면은 이후 단계에서 구성합니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col bg-slate-100">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            실시간 관제 지도
          </h2>
          <p className="text-xs text-slate-500">경기도 용인시 기준</p>
        </div>
        <ul className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <li className="flex items-center gap-1.5">
            <CheckCircle2
              className="h-4 w-4"
              style={{ color: STATUS_COLOR.normal }}
            />
            정상
          </li>
          <li className="flex items-center gap-1.5">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: STATUS_COLOR.over_threshold }}
            />
            임계치초과
          </li>
          <li className="flex items-center gap-1.5">
            <WifiOff
              className="h-4 w-4"
              style={{ color: STATUS_COLOR.comm_error }}
            />
            통신이상
          </li>
        </ul>
      </div>

      <div className="relative min-h-0 flex-1">
        <SensingMap
          devices={SAMPLE_DEVICES}
          onSelectDevice={setSelectedDevice}
        />
        {selectedDevice ? (
          <DeviceDetailPopup
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
          />
        ) : null}
      </div>
    </section>
  );
}
