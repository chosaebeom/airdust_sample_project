"use client";

import { LogOut, Wind } from "lucide-react";

type HeaderBarProps = {
  userName: string;
  onLogout: () => void;
};

/** 화면 상단 헤더: 좌측 로고·프로젝트명, 우측 로그인명·로그아웃 */
export default function HeaderBar({ userName, onLogout }: HeaderBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-5 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
          <Wind className="h-5 w-5" aria-hidden />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-medium tracking-wide text-emerald-300">
            AIRDUST
          </p>
          <h1 className="text-base font-semibold sm:text-lg">
            센싱 데이터 실시간 관제 시스템
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-slate-400">로그인 계정</p>
          <p className="text-sm font-medium">{userName}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-700"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          로그아웃
        </button>
      </div>
    </header>
  );
}
