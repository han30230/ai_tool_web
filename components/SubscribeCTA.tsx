"use client";

import { useState } from "react";

export function SubscribeCTA() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">최신 AI 툴 업데이트를 이메일로 받아보기</h3>
      <p className="mt-1 text-sm text-slate-600">주간 요약과 신규 툴 소식을 보내드립니다.</p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          구독하기
        </button>
      </form>
      {toast && (
        <p className="mt-2 text-sm text-amber-600" role="status">
          구독 기능 준비 중입니다. 곧 연동될 예정이에요.
        </p>
      )}
    </div>
  );
}
