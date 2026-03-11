import { ImageResponse } from "next/og";

export const runtime = "edge";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          color: "white",
          fontSize: 28,
          fontWeight: 800,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          letterSpacing: "-1px",
        }}
      >
        AI
      </div>
    ),
    { width: 64, height: 64 }
  );
}

