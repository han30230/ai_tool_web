"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80";

export function ArticleCardImage({
  src,
  alt = "",
  fill,
  className,
  sizes,
}: {
  src: string;
  alt?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = failed || !src ? FALLBACK_IMAGE : src;
  return (
    <Image
      src={url}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
