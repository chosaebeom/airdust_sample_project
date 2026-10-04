"use client";

import { BarChart3, LayoutDashboard, Users } from "lucide-react";
import type { MenuKey } from "@/types/sensing";

type LeftMenuProps = {
  activeMenu: MenuKey;
  onSelect: (menu: MenuKey) => void;
};

const MENU_ITEMS: {
  key: MenuKey;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "stats", label: "통계페이지", icon: BarChart3 },
  { key: "users", label: "사용자페이지", icon: Users },
];

/** 좌측 메뉴: 대시보드 / 통계 / 사용자 */
export default function LeftMenu({ activeMenu, onSelect }: LeftMenuProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <p className="px-4 pb-2 pt-5 text-xs font-semibold tracking-wide text-slate-400">
        메뉴
      </p>
      <nav className="flex flex-col gap-1 px-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.key;

          return (
            <button
              key={item.key}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(item.key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
