"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (opts: {
        id: number;
        template: string;
        trackingCode: string;
        width: string;
        height: string;
        tsource?: string;
      }) => unknown;
    };
  }
}

type Props = {
  widgetId: number;
  trackingCode: string;
  template: string;
  width: number;
  height: number;
  tsource?: string;
  fallback?: ReactNode;
};

export function CoupangPartnersWidget({
  widgetId,
  trackingCode,
  template,
  width,
  height,
  tsource = "",
  fallback,
}: Props) {
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const containerId = useMemo(
    () => `coupang-widget-${widgetId}-${template}-${width}x${height}-${Math.random().toString(36).slice(2)}`,
    [widgetId, template, width, height],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    setFailed(false);
    el.innerHTML = "";

    const ensureGjs = async () => {
      // Load g.js once globally (like the Tistory copy-paste).
      const existing = document.getElementById("coupang-gjs") as HTMLScriptElement | null;
      if (existing) {
        if ((existing as any)._loaded) return;
        await new Promise<void>((resolve, reject) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("g.js load failed")), {
            once: true,
          });
        });
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.id = "coupang-gjs";
        s.src = "https://ads-partners.coupang.com/g.js";
        s.async = true;
        s.onload = () => {
          (s as any)._loaded = true;
          resolve();
        };
        s.onerror = () => reject(new Error("g.js load failed"));
        document.head.appendChild(s);
      });
    };

    const initWidget = async () => {
      try {
        await ensureGjs();
        if (cancelled) return;

        // Insert inline script inside the container, so Coupang's widget renders at this location
        // (mirrors the working "copy-paste" pattern).
        const inline = document.createElement("script");
        inline.type = "text/javascript";
        inline.text = `new PartnersCoupang.G({"id":${widgetId},"template":"${template}","trackingCode":"${trackingCode}","width":"${width}","height":"${height}","tsource":"${tsource}"});`;
        el.appendChild(inline);

        // Give it a moment; if nothing was inserted, treat as failure.
        window.setTimeout(() => {
          if (cancelled) return;
          const hasIframe = el.querySelector("iframe");
          if (!hasIframe) setFailed(true);
        }, 800);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void initWidget();
    return () => {
      cancelled = true;
    };
  }, [height, template, trackingCode, tsource, widgetId, width]);

  return (
    <>
      {failed && fallback ? (
        <>{fallback}</>
      ) : (
        <div
          id={containerId}
          ref={containerRef}
          suppressHydrationWarning
          style={{ minWidth: width, minHeight: height }}
        />
      )}
    </>
  );
}

