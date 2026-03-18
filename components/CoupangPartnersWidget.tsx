"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const containerId = useMemo(
    () => `coupang-widget-${widgetId}-${template}-${width}x${height}-${Math.random().toString(36).slice(2)}`,
    [widgetId, template, width, height],
  );

  useEffect(() => {
    if (!ready) return;
    if (!window.PartnersCoupang?.G) return;

    const el = document.getElementById(containerId);
    if (!el) return;

    setFailed(false);
    el.innerHTML = "";

    const before = new Set(Array.from(document.querySelectorAll("iframe")));

    try {
      new window.PartnersCoupang.G({
      id: widgetId,
      template,
      trackingCode,
      width: String(width),
      height: String(height),
      tsource,
      });
    } catch {
      setFailed(true);
      return;
    }

    const attach = (iframe: HTMLIFrameElement) => {
      el.innerHTML = "";
      el.appendChild(iframe);
      return true;
    };

    const findCandidate = () => {
      const iframes = Array.from(document.querySelectorAll("iframe"));
      const fresh = iframes.filter((n) => !before.has(n));

      const pickBySize = (arr: HTMLIFrameElement[]) =>
        arr.find((f) => {
          const w = Number(f.getAttribute("width") ?? f.style.width?.replace("px", ""));
          const h = Number(f.getAttribute("height") ?? f.style.height?.replace("px", ""));
          return (w === width || !Number.isFinite(w)) && (h === height || !Number.isFinite(h));
        });

      return (
        pickBySize(fresh as HTMLIFrameElement[]) ??
        (fresh[fresh.length - 1] as HTMLIFrameElement | undefined) ??
        (iframes[iframes.length - 1] as HTMLIFrameElement | undefined)
      );
    };

    // First quick attempt.
    const immediate = findCandidate();
    if (immediate) attach(immediate);

    // Robust: observe DOM mutations for up to 2 seconds.
    const startedAt = Date.now();
    const obs = new MutationObserver(() => {
      const cand = findCandidate();
      if (cand && attach(cand)) obs.disconnect();
      if (Date.now() - startedAt > 2000) {
        obs.disconnect();
        if (!el.querySelector("iframe")) setFailed(true);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => {
      obs.disconnect();
      if (!el.querySelector("iframe")) setFailed(true);
    }, 2200);

    return () => {
      obs.disconnect();
      window.clearTimeout(timeout);
    };
  }, [containerId, height, ready, template, trackingCode, tsource, widgetId, width]);

  return (
    <>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      {failed && fallback ? (
        <>{fallback}</>
      ) : (
        <div id={containerId} suppressHydrationWarning />
      )}
    </>
  );
}

