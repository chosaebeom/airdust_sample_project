"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Wind } from "lucide-react";
import { verifyLogin } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id.trim() || !pw.trim()) {
      setError("ID와 비밀번호를 모두 입력하세요.");
      return;
    }

    setLoading(true);
    const user = await verifyLogin(id.trim(), pw);
    if (user) {
      login(user);
      router.push("/");
    } else {
      setError("ID 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Wind className="h-7 w-7 text-white" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-white">AIRDUST</h1>
          <p className="mt-1 text-sm text-slate-400">
            센싱 데이터 실시간 관제 시스템
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-5 text-base font-semibold text-white">
            로그인
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <label
                htmlFor="login-id"
                className="mb-1.5 block text-xs font-medium text-slate-400"
              >
                ID
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <input
                  id="login-id"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* PW */}
            <div>
              <label
                htmlFor="login-pw"
                className="mb-1.5 block text-xs font-medium text-slate-400"
              >
                비밀번호
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <input
                  id="login-pw"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p
                className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "확인 중..." : "로그인"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 AIRDUST 관제 시스템
        </p>
      </div>
    </div>
  );
}