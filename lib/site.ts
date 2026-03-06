/** Base URL for canonical, sitemap, og:image. Set NEXT_PUBLIC_SITE_URL in production. */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://ai-tool-allinone.vercel.app";
}

export const SITE_NAME = "AI 툴 올인원";
export const SITE_DESCRIPTION =
  "모든 AI 툴을 한 곳에서. 실제 서비스 중인 AI를 카테고리·가격·기능으로 비교하고 업무에 맞는 AI 도구를 발견하세요.";

/** 문의 이메일 (문의 페이지, footer, mailto 등) */
export const CONTACT_EMAIL = "han30230@gmail.com";
