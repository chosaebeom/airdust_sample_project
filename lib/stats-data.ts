import { SAMPLE_DEVICES } from "./sensing-data";

export type StatsRecord = {
  date: string; // "YYYY-MM-DD"
  deviceId: string;
  deviceName: string;
  pm25: number;
};

/** 날짜를 YYYY-MM-DD 포맷으로 변환 */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 기존 대시보드 디바이스 기준으로 최근 7일치 랜덤 PM2.5 측정값 생성.
 * 모듈 로드 시 한 번만 생성되어 세션 내에서 동일한 데이터를 사용.
 */
function generate(): StatsRecord[] {
  const records: StatsRecord[] = [];
  const today = new Date();

  for (const device of SAMPLE_DEVICES) {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      // PM2.5: 5~150 ㎍/m³ 랜덤
      const pm25 = Math.floor(Math.random() * 146) + 5;
      records.push({
        date: toDateStr(d),
        deviceId: device.id,
        deviceName: device.name,
        pm25,
      });
    }
  }

  return records;
}

/** 모듈 수준에서 한 번 생성 (세션 내 고정) */
export const STATS_DATA: StatsRecord[] = generate();

/** 데이터에서 사용 가능한 날짜 목록 (정렬) */
export function getAvailableDates(): string[] {
  return [...new Set(STATS_DATA.map((r) => r.date))].sort();
}