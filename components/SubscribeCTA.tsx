"use client";

import { useState } from "react";

export function SubscribeCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        const err = data.error || "UNKNOWN";
        if (err === "SUBSCRIBE_NOT_CONFIGURED") {
          throw new Error("구독 연동이 아직 설정되지 않았습니다. (관리자: 웹훅 설정 필요)");
        }
        if (err === "INVALID_EMAIL") {
          throw new Error("이메일 형식을 확인해 주세요.");
        }
        throw new Error("구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setEmail("");
      setStatus("success");
      setMessage("구독이 완료되었습니다. 감사합니다!");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "구독 처리 중 오류가 발생했습니다.");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    }
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
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 min-h-[44px] text-base placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-primary px-4 py-2.5 min-h-[44px] text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 active:opacity-90 touch-manipulation"
        >
          {status === "loading" ? "처리 중..." : "구독하기"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-emerald-700" : status === "error" ? "text-rose-700" : "text-slate-600"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
