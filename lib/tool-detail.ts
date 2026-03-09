import type { Tool } from "./types";

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  "chatbot-llm": ["문서 요약", "다국어 번역", "코딩 보조", "브레인스토밍", "질의응답", "초안 작성", "대화형 인터페이스", "컨텍스트 이해"],
  "image-generation": ["텍스트→이미지 생성", "스타일 조정", "해상도 업스케일", "이미지 편집", "배치 생성", "프롬프트 가이드", "상업적 이용", "API 연동"],
  "video-generation": ["텍스트/이미지→영상", "자동 자막", "영상 편집", "템플릿 라이브러리", "음성 오버", "해상도 옵션", "소셜 포맷 출력", "협업 기능"],
  "audio-voice": ["TTS 음성 합성", "음성 클론", "다국어 지원", "감정/톤 조절", "STT 음성 인식", "오디오 편집", "API 제공", "배치 처리"],
  writing: ["카피 작성", "문법·톤 교정", "요약·확장", "다국어 작성", "SEO 최적화", "템플릿 활용", "브랜드 음성 유지", "협업·버전 관리"],
  productivity: ["메모·노트 정리", "할 일 관리", "회의 요약", "일정 연동", "검색·태그", "템플릿", "알림·리마인더", "팀 공유"],
  coding: ["코드 자동완성", "코드 생성", "리팩터링 제안", "버그 탐지", "문서화 생성", "다국어 지원", "IDE 연동", "API 문서 검색"],
  design: ["UI 컴포넌트 생성", "로고·아이콘", "색상·타이포 추천", "반응형 레이아웃", "디자인 시스템", "프로토타입", "협업·피드백", "에셋 내보내기"],
  marketing: ["광고 카피", "캠페인 아이디어", "타겟 분석", "A/B 테스트 문구", "소셜 포스트", "이메일 제목", "랜딩페이지 카피", "성과 예측"],
  seo: ["키워드 리서치", "메타 태그 제안", "내용 최적화", "경쟁 분석", "백링크 아이디어", "로컬 SEO", "보고서 생성", "순위 추적"],
  "data-analytics": ["데이터 시각화", "자연어 질의", "예측·트렌드", "대시보드", "자동 인사이트", "보고서 생성", "연동·ETL", "알림·임계값"],
  research: ["논문 검색·요약", "인용 분석", "관련 연구 매핑", "팩트 체크", "출처 정리", "메타 분석 보조", "용어 정의", "타임라인 정리"],
  education: ["개념 설명", "퀴즈 생성", "학습 경로 추천", "요약·플래시카드", "다국어 학습", "적응형 난이도", "진도 추적", "과제 피드백"],
  automation: ["워크플로우 설계", "앱 간 연동", "트리거·스케줄", "조건 분기", "데이터 변환", "알림·알림", "로그·모니터링", "템플릿 라이브러리"],
  "no-code": ["드래그 앤 드롭 빌더", "DB·폼 연동", "인증·권한", "배포·호스팅", "템플릿", "API 연동", "반응형", "버전 관리"],
  "3d-gaming": ["3D 모델 생성", "텍스처·머티리얼", "애니메이션", "씬 구성", "에셋 최적화", "게임 엔진 연동", "VR/AR 지원", "협업"],
  business: ["영업 대화 분석", "리드 스코어링", "예측·파이프라인", "CRM 연동", "리포트 자동화", "이메일 추천", "미팅 요약", "KPI 대시보드"],
  translation: ["다국어 번역", "문맥 반영", "용어집", "로컬라이제이션", "배치 번역", "API", "품질 검수 보조", "포맷 유지"],
  presentation: ["슬라이드 자동 생성", "템플릿 추천", "차트·다이어그램", "일관된 디자인", "발표 노트", "협업·코멘트", "내보내기", "애니메이션"],
  "social-media": ["포스트 작성", "해시태그 제안", "스케줄링", "캘린더 뷰", "분석·인사이트", "멀티 채널", "이미지 제안", "A/B 테스트"],
};

const USE_CASES_BY_ROLE: Record<string, string[]> = {
  마케터: ["광고 카피 작성", "캠페인 기획", "소셜 콘텐츠 제작", "랜딩페이지 최적화", "이메일 마케팅", "경쟁사 분석"],
  개발자: ["코드 생성·보조", "문서화", "리팩터링", "버그 해결", "API 연동", "테스트 케이스"],
  디자이너: ["이미지·아이콘 제작", "UI 목업", "색상·타이포", "프레젠테이션", "에셋 정리", "피드백 반영"],
  학생: ["과제·에세이 보조", "개념 정리", "퀴즈 연습", "번역·요약", "발표 자료", "공부 계획"],
  창업자: ["비즈니스 아이디어", "피치덱", "마케팅 초기 세팅", "고객 메시지", "자동화 설계", "리서치"],
  일반: ["일상 질의응답", "문서 요약", "이메일 작성", "일정 정리", "번역", "아이디어 정리"],
};

