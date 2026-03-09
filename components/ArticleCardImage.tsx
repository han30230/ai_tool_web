"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1686191128892-cf7f8e7e8b2e?w=800&q=80",
  "https://images.unsplash.com/photo-1676299085922-6cbedae6b698?w=800&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
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
  src: string;
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
  return (
    <Image
      src={url}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
