import { ImageResponse } from "next/og";
import { SITE_NAME, getBaseUrl } from "@/lib/site";

export const runtime = "edge";

function safeText(v: string | null, fallback = ""): string {
  if (!v) return fallback;
  return v.toString().replace(/\s+/g, " ").trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = safeText(searchParams.get("kind"), "page"); // page|tool|article|category
  const title = safeText(searchParams.get("title"), SITE_NAME).slice(0, 80);
  const subtitle = safeText(searchParams.get("subtitle"), "").slice(0, 120);
  const badge = safeText(searchParams.get("badge"), "").slice(0, 30);
  const baseUrl = getBaseUrl();

  const bg = kind === "tool"
    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0b4a6f 100%)"
    : kind === "article"
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #3b0764 100%)"
      : "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #064e3b 100%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: bg,
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 920 }}>
            {badge ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  fontSize: 22,
                  letterSpacing: "-0.2px",
                }}
              >
                {badge}
              </div>
            ) : null}
            <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.2px" }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ fontSize: 28, opacity: 0.9, lineHeight: 1.35 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.95 }}>{SITE_NAME}</div>
            <div style={{ fontSize: 22, opacity: 0.7 }}>{baseUrl.replace(/^https?:\/\//, "")}</div>
          </div>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 40,
              background: "rgba(255,255,255,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: "-2px" }}>AI</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