function getCategoryFeatures(category: string): string[] {
  const raw = FEATURES_BY_CATEGORY[category];
  if (Array.isArray(raw)) return raw as string[];
  return [
    "AI 기반 자동화",
    "직관적인 인터페이스",
    "다양한 템플릿",
    "협업 기능",
    "API·연동",
    "보고서·분석",
    "맞춤 설정",
    "지속 업데이트",
  ];
}

export function getFeatures(tool: Tool): string[] {
  if (tool.features && tool.features.length >= 5) return tool.features;
  const fromCat = getCategoryFeatures(tool.category);
  const fromTags = tool.tags.slice(0, 3).map((t) => `${t} 지원`);
  return [...fromCat.slice(0, 6), ...fromTags].slice(0, 8);
}

export function getUseCases(tool: Tool): string[] {
  if (tool.use_cases && tool.use_cases.length >= 4) return tool.use_cases;
  const roleKeys = ["마케터", "개발자", "디자이너", "학생", "창업자", "일반"];
  const out: string[] = [];
  roleKeys.forEach((role) => {
    const cases = USE_CASES_BY_ROLE[role];
    if (cases) out.push(...cases.slice(0, 2).map((c) => `[${role}] ${c}`));
  });
  return Array.from(new Set(out)).slice(0, 6);
}

const PROS_TEMPLATES = [
  "사용이 쉽고 학습 곡선이 낮음",
  "다양한 용도로 활용 가능",
  "정기적인 업데이트와 신기능",
  "한국어 지원으로 접근성 좋음",
  "무료 플랜 또는 체험 제공",
  "API·연동 옵션 제공",
];

const CONS_TEMPLATES = [
  "유료 플랜이 비쌀 수 있음",
  "고급 기능은 제한적일 수 있음",
  "인터넷 연결 필요",
  "특정 언어·지역 제한 가능",
];

export function getPros(tool: Tool): string[] {
  if (tool.pros && tool.pros.length >= 3) return tool.pros;
  const list = [...PROS_TEMPLATES];
  if (tool.korean_support) list.unshift("한국어를 공식 지원");
  if (tool.pricing === "무료" || tool.pricing === "무료+유료") list.unshift("무료로 시작 가능");
  return list.slice(0, 5);
}

export function getCons(tool: Tool): string[] {
  if (tool.cons && tool.cons.length >= 2) return tool.cons;
  return CONS_TEMPLATES.slice(0, 4);
}

export function getShortDescription(tool: Tool): string {
  if (tool.short_description) return tool.short_description;
  return tool.description.length > 80 ? tool.description.slice(0, 77) + "…" : tool.description;
}

const PLACEHOLDER_SCREENSHOTS = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1686191128892-cf7f8e7e8b2e?w=800&q=80",
  "https://images.unsplash.com/photo-1676299085922-6cbedae6b698?w=800&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
];

/** Thum.io website screenshot URL (priority 2 when tool.screenshots empty) */
export function getThumIoPreviewUrl(websiteUrl: string, width = 1200): string {
  if (!websiteUrl?.trim()) return PLACEHOLDER_SCREENSHOTS[0];
  try {
    return `https://image.thum.io/get/width/${width}/${encodeURIComponent(websiteUrl)}`;
  } catch {
    return PLACEHOLDER_SCREENSHOTS[0];
  }
}

/**
 * Screenshot URL list: 1) tool.screenshots 2) Thum.io preview 3) placeholders.
 * Always returns 2–4 URLs for gallery (main + thumbnails).
 */
export function getScreenshots(tool: Tool): string[] {
  const valid = (tool.screenshots || []).filter((u) => u && u.startsWith("http"));
  if (valid.length >= 2) return valid.slice(0, 4);
  const thum = getThumIoPreviewUrl(tool.website_url || "");
  return [thum, ...PLACEHOLDER_SCREENSHOTS].slice(0, 4);
}

/** First screenshot URL for OG image (or placeholder) */
export function getFirstScreenshotOrPlaceholder(tool: Tool): string {
  const list = getScreenshots(tool);
  return list[0] || PLACEHOLDER_SCREENSHOTS[0];
}

export function getLastUpdatedAt(tool: Tool): string {
  if (tool.last_updated_at) return tool.last_updated_at;
  return new Date().toISOString().slice(0, 10);
}

export function getPricingPlans(tool: Tool): { name: string; price: string; desc?: string }[] {
  return tool.pricing_plans && tool.pricing_plans.length > 0 ? tool.pricing_plans : [];
}
