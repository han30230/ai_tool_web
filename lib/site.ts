/** Base URL for canonical, sitemap, og:image. Set NEXT_PUBLIC_SITE_URL in production. */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  /**
   * Vercel provides `VERCEL_URL` (e.g. "altobox.site" or "my-app.vercel.app").
   * Use it as a safe fallback so OG/canonical use the deployed domain even when
   * NEXT_PUBLIC_SITE_URL is not explicitly set.
   */
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    const raw = process.env.VERCEL_URL.replace(/\/$/, "");
    const withProtocol = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
    return withProtocol;
  }
  return "https://ai-tool-allinone.vercel.app";
}

export const SITE_NAME = "AI 툴 올인원";
export const SITE_DESCRIPTION =
  "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.";
export const SITE_TITLE_DEFAULT = "AI 툴 올인원 | AI 서비스 모음";

/** 문의 이메일 (문의 페이지, footer, mailto 등) */
export const CONTACT_EMAIL = "han30230@gmail.com";
