import { tools } from "./tools";
import { getAllArticles } from "./articles";

const TAG_ALIASES: Record<string, string> = {
  // prompts
  "prompt": "프롬프트",
  "prompts": "프롬프트",
  "prompting": "프롬프트",
  "prompt-engineering": "프롬프트",
  "프롬프트": "프롬프트",
  // llm / chatbot
  "llm": "챗봇",
  "chatbot": "챗봇",
  "chatbots": "챗봇",
  "챗봇": "챗봇",
  "대화": "챗봇",
  // coding
  "coding": "코딩",
  "developer": "코딩",
  "dev": "코딩",
  "코딩": "코딩",
  "개발": "코딩",
  // marketing
  "marketing": "마케팅",
  "마케팅": "마케팅",
  "카피": "마케팅",
  "copywriting": "마케팅",
  // seo
  "seo": "seo",
  // image
  "image": "이미지",
  "images": "이미지",
  "image-generation": "이미지",
  "이미지": "이미지",
  "이미지생성": "이미지",
  // video
  "video": "영상",
  "videos": "영상",
  "video-generation": "영상",
  "영상": "영상",
  "비디오": "영상",
  // voice/audio
  "tts": "음성",
  "stt": "음성",
  "voice": "음성",
  "audio": "음성",
  "음성": "음성",
  // research
  "research": "리서치",
  "paper": "리서치",
  "논문": "리서치",
  "리서치": "리서치",
};

const CANONICAL_LABELS: Record<string, string> = {
  "프롬프트": "프롬프트",
  "챗봇": "챗봇/LLM",
  "코딩": "코딩/개발",
  "마케팅": "마케팅",
  "seo": "SEO",
  "이미지": "이미지 생성",
  "영상": "영상 생성",
  "음성": "오디오/음성",
  "리서치": "리서치",
};

export function normalizeTag(t: string): string {
  let s = (t || "").trim();
  if (!s) return "";
  if (s.startsWith("#")) s = s.slice(1);
  s = s.replace(/\s+/g, "-").toLowerCase();
  return TAG_ALIASES[s] ? TAG_ALIASES[s].toLowerCase().replace(/\s+/g, "-") : s;
}

export type TagInfo = {
  /** normalized key */
  key: string;
  /** display label (original casing when possible) */
  label: string;
  toolCount: number;
  articleCount: number;
};

export function getAllTags(): TagInfo[] {
  const map = new Map<string, TagInfo>();
  for (const tool of tools) {
    for (const tag of tool.tags || []) {
      const key = normalizeTag(tag);
      if (!key) continue;
      const cur = map.get(key);
      if (!cur) {
        const label = CANONICAL_LABELS[key] || String(tag).trim();
        map.set(key, { key, label, toolCount: 1, articleCount: 0 });
      } else {
        cur.toolCount += 1;
      }
    }
  }
  for (const a of getAllArticles()) {
    for (const tag of a.tags || []) {
      const key = normalizeTag(tag);
      if (!key) continue;
      const cur = map.get(key);
      if (!cur) {
        const label = CANONICAL_LABELS[key] || String(tag).trim();
        map.set(key, { key, label, toolCount: 0, articleCount: 1 });
      } else {
        cur.articleCount += 1;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.toolCount * 2 + a.articleCount;
    const scoreB = b.toolCount * 2 + b.articleCount;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.label.localeCompare(b.label, "ko");
  });
}

export function getTagKeys(): string[] {
  return getAllTags().map((t) => t.key);
}

export function matchToolsByTag(tagKey: string) {
  const key = normalizeTag(tagKey);
  return tools.filter((t) => (t.tags || []).some((x) => normalizeTag(String(x)) === key));
}

export function matchArticlesByTag(tagKey: string) {
  const key = normalizeTag(tagKey);
  return getAllArticles().filter((a) => (a.tags || []).some((x) => normalizeTag(String(x)) === key));
}

export function getRelatedTagKeys(tagKey: string, limit = 12): string[] {
  const key = normalizeTag(tagKey);
  if (!key) return [];

  const toolsForTag = matchToolsByTag(key);
  const articlesForTag = matchArticlesByTag(key);

  const scores = new Map<string, number>();
  const bump = (k: string, w: number) => {
    const nk = normalizeTag(k);
    if (!nk || nk === key) return;
    scores.set(nk, (scores.get(nk) || 0) + w);
  };

  // Co-occurrence from tools (stronger signal)
  for (const t of toolsForTag) {
    for (const tg of t.tags || []) bump(String(tg), 2);
  }
  // Co-occurrence from articles
  for (const a of articlesForTag) {
    for (const tg of a.tags || []) bump(String(tg), 1);
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k);
}

