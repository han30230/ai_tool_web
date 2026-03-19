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
        subId?: string | null;
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

    const looksLikeCoupangIframe = (node: unknown): node is HTMLIFrameElement => {
      if (!(node instanceof HTMLIFrameElement)) return false;
      const src = node.getAttribute("src") ?? "";
      return src.includes("coupang") || src.includes("ads-partners.coupang.com");
    };

    const mountIframe = (iframe: HTMLIFrameElement) => {
      iframe.setAttribute("width", String(width));
      iframe.setAttribute("height", String(height));
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.display = "block";
      el.innerHTML = "";
      el.appendChild(iframe);
      return true;
    };

    const findCoupangIframeIn = (root: ParentNode) => {
      const iframes = Array.from(root.querySelectorAll("iframe"));
      return iframes.find((f) => looksLikeCoupangIframe(f));
    };

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

        if (!window.PartnersCoupang?.G) {
          setFailed(true);
          return;
        }

        // Coupang often injects the iframe at the end of <body> (not inside our container).
        // Observe the whole document and move the newly injected Coupang iframe into our container.
        const before = new Set(Array.from(document.querySelectorAll("iframe")));

        const obs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const n of Array.from(m.addedNodes)) {
              if (cancelled) return;
              if (looksLikeCoupangIframe(n)) {
                mountIframe(n);
                setFailed(false);
                obs.disconnect();
                return;
              }
              if (n instanceof HTMLElement) {
                const found = findCoupangIframeIn(n);
                if (found) {
                  mountIframe(found);
                  setFailed(false);
                  obs.disconnect();
                  return;
                }
              }
            }
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });

        // Insert inline script inside the container, so Coupang's widget renders at this location.
        const inline = document.createElement("script");
        inline.type = "text/javascript";
        inline.text = `new PartnersCoupang.G({"id":${widgetId},"template":"${template}","trackingCode":"${trackingCode}","width":"${width}","height":"${height}","tsource":"${tsource}"});`;
        el.appendChild(inline);

        // Give it a moment; if nothing was inserted, treat as failure.
        const timeout = window.setTimeout(() => {
          if (cancelled) return;
          const now = Array.from(document.querySelectorAll("iframe"));
          const fresh = now.filter((f) => !before.has(f));
          const candidate =
            fresh.find((f) => looksLikeCoupangIframe(f)) ??
            now.find((f) => looksLikeCoupangIframe(f));

          if (candidate) {
            mountIframe(candidate);
            setFailed(false);
          } else {
            setFailed(true);
          }
          obs.disconnect();
        }, 2500);

        return () => {
          window.clearTimeout(timeout);
          obs.disconnect();
        };
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    let cleanup: (() => void) | undefined;
    void initWidget().then((c) => {
      cleanup = c;
    });
    return () => {
      cancelled = true;
      cleanup?.();
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
          style={{
            minWidth: width,
            minHeight: height,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        />
      )}
      {failed && !fallback ? (
        <div
          className="flex items-center justify-center text-xs text-slate-500"
          style={{ width: "100%", height: "100%", minWidth: width, minHeight: height }}
        >
          Coupang widget failed to load
        </div>
      ) : null}
    </>
  );
}

