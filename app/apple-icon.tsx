import { ImageResponse } from "next/og";

export const runtime = "edge";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          color: "white",
          fontSize: 76,
          fontWeight: 900,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          letterSpacing: "-2px",
        }}
      >
        AI
      </div>
    ),
    { width: 180, height: 180 }
  );
}

