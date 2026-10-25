"use client";

import dynamic from "next/dynamic";
import { useState , useRef, useEffect} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  Search,
  X,Loader2,
} from "lucide-react";
import DeviceDetailPopup from "@/components/dashboard/DeviceDetailPopup";
import StatsContent from "@/components/stats/StatsContent";
import UsersContent from "@/components/users/UsersContent";
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
// 채팅 메시지 타입 정의
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}
type DashboardContentProps = {
  activeMenu: MenuKey;
};

/** 우측 콘텐츠 영역: 메뉴별 화면. 현재는 대시보드(지도)만 구현 */
export default function DashboardContent({
  activeMenu,
}: DashboardContentProps) {
  
   if (activeMenu === "stats") {
    return <StatsContent />;
  }

  if (activeMenu === "users") {
    return <UsersContent />;
  }
  
  const [selectedDevice, setSelectedDevice] = useState<SensingDevice | null>(
    null,
  );
  // 2. 채팅창 열림/닫힘 상태(showChat) 추가
  const [showChat, setShowChat] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "안녕하세요! 용인시 관제 대시보드에서 궁금한 장비나 상태가 있으신가요?",
    },
  ]);
  // 새 메시지 추가 시 자동 스크롤용 Ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages, // 이전 대화 문맥 함께 전달
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.reply || "답변을 불러오지 못했습니다.",
      };

      setMessages((prev) => [...prev, aiMsg]);

      // ★ 핵심 포인트: AI가 특정 장비 ID를 지목하면 지도 팝업을 자동으로 띄움!
      if (data.targetDeviceId) {
        const matchedDevice = SAMPLE_DEVICES.find(
          (d) => d.id === data.targetDeviceId,
        );
        if (matchedDevice) {
          setSelectedDevice(matchedDevice);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "서버와 통신 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키로 전송 (Shift + Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
{/* ========== 채팅 패널 ========== */}
        <div
          className={`absolute top-4 right-4 z-50 w-96 bg-slate-900/95 rounded-2xl shadow-2xl flex flex-col border border-slate-700 transition-all ${
            showChat ? "h-[560px] max-h-[calc(100%-2rem)]" : "h-auto"
          }`}
        >
          {/* 1. 상단 타이틀 바 */}
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="w-full shrink-0 flex items-center justify-between px-4 py-3 rounded-t-2xl text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Search className="h-4 w-4 text-emerald-400" />
              AI 관제 어시스턴트
            </span>
            {showChat && <X className="h-4 w-4 text-slate-400" />}
          </button>

          {showChat && (
            <div className="flex min-h-0 flex-1 flex-col justify-between border-t border-slate-800">
              {/* 2. 중앙 대화 메시지 목록 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) =>
                  msg.role === "ai" ? (
                    <div
                      key={msg.id}
                      className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                          AI
                        </div>
                        <span className="text-xs font-medium text-slate-200">
                          AI 어시스턴트
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-xl rounded-tr-none bg-emerald-600 px-3.5 py-2.5 text-xs leading-relaxed text-white whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  ),
                )}

                {/* 로딩 인디케이터 */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 px-2 py-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    센서 데이터를 분석 중입니다...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 3. 하단 고정 입력 영역 */}
              <div className="shrink-0 border-t border-slate-800 bg-slate-900/90 p-3 rounded-b-2xl">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="예: 현재 임계치 초과인 장비 알려줘 (Enter로 전송)"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "답변 생성 중..." : "질문하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}