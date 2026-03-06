export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  published_at: string;
  summary: string;
  image?: string;
  category?: string;
}

/** 뉴스 카테고리 (필터용) */
export const NEWS_CATEGORIES = [
  { slug: "openai", name: "OpenAI" },
  { slug: "google-ai", name: "Google AI" },
  { slug: "anthropic", name: "Anthropic" },
  { slug: "meta-ai", name: "Meta AI" },
  { slug: "hugging-face", name: "Hugging Face" },
  { slug: "startup", name: "AI 스타트업" },
  { slug: "investment", name: "AI 투자" },
  { slug: "tech", name: "AI 기술 업데이트" },
  { slug: "policy", name: "AI 정책" },
] as const;

/** 한국어 중심 뉴스 목록 (제목·요약 모두 한국어) */
const KOREAN_NEWS: NewsItem[] = [
  { id: "k1", title: "OpenAI, 새로운 GPT 모델 공개", source: "OpenAI", url: "https://openai.com/blog", published_at: new Date().toISOString().slice(0, 10), summary: "OpenAI가 새로운 GPT 모델을 발표했습니다. 이번 모델은 더 빠른 응답 속도와 향상된 추론 능력을 제공하며, 멀티모달 입력을 지원합니다.", category: "openai" },
  { id: "k2", title: "Google Gemini, 멀티모달 기능 대폭 확대", source: "Google AI", url: "https://blog.google/technology/ai", published_at: new Date(Date.now() - 86400000).toISOString().slice(0, 10), summary: "Google이 Gemini의 이미지·음성·비디오 처리 능력을 확장했습니다. Gmail·Docs·검색과의 연동도 강화되어 업무 활용도가 높아졌습니다.", category: "google-ai" },
  { id: "k3", title: "Anthropic Claude, 장문 컨텍스트 지원 강화", source: "Anthropic", url: "https://www.anthropic.com/news", published_at: new Date(Date.now() - 172800000).toISOString().slice(0, 10), summary: "Claude의 긴 문서 처리 능력이 개선되었습니다. 수십 페이지 분량의 보고서 요약과 정확한 질의응답이 가능해졌습니다.", category: "anthropic" },
  { id: "k4", title: "Meta, 오픈소스 LLM 라마 3 공개", source: "Meta AI", url: "https://ai.meta.com", published_at: new Date(Date.now() - 259200000).toISOString().slice(0, 10), summary: "Meta가 라마 3 모델을 오픈소스로 공개했습니다. 개발자와 기업이 자체 서비스에 활용할 수 있도록 라이선스를 완화했습니다.", category: "meta-ai" },
  { id: "k5", title: "Hugging Face, AI 모델 허브 기능 확장", source: "Hugging Face", url: "https://huggingface.co", published_at: new Date(Date.now() - 345600000).toISOString().slice(0, 10), summary: "Hugging Face가 모델 호스팅과 배포 도구를 확장했습니다. 소규모 팀도 쉽게 AI 모델을 배포하고 공유할 수 있습니다.", category: "hugging-face" },
  { id: "k6", title: "국내 AI 스타트업 투자 활발", source: "AI 스타트업", url: "https://techcrunch.com", published_at: new Date(Date.now() - 432000000).toISOString().slice(0, 10), summary: "국내 AI 스타트업에 대한 투자가 이어지고 있습니다. 챗봇·이미지 생성·엔터프라이즈 솔루션 분야에서 유니콘 기업이 늘고 있습니다.", category: "startup" },
  { id: "k7", title: "글로벌 AI 투자 규모 연간 10조 원 돌파", source: "AI 투자", url: "https://venturebeat.com", published_at: new Date(Date.now() - 518400000).toISOString().slice(0, 10), summary: "전 세계 AI 관련 투자 규모가 사상 최대를 기록했습니다. 인프라·LLM·응용 서비스 모두에서 자금이 유입되고 있습니다.", category: "investment" },
  { id: "k8", title: "AI 반도체 기술, 연산 효율 2배 개선", source: "AI 기술 업데이트", url: "https://www.theverge.com", published_at: new Date(Date.now() - 604800000).toISOString().slice(0, 10), summary: "AI 전용 칩의 연산 효율이 크게 개선되었습니다. 동일 전력으로 더 큰 모델을 학습·추론할 수 있게 되었습니다.", category: "tech" },
  { id: "k9", title: "EU AI법 시행, 고위험 AI 규제 시작", source: "AI 정책", url: "https://www.theverge.com", published_at: new Date(Date.now() - 691200000).toISOString().slice(0, 10), summary: "유럽연합 AI법이 단계적으로 시행됩니다. 고위험 AI 시스템에 대한 설명의무와 품질 요건이 적용됩니다.", category: "policy" },
  { id: "k10", title: "OpenAI API, 가격 인하 및 속도 개선", source: "OpenAI", url: "https://openai.com/blog", published_at: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10), summary: "OpenAI가 API 요금을 인하하고 응답 속도를 개선했습니다. 개발자와 기업의 도입 비용이 줄어들 전망입니다.", category: "openai" },
  { id: "k11", title: "Google, 검색에 AI 요약 통합 확대", source: "Google AI", url: "https://blog.google/technology/ai", published_at: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10), summary: "Google 검색 결과에 AI 요약이 점점 더 많이 노출됩니다. 사용자가 링크를 열지 않고도 핵심 답을 얻을 수 있게 됩니다.", category: "google-ai" },
  { id: "k12", title: "Anthropic, 기업용 Claude 플랜 출시", source: "Anthropic", url: "https://www.anthropic.com/news", published_at: new Date(Date.now() - 86400000 * 6).toISOString().slice(0, 10), summary: "Anthropic이 기업 전용 Claude 플랜을 출시했습니다. 데이터 보안과 SLA가 보장되어 업무 활용이 확대될 전망입니다.", category: "anthropic" },
  { id: "k13", title: "Meta, 메타버스와 AI 결합 전략 발표", source: "Meta AI", url: "https://ai.meta.com", published_at: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10), summary: "Meta가 메타버스 경험에 AI 어시스턴트를 통합하는 계획을 공개했습니다. 가상 공간 내 자연어 상호작용이 가능해집니다.", category: "meta-ai" },
  { id: "k14", title: "Hugging Face, 한국어 모델 지원 강화", source: "Hugging Face", url: "https://huggingface.co", published_at: new Date(Date.now() - 86400000 * 8).toISOString().slice(0, 10), summary: "Hugging Face 허브에 한국어 특화 모델과 데이터셋이 늘고 있습니다. 국내 연구자와 개발자의 활용이 쉬워졌습니다.", category: "hugging-face" },
  { id: "k15", title: "AI 스타트업 M&A 사례 증가", source: "AI 스타트업", url: "https://techcrunch.com", published_at: new Date(Date.now() - 86400000 * 9).toISOString().slice(0, 10), summary: "대기업이 AI 스타트업을 인수하는 사례가 늘고 있습니다. 기술·인재 확보를 위한 전략적 인수합병이 활발합니다.", category: "startup" },
  { id: "k16", title: "AI 펀드 조성, 벤처캐피탈 관심 확대", source: "AI 투자", url: "https://venturebeat.com", published_at: new Date(Date.now() - 86400000 * 10).toISOString().slice(0, 10), summary: "AI 전담 펀드가 잇따라 조성되고 있습니다. 시드·성장 단계 스타트업에 대한 투자가 늘고 있습니다.", category: "investment" },
  { id: "k17", title: "멀티모달 AI, 음성·영상 입력 정확도 향상", source: "AI 기술 업데이트", url: "https://www.theverge.com", published_at: new Date(Date.now() - 86400000 * 11).toISOString().slice(0, 10), summary: "음성과 영상을 동시에 이해하는 멀티모달 AI의 정확도가 향상되었습니다. 실시간 통역·미디어 분석에 활용이 확대됩니다.", category: "tech" },
  { id: "k18", title: "한국, AI 윤리 가이드라인 개정안 발표", source: "AI 정책", url: "https://www.korea.kr", published_at: new Date(Date.now() - 86400000 * 12).toISOString().slice(0, 10), summary: "정부가 AI 윤리 가이드라인 개정안을 발표했습니다. 투명성·책임·공정성 원칙이 강화되었습니다.", category: "policy" },
  { id: "k19", title: "OpenAI, 음성 대화 모드 공개", source: "OpenAI", url: "https://openai.com/blog", published_at: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10), summary: "OpenAI가 ChatGPT 음성 대화 모드를 공개했습니다. 실시간 음성 인식과 자연스러운 답변이 가능합니다.", category: "openai" },
  { id: "k20", title: "Google, Gemini를 워크스페이스에 통합", source: "Google AI", url: "https://blog.google/technology/ai", published_at: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), summary: "Google이 Gemini를 Gmail·Docs·Sheets에 본격 통합했습니다. 이메일 초안 작성·문서 요약이 워크스페이스 안에서 가능해졌습니다.", category: "google-ai" },
  { id: "k21", title: "Anthropic, Claude API 한국어 품질 개선", source: "Anthropic", url: "https://www.anthropic.com/news", published_at: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10), summary: "Claude API의 한국어 이해도와 생성 품질이 개선되었습니다. 국내 서비스 연동 시 더 자연스러운 결과를 기대할 수 있습니다.", category: "anthropic" },
  { id: "k22", title: "AI 규제, 국제 협력 논의 가속화", source: "AI 정책", url: "https://www.theverge.com", published_at: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10), summary: "주요국이 AI 규제에 대한 국제 협력을 논의하고 있습니다. 공통 기준 수립으로 글로벌 서비스의 일관성이 높아질 전망입니다.", category: "policy" },
  { id: "k23", title: "엔터프라이즈 AI 도입 사례 2025", source: "AI 기술 업데이트", url: "https://venturebeat.com", published_at: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10), summary: "기업들의 AI 플랫폼 도입이 늘면서 고객 대응·내부 문서 처리·개발 보조 등 활용 사례가 다양해지고 있습니다.", category: "tech" },
  { id: "k24", title: "AI 스타트업 얼론 데모데이 성황", source: "AI 스타트업", url: "https://techcrunch.com", published_at: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10), summary: "국내 AI 스타트업 데모데이에서 챗봇·이미지·코딩 보조 등 다양한 서비스가 소개되었고, 투자 문의가 이어졌습니다.", category: "startup" },
  { id: "k25", title: "반도체 업체, AI 칩 수요 대응 확대", source: "AI 투자", url: "https://venturebeat.com", published_at: new Date(Date.now() - 86400000 * 8).toISOString().slice(0, 10), summary: "AI 학습·추론용 칩 수요가 늘면서 반도체 업체의 생산과 투자가 확대되고 있습니다.", category: "investment" },
];

const RSS_SOURCES: { url: string; source: string; category: string }[] = [
  { url: "https://openai.com/blog/rss.xml", source: "OpenAI", category: "openai" },
  { url: "https://blog.google/technology/ai/rss/", source: "Google AI", category: "google-ai" },
  { url: "https://www.anthropic.com/news/rss", source: "Anthropic", category: "anthropic" },
  { url: "https://techcrunch.com/feed/", source: "TechCrunch", category: "startup" },
  { url: "https://venturebeat.com/feed/", source: "VentureBeat", category: "investment" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", source: "The Verge", category: "tech" },
];

function parseRssXml(xml: string, source: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  let id = 0;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim() || "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() || block.match(/<link[^>]*\/>/i)?.[0]?.match(/href="([^"]+)"/)?.[1] || "";
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() || "";
    const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim() || "";
    if (!title || !link) continue;
    let dateStr = new Date().toISOString().slice(0, 10);
    try {
      if (pubDate) dateStr = new Date(pubDate).toISOString().slice(0, 10);
    } catch (_) {}
    items.push({
      id: `rss-${source}-${id++}`,
      title: title.slice(0, 200),
      source,
      url: link,
      published_at: dateStr,
      summary: (desc || title).slice(0, 300),
      category,
    });
  }
  return items;
}

/** 소스별 한국어 요약 (RSS 영어 제목 사용 시 보조) */
const SOURCE_SUMMARY_KO: Record<string, string> = {
  OpenAI: "OpenAI의 최신 모델 및 서비스 소식입니다.",
  "Google AI": "Google AI와 Gemini 관련 업데이트 소식입니다.",
  Anthropic: "Anthropic Claude의 기능 및 정책 소식입니다.",
  TechCrunch: "해외 AI 스타트업 및 기술 동향입니다.",
  VentureBeat: "AI 투자 및 엔터프라이즈 도입 동향입니다.",
  "The Verge": "AI 기술과 정책 관련 해외 소식입니다.",
};

/**
 * 한국어 중심 뉴스 목록 반환 (제목·요약 모두 한국어).
 * 카테고리 필터 지원.
 */
export function getKoreanNewsItems(limit = 50, category?: string): NewsItem[] {
  let list = [...KOREAN_NEWS].sort((a, b) => (b.published_at > a.published_at ? 1 : -1));
  if (category) list = list.filter((n) => n.category === category);
  return list.slice(0, limit);
}

/**
 * 뉴스 목록 조회. 한국어 뉴스를 우선 반환합니다.
 * RSS 수집 항목은 영어이므로, 현재는 한국어 큐레이션 목록만 사용합니다.
 */
export async function fetchNewsItems(limit = 30, category?: string): Promise<NewsItem[]> {
  const korean = getKoreanNewsItems(limit + 20, category);
  if (korean.length >= limit) return korean.slice(0, limit);
  const fromRss: NewsItem[] = [];
  for (const { url, source, category: cat } of RSS_SOURCES) {
    if (category && cat !== category) continue;
    try {
      const res = await fetch(url, { next: { revalidate: 3600 }, headers: { "User-Agent": "AI-Tool-Directory/1.0" } });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRssXml(xml, source, cat);
      items.slice(0, 3).forEach((item) => {
        fromRss.push({
          ...item,
          summary: SOURCE_SUMMARY_KO[source] || `${source}에서 제공한 AI 관련 소식입니다. 원문은 링크에서 확인하세요.`,
        });
      });
    } catch (_) {}
  }
  const merged = [...korean];
  const seen = new Set(korean.map((n) => n.id));
  fromRss.forEach((n) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    merged.push({ ...n, title: `${n.title} (해외)` });
  });
  merged.sort((a, b) => (b.published_at > a.published_at ? 1 : -1));
  return merged.slice(0, limit);
}

export function getFallbackNews(category?: string): NewsItem[] {
  return getKoreanNewsItems(30, category);
}
