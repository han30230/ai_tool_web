/**
 * 새 툴을 data/tools.json에 일괄 추가합니다.
 * 사용법: node scripts/merge-tools.js [입력파일경로]
 * 입력파일 기본값: data/pending-tools.json
 *
 * 입력 JSON: 배열 형태. 각 항목은 slug, name, description, category, tags, pricing, korean_support, website_url 등.
 * id는 자동 부여되며, slug 중복 시 건너뜁니다.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TOOLS_PATH = path.join(ROOT, "data", "tools.json");
const DEFAULT_INPUT = path.join(ROOT, "data", "pending-tools.json");

const inputPath = process.argv[2] || DEFAULT_INPUT;

if (!fs.existsSync(inputPath)) {
  console.error("입력 파일이 없습니다:", inputPath);
  console.error("예시: data/pending-tools.json 을 만들고 아래 형식으로 툴을 넣은 뒤");
  console.error("  node scripts/merge-tools.js");
  console.error("또는  node scripts/merge-tools.js path/to/new-tools.json");
  process.exit(1);
}

const existing = JSON.parse(fs.readFileSync(TOOLS_PATH, "utf8"));
const existingSlugs = new Set(existing.map((t) => t.slug));
const existingIds = new Set(existing.map((t) => t.id));
let maxId = 0;
existing.forEach((t) => {
  const n = parseInt(t.id, 10);
  if (!isNaN(n) && n > maxId) maxId = n;
});

const pending = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(pending)) {
  console.error("입력 파일은 배열 형태여야 합니다.");
  process.exit(1);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "tool";
}

const toAdd = [];
for (const raw of pending) {
  const slug = raw.slug || slugify(raw.name);
  if (existingSlugs.has(slug)) {
    console.warn("건너뜀 (slug 중복):", slug);
    continue;
  }
  maxId += 1;
  const id = String(maxId);
  existingSlugs.add(slug);
  const tool = {
    id,
    slug,
    name: raw.name || raw.slug || "Unnamed",
    description: raw.description || "",
    short_description: raw.short_description || raw.description || "",
    category: raw.category || "chatbot-llm",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    pricing: raw.pricing || "무료+유료",
    korean_support: !!raw.korean_support,
    website_url: raw.website_url || "",
    featured: !!raw.featured,
    features: Array.isArray(raw.features) ? raw.features : [],
    last_updated_at: raw.last_updated_at || new Date().toISOString().slice(0, 10),
  };
  if (raw.logo_url) tool.logo_url = raw.logo_url;
  if (raw.pricing_url) tool.pricing_url = raw.pricing_url;
  if (raw.pricing_plans) tool.pricing_plans = raw.pricing_plans;
  toAdd.push(tool);
}

if (toAdd.length === 0) {
  console.log("추가할 툴이 없습니다.");
  process.exit(0);
}

const merged = [...existing, ...toAdd];
fs.writeFileSync(TOOLS_PATH, JSON.stringify(merged, null, 2), "utf8");
console.log(`추가 완료: ${toAdd.length}개 툴. 총 ${merged.length}개.`);
console.log("추가된 slug:", toAdd.map((t) => t.slug).join(", "));
