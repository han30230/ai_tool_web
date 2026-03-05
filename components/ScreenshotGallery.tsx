"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80";

interface ScreenshotGalleryProps {
  urls: string[];
  toolName: string;
}

export function ScreenshotGallery({ urls, toolName }: ScreenshotGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [mainFailed, setMainFailed] = useState(false);
  const list = urls.length >= 2 ? urls : [urls[0] || FALLBACK, FALLBACK, FALLBACK, FALLBACK].slice(0, 4);
  const mainUrl = mainFailed ? FALLBACK : list[mainIndex] || FALLBACK;

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 shadow-md transition-transform hover:scale-[1.01]">
        <Image
          src={mainUrl}
          alt={`${toolName} 스크린샷`}
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width:1024px) 100vw, 66vw"
          onError={() => setMainFailed(true)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {list.slice(0, 4).map((url, i) => (
          <Thumbnail
            key={i}
            url={url}
            isActive={mainIndex === i}
            onClick={() => {
              setMainIndex(i);
              setMainFailed(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Thumbnail({
  url,
  isActive,
  onClick,
}: {
  url: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? FALLBACK : url;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 shadow transition hover:shadow-md sm:w-28 ${
        isActive ? "border-primary" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        unoptimized
        sizes="112px"
        onError={() => setFailed(true)}
      />
    </button>
  );
}
