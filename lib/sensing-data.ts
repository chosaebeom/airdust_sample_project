import type { DeviceStatus, SensingDevice } from "@/types/sensing";

/** 경기도 용인시 중심 좌표 (용인시청 인근) */
export const YONGIN_CENTER = {
  lat: 37.2410864,
  lng: 127.1775537,
} as const;

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  normal: "정상",
  over_threshold: "임계치초과",
  comm_error: "통신이상",
};

/** 상태별 색상 (지도 아이콘·범례·팝업에서 공통 사용) */
export const STATUS_COLOR: Record<DeviceStatus, string> = {
  normal: "#059669",
  over_threshold: "#d97706",
  comm_error: "#64748b",
};

/** 용인시 일대 샘플 단말 — 세 가지 상태를 한 화면에 보여주기 위한 목업 */
export const SAMPLE_DEVICES: SensingDevice[] = [
  {
    id: "PM-YI-001",
    name: "용인시청 대기측정소",
    address: "경기도 용인시 처인구 삼가동 시청로 55",
    lat: 37.24109,
    lng: 127.17755,
    status: "normal",
    pm25: 22,
  },
  {
    id: "PM-YI-002",
    name: "기흥구 보정동 측정소",
    address: "경기도 용인시 기흥구 보정동 1171",
    lat: 37.2774,
    lng: 127.1521,
    status: "over_threshold",
    pm25: 96,
  },
  {
    id: "PM-YI-003",
    name: "수지구 풍덕천 측정소",
    address: "경기도 용인시 수지구 풍덕천동 1080",
    lat: 37.3132,
    lng: 127.0774,
    status: "comm_error",
    pm25: null,
  },
];
