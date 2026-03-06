"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = [title, description].filter(Boolean).join(" - ");

  const shareKakao = () => {
    if (typeof window === "undefined" || !(window as unknown as { Kakao?: { Share?: { sendDefault: (o: object) => void } } }).Kakao) {
      window.open(`https://story.kakao.com/share?url=${encodeURIComponent(fullUrl)}`, "_blank");
      return;
    }
    (window as unknown as { Kakao: { Share: { sendDefault: (o: object) => void } } }).Kakao.Share.sendDefault({
      objectType: "feed",
      content: { title, description: description || title },
      itemContent: { profileText: "AI 툴 올인원", link: { mobileWebUrl: fullUrl, webUrl: fullUrl } },
    });
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600">공유</span>
      <button
        type="button"
        onClick={shareKakao}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        aria-label="카카오톡으로 공유"
      >
        카카오톡
      </button>
      <button
        type="button"
        onClick={shareX}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        aria-label="X로 공유"
      >
        X
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        aria-label="링크 복사"
      >
        {copied ? "복사됨" : "링크 복사"}
      </button>
    </div>
  );
}
