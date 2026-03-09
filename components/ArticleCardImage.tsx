"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGES = [
  "/article-fallbacks/ai-1.svg",
  "/article-fallbacks/ai-2.svg",
  "/article-fallbacks/ai-3.svg",
  "/article-fallbacks/ai-4.svg",
  "/article-fallbacks/ai-5.svg",
] as const;

function hashToIndex(input: string, mod: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return mod === 0 ? 0 : h % mod;
}

export function ArticleCardImage({
  src,
  alt = "",
  fill,
  className,
  sizes,
  fallbackKey,
}: {
  src?: string;
  alt?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  fallbackKey?: string;
}) {
  const [failed, setFailed] = useState(false);
  const key = fallbackKey || src || alt || "fallback";
  const fallbackUrl = FALLBACK_IMAGES[hashToIndex(key, FALLBACK_IMAGES.length)];
  const url = failed || !src ? fallbackUrl : src;
  const unoptimized = url.startsWith("http") || url.startsWith("data:") || url.endsWith(".svg");
  return (
    <Image
      src={url}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      unoptimized={unoptimized}
      onError={() => setFailed(true)}
    />
  );
}
