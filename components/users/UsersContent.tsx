"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SAMPLE_USERS } from "@/lib/users-data";

export default function UsersContent() {
  // 검색어 (input 값) vs 적용된 검색어 (버튼 클릭 시 저장)
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const handleSearch = () => {
    setAppliedSearch(searchInput.trim());
  };

  const filteredUsers = SAMPLE_USERS.filter((u) =>
    appliedSearch ? u.name.includes(appliedSearch) : true
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-100">
      {/* ===== 1. 검색 영역 ===== */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-end gap-3">
          <div>
            <label
              htmlFor="user-search"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              이름 검색
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="user-search"
                type="text"
                placeholder="이름 입력"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-56 rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            검색
          </button>
        </div>
      </div>

      {/* ===== 2. 그리드 영역 ===== */}
      <div className="min-h-0 flex-1 overflow-auto bg-white px-5 py-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          사용자 목록
          {appliedSearch && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              &ldquo;{appliedSearch}&rdquo; 일치: {filteredUsers.length}명
            </span>
          )}
        </h3>
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2.5 font-medium text-slate-600">
                아이디
              </th>
              <th className="px-3 py-2.5 font-medium text-slate-600">
                이름
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2.5 text-slate-700">{u.id}</td>
                  <td className="px-3 py-2.5 text-slate-700">{u.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 py-8 text-center text-sm text-slate-400"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}