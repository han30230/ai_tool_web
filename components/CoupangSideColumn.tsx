"use client";

import { useEffect, useRef, useState } from "react";

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

const SLOT_COUNT = 1;
const COLUMN_WIDTH = 120;

/** Single widget 973369 only. */
const SLOT_CONFIG = [{ id: 973369, width: COLUMN_WIDTH, height: 600 }];

function looksLikeCoupangIframe(node: unknown): node is HTMLIFrameElement {
  if (!(node instanceof HTMLIFrameElement)) return false;
  const src = node.getAttribute("src") ?? "";
  return src.includes("coupang") || src.includes("ads-partners.coupang.com");
}

function waitForNewCoupangIframe(
  before: Set<HTMLIFrameElement>,
  timeoutMs = 3500
): Promise<HTMLIFrameElement | null> {
  return new Promise((resolve) => {
    const obs = new MutationObserver(() => {
      const now = Array.from(document.querySelectorAll("iframe"));
      const added = now.find((f) => !before.has(f) && looksLikeCoupangIframe(f));
      if (added) {
        obs.disconnect();
        resolve(added);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => {
      obs.disconnect();
      const now = Array.from(document.querySelectorAll("iframe"));
      const added = now.find((f) => !before.has(f) && looksLikeCoupangIframe(f)) ?? null;
      resolve(added);
    }, timeoutMs);
  });
}

async function ensureGjs(): Promise<void> {
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
}

type SideColumnProps = {
  side: "left" | "right";
  widgetId: number;
  trackingCode: string;
  template: string;
  tsource?: string;
};

export function CoupangSideColumn({
  side,
  widgetId,
  trackingCode,
  template,
  tsource = "",
}: SideColumnProps) {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  const slotConfigs = SLOT_CONFIG;

  useEffect(() => {
    const slots = slotRefs.current;
    if (!slots[0]) return;

    let cancelled = false;
    setFailed(false);

    (async () => {
      try {
        await ensureGjs();
        if (cancelled) return;
        if (!window.PartnersCoupang?.G) {
          setFailed(true);
          return;
        }

        for (let i = 0; i < SLOT_COUNT; i++) {
          if (cancelled) return;
          const slotEl = slots[i];
          const config = slotConfigs[i];
          if (!slotEl || !config) continue;

          const before = new Set(
            Array.from(document.querySelectorAll("iframe")) as HTMLIFrameElement[]
          );

          const inline = document.createElement("script");
          inline.type = "text/javascript";
          inline.text = `new PartnersCoupang.G({"id":${config.id},"trackingCode":"${trackingCode}","subId":null,"template":"${template}","width":"${config.width}","height":"${config.height}"});`;
          document.body.appendChild(inline);
          document.body.removeChild(inline);

          const iframe = await waitForNewCoupangIframe(before);
          if (cancelled) return;
          if (iframe && slotEl) {
            iframe.setAttribute("width", String(config.width));
            iframe.setAttribute("height", String(config.height));
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.display = "block";
            slotEl.innerHTML = "";
            slotEl.appendChild(iframe);
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [side, template, trackingCode, tsource]);

  if (failed) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2">
        {slotConfigs.map((config, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded bg-slate-100 text-xs text-slate-500"
            style={{ width: config.width, height: config.height }}
          >
            Coupang widget
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {slotConfigs.map((config, i) => (
        <div
          key={i}
          ref={(el) => {
            slotRefs.current[i] = el;
          }}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          style={{
            width: config.width,
            height: config.height,
          }}
        />
      ))}
    </div>
  );
}
