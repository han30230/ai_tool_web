"use client";

import Script from "next/script";
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
};

export function CoupangPartnersWidget({
  widgetId,
  trackingCode,
  template,
  width,
  height,
  tsource = "",
}: Props) {
  const [ready, setReady] = useState(false);

  const containerId = useMemo(
    () => `coupang-widget-${widgetId}-${template}-${width}x${height}-${Math.random().toString(36).slice(2)}`,
    [widgetId, template, width, height],
  );

  useEffect(() => {
    if (!ready) return;
    if (!window.PartnersCoupang?.G) return;

    const el = document.getElementById(containerId);
    if (!el) return;

    // Coupang's script often injects an iframe without a container hook.
    // We capture newly-added iframe(s) and move the newest one into our container.
    const before = new Set(
      Array.from(document.querySelectorAll("iframe")).map((n) => n),
    );

    el.innerHTML = "";

    new window.PartnersCoupang.G({
      id: widgetId,
      template,
      trackingCode,
      width: String(width),
      height: String(height),
      tsource,
    });

    const moveInjectedIframe = () => {
      const iframes = Array.from(document.querySelectorAll("iframe"));
      const fresh = iframes.filter((n) => !before.has(n));
      const candidate = fresh[fresh.length - 1] ?? iframes[iframes.length - 1];
      if (candidate && candidate instanceof HTMLIFrameElement) {
        el.innerHTML = "";
        el.appendChild(candidate);
      }
    };

    // Try a few times in case injection is async.
    const t1 = window.setTimeout(moveInjectedIframe, 0);
    const t2 = window.setTimeout(moveInjectedIframe, 50);
    const t3 = window.setTimeout(moveInjectedIframe, 250);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [containerId, height, ready, template, trackingCode, tsource, widgetId, width]);

  return (
    <>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div id={containerId} suppressHydrationWarning />
    </>
  );
}

