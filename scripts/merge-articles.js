/**
 * 새 AI 관련 글을 data/articles.json에 일괄 추가합니다.
 * 사용법: node scripts/merge-articles.js [입력파일경로]
 * 입력파일 기본값: data/pending-articles.json
 *
 * 입력 JSON: 배열. 각 항목은 slug, title, excerpt, content, category, tags, published_at, read_time, featured 등.
 * id는 자동 부여, slug 중복 시 건너뜀. content 끝에 출처 블록이 없으면 자동 추가.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ARTICLES_PATH = path.join(ROOT, "data", "articles.json");
const DEFAULT_INPUT = path.join(ROOT, "data", "pending-articles.json");

const SOURCE_BLOCK = `

---
**출처 및 참고**
- 본 글은 AI 툴 올인원에서 정리한 가이드입니다.
- 언급된 서비스의 공식 문서·웹사이트를 참고하였습니다. [AI 서비스 모음](/tools)에서 최신 정보를 확인할 수 있습니다.
`;

const inputPath = process.argv[2] || DEFAULT_INPUT;

if (!fs.existsSync(inputPath)) {
  console.error("입력 파일이 없습니다:", inputPath);
  console.error("예시: data/pending-articles.json 을 만들고 배열로 글을 넣은 뒤");
  console.error("  node scripts/merge-articles.js");
  console.error("또는  node scripts/merge-articles.js path/to/new-articles.json");
  process.exit(1);
}

const existing = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8"));
const existingSlugs = new Set(existing.map((a) => a.slug));
let maxId = 0;
existing.forEach((a) => {
  const n = parseInt(a.id, 10);
  if (!isNaN(n) && n > maxId) maxId = n;
});

const pending = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(pending)) {
  console.error("입력 파일은 배열 형태여야 합니다.");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const toAdd = [];

for (const raw of pending) {
  const slug = raw.slug || raw.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9가-힣-]/g, "") || "article";
  if (existingSlugs.has(slug)) {
    console.warn("건너뜀 (slug 중복):", slug);
    continue;
  }
  maxId += 1;
  let content = (raw.content || "").trim();
  if (content && !content.includes("**출처 및 참고**")) {
    content = content + SOURCE_BLOCK;
  }
  const article = {
    id: String(maxId),
    slug,
    title: raw.title || "제목 없음",
    excerpt: raw.excerpt || raw.title || "",
    content,
    category: raw.category || "usage",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    cover_image: raw.cover_image || "",
    published_at: raw.published_at || today,
    read_time: typeof raw.read_time === "number" ? raw.read_time : 5,
    featured: !!raw.featured,
  };
  existingSlugs.add(slug);
  toAdd.push(article);
}

if (toAdd.length === 0) {
  console.log("추가할 글이 없습니다.");
  process.exit(0);
}

const merged = [...existing, ...toAdd];
fs.writeFileSync(ARTICLES_PATH, JSON.stringify(merged, null, 2), "utf8");
console.log(`추가 완료: ${toAdd.length}개 글. 총 ${merged.length}개.`);
console.log("추가된 slug:", toAdd.map((a) => a.slug).join(", "));
