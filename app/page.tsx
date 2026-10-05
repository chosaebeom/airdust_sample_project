"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";
import HeaderBar from "@/components/layout/HeaderBar";
import LeftMenu from "@/components/layout/LeftMenu";
import type { MenuKey } from "@/types/sensing";
import { useAuthStore } from "@/lib/store";

/** 관제 시스템 첫 화면: header / left / content 세 영역으로 구성 */
export default function Home() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [ready, setReady] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setReady(true);
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!ready || !user) {
    return (
      <div className="flex h-svh items-center justify-center bg-slate-900">
        <p className="text-sm text-slate-400">인증 확인 중...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-slate-100">
      <HeaderBar userName={user.name} onLogout={handleLogout} />
      <div className="flex min-h-0 flex-1">
        <LeftMenu activeMenu={activeMenu} onSelect={setActiveMenu} />
        <DashboardContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}
