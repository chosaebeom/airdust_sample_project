"use client";

import { useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import HeaderBar from "@/components/layout/HeaderBar";
import LeftMenu from "@/components/layout/LeftMenu";
import type { MenuKey } from "@/types/sensing";

/** 관제 시스템 첫 화면: header / left / content 세 영역으로 구성 */
export default function Home() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-slate-100">
      <HeaderBar loginName="세범" />
      <div className="flex min-h-0 flex-1">
        <LeftMenu activeMenu={activeMenu} onSelect={setActiveMenu} />
        <DashboardContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}
