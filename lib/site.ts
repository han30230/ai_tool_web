/** Base URL for canonical, sitemap, og:image. Set NEXT_PUBLIC_SITE_URL in production. */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://ai-tool-allinone.vercel.app";
}

export const SITE_NAME = "AI 툴 올인원";
export const SITE_DESCRIPTION =
  "500개 이상의 AI 도구를 카테고리, 가격, 기능별로 비교하고 나에게 맞는 AI 툴을 빠르게 찾아보세요.";
export const SITE_TITLE_DEFAULT = "AI 툴 올인원 | AI 서비스 모음";

/** 문의 이메일 (문의 페이지, footer, mailto 등) */
export const CONTACT_EMAIL = "han30230@gmail.com";
