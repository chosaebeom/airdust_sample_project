"use client";

import { MapPin, Radio, Wind, X } from "lucide-react";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/sensing-data";
import type { SensingDevice } from "@/types/sensing";

type DeviceDetailPopupProps = {
  device: SensingDevice;
  onClose: () => void;
};

/** 단말 아이콘 클릭 시 표시하는 상세 팝업 */
export default function DeviceDetailPopup({
  device,
  onClose,
}: DeviceDetailPopupProps) {
  const statusLabel = STATUS_LABEL[device.status];
  const statusColor = STATUS_COLOR[device.status];
  const pmText =
    device.pm25 === null ? "수신 불가" : `${device.pm25} ㎍/m³`;

  return (
    <div
      className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-popup-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-medium text-slate-400">{device.id}</p>
            <h2
              id="device-popup-title"
              className="mt-1 text-lg font-semibold text-slate-900"
            >
              {device.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="팝업 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="space-y-4 px-5 py-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">설치주소</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">
                {device.address}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Radio className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">현재상태</dt>
              <dd className="mt-1">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {statusLabel}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Wind className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">현재 미세먼지 값 (PM2.5)</dt>
              <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                {pmText}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
