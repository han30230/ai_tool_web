"use client";

import Script from "next/script";
import { useEffect, useMemo } from "react";

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
  const containerId = useMemo(
    () => `coupang-widget-${widgetId}-${template}-${width}x${height}-${Math.random().toString(36).slice(2)}`,
    [widgetId, template, width, height],
  );

  useEffect(() => {
    if (!window.PartnersCoupang?.G) return;

    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = "";
    // The Coupang widget script writes into the DOM (typically relative to the current document).
    // We create a dedicated container element and then instantiate the widget.
    new window.PartnersCoupang.G({
      id: widgetId,
      template,
      trackingCode,
      width: String(width),
      height: String(height),
      tsource,
    });
  }, [containerId, height, template, trackingCode, tsource, widgetId, width]);

  return (
    <>
      <Script src="https://ads-partners.coupang.com/g.js" strategy="afterInteractive" />
      <div id={containerId} />
    </>
  );
}

