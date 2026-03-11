"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import type { Tool } from "@/lib/types";
import { getLogoUrlCandidates } from "@/lib/tools";
import { FallbackAIIcon } from "@/components/FallbackAIIcon";

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

/** Tiny gray placeholder so layout is stable and blur shows while image loads */
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmMWY1ZjkiLz48L3N2Zz4=";

interface ToolLogoProps {
  tool: Tool;
  size?: number;
  className?: string;
  /** Set for above-the-fold logos (e.g. first row) so they load immediately */
  priority?: boolean;
}

/**
 * Tool logo with 3-tier fallback: DB logo_url → Clearbit → Google favicon → Fallback AI icon.
 * Card: 40px, Detail: 80px. rounded-md, bg-muted, object-contain.
 */
export function ToolLogo({ tool, size = 40, className = "", priority = false }: ToolLogoProps) {
  const candidates = getLogoUrlCandidates(tool);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const currentUrl = candidates[currentIndex];
  const showFallback = !currentUrl || allFailed;

  const handleError = useCallback(() => {
    const url = candidates[currentIndex];
    if (isDev) {
      console.warn(
        `[ToolLogo] Failed to load: tool="${tool.name}" url=${url ?? "(empty)"} candidateIndex=${currentIndex}`
      );
    }
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (isDev) {
        console.warn(`[ToolLogo] All candidates failed for "${tool.name}", using fallback icon.`);
      }
      setAllFailed(true);
    }
  }, [tool.name, currentIndex, candidates]);

  const handleLoad = useCallback(() => {
    if (isDev && currentUrl) {
      console.info(`[ToolLogo] Loaded: "${tool.name}" (candidate ${currentIndex}): ${currentUrl}`);
    }
  }, [tool.name, currentIndex, currentUrl]);

  if (showFallback) {
    return <FallbackAIIcon size={size} className={className} />;
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md bg-slate-100 ${className || ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={currentUrl}
        alt=""
        width={size}
        height={size}
        className="object-contain p-1"
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onError={handleError}
        onLoad={handleLoad}
        sizes={`${size}px`}
      />
    </div>
  );
}
