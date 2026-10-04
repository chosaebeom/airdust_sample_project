/** 미세먼지 단말의 현재 통신/측정 상태 */
export type DeviceStatus = "normal" | "over_threshold" | "comm_error";

/** 좌측 메뉴에서 선택 가능한 화면 */
export type MenuKey = "dashboard" | "stats" | "users";

/** 지도에 표시할 미세먼지 단말 정보 */
export type SensingDevice = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  /** 통신이상일 때는 측정값을 수신하지 못한 것으로 간주 */
  pm25: number | null;
};
