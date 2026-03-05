import type { CategoryInfo } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  { slug: "chatbot-llm", name: "챗봇 / LLM", nameEn: "Chatbot / LLM", description: "대화형 AI, LLM 기반 챗봇 및 어시스턴트" },
  { slug: "image-generation", name: "이미지 생성", nameEn: "Image Generation", description: "AI 이미지 생성 및 편집 도구" },
  { slug: "video-generation", name: "영상 생성", nameEn: "Video Generation", description: "AI 영상 제작 및 편집" },
  { slug: "audio-voice", name: "오디오 / 음성", nameEn: "Audio / Voice", description: "음성 합성, 음성 인식, 오디오 생성" },
  { slug: "writing", name: "글쓰기", nameEn: "Writing", description: "카피라이팅, 글쓰기 보조, 콘텐츠 생성" },
  { slug: "productivity", name: "생산성", nameEn: "Productivity", description: "업무 효율화, 메모, 작업 관리 AI" },
  { slug: "coding", name: "코딩 / 개발", nameEn: "Coding / Developer Tools", description: "코드 생성, 자동완성, 개발 도구" },
  { slug: "design", name: "디자인", nameEn: "Design", description: "UI/UX, 그래픽, 디자인 자동화" },
  { slug: "marketing", name: "마케팅", nameEn: "Marketing", description: "광고, 캠페인, 마케팅 자동화" },
  { slug: "seo", name: "SEO", nameEn: "SEO", description: "검색 엔진 최적화, 키워드, 백링크" },
  { slug: "data-analytics", name: "데이터 / 분석", nameEn: "Data / Analytics", description: "데이터 분석, 시각화, 인사이트" },
  { slug: "research", name: "리서치", nameEn: "Research", description: "문서 분석, 논문, 조사 보조" },
  { slug: "education", name: "교육", nameEn: "Education", description: "학습, 튜터링, 퀴즈 생성" },
  { slug: "automation", name: "자동화", nameEn: "Automation", description: "워크플로우, RPA, 업무 자동화" },
  { slug: "no-code", name: "노코드", nameEn: "No-Code", description: "노코드/로우코드 앱 빌더" },
  { slug: "3d-gaming", name: "3D / 게이밍", nameEn: "3D / Gaming", description: "3D 에셋, 게임 개발, 메타버스" },
  { slug: "business", name: "비즈니스", nameEn: "Business", description: "CRM, 영업, 경영 지원" },
  { slug: "translation", name: "번역", nameEn: "Translation", description: "다국어 번역, 로컬라이제이션" },
  { slug: "presentation", name: "프레젠테이션", nameEn: "Presentation", description: "슬라이드, 피치덱, 발표 자료" },
  { slug: "social-media", name: "소셜 미디어", nameEn: "Social Media", description: "SNS 콘텐츠, 스케줄링, 분석" },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
