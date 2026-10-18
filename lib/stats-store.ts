import { create } from "zustand";
import { getAvailableDates } from "@/lib/stats-data";
import { SAMPLE_DEVICES } from "@/lib/sensing-data";
import type { MenuKey,SensingDevice } from "@/types/sensing";

const availableDates = getAvailableDates();
const defaultMinDate = availableDates[0] ?? "";
const defaultMaxDate = availableDates[availableDates.length - 1] ?? "";

export type TabType = "map" | "stats";

interface StatsState {
  activeMenu: MenuKey;
  setActiveMenu: (menu: MenuKey) => void;

  minDate: string;
  maxDate: string;
  startDate: string;
  endDate: string;
  selectedDevice: string; // "all" 또는 단말 ID (예: "PM-YI-001")
  devices: SensingDevice[]; // 단말 목록 (단말명 포함)
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSelectedDevice: (deviceId: string) => void;
  resetFilters: () => void;
  focusDeviceStats: (deviceId: string) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  activeMenu: "dashboard",
  setActiveMenu: (activeMenu) => set({ activeMenu }),

  minDate: defaultMinDate,
  maxDate: defaultMaxDate,
  startDate: defaultMinDate,
  endDate: defaultMaxDate,
  selectedDevice: "all",
  devices: SAMPLE_DEVICES,

  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
  resetFilters: () =>
    set({
      startDate: defaultMinDate,
      endDate: defaultMaxDate,
      selectedDevice: "all",
    }),
  focusDeviceStats: (deviceId) =>
    set({
      selectedDevice: deviceId,
      startDate: defaultMinDate,
      endDate: defaultMaxDate,
      activeMenu: "stats",
    }),
}));