import { NextResponse } from "next/server";
import crypto from "node:crypto";

function isValidEmail(email: string): boolean {
  if (!email) return false;
  if (email.length > 254) return false;
  // Pragmatic validation (enough for newsletter signup)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: Request): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") || "unknown";
}

function signPayload(secret: string, payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;
  if (typeof email !== "string" || !isValidEmail(email.trim().toLowerCase())) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.SUBSCRIBE_WEBHOOK_SECRET?.trim();
  const clientIp = getClientIp(req);

  // In dev: allow "no-backend" mode so local testing works.
  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[subscribe] DEV mode (no webhook):", { email: normalized, clientIp });
      return NextResponse.json({ ok: true, mode: "dev_no_webhook" });
    }
    return NextResponse.json(
      { ok: false, error: "SUBSCRIBE_NOT_CONFIGURED" },
      { status: 501 }
    );
  }

  const payload = {
    email: normalized,
    source: "ai_tool_web",
    created_at: new Date().toISOString(),
    ip: clientIp,
    user_agent: req.headers.get("user-agent") ?? "",
  };

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-subscribe-source": "ai_tool_web",
  };
  if (webhookSecret) {
    headers["x-subscribe-signature"] = signPayload(webhookSecret, JSON.stringify(payload));
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "WEBHOOK_FAILED" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

