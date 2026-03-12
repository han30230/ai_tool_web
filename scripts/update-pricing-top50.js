/* eslint-disable no-console */
/**
 * Update pricing info for top 50 tools.
 *
 * Strategy:
 * - Choose top 50 tools by (featured desc, id desc)
 * - Fetch pricing_url (preferred), else try common pricing paths on website_url
 * - Extract plan/price hints from JSON-LD (Offer) and HTML text heuristics
 * - Write back to data/tools.json:
 *   - pricing_url (if discovered)
 *   - pricing_plans (best-effort)
 *   - pricing_last_updated_at (today)
 *   - pricing_note (only when data is partial/heuristic)
 */
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const ROOT = path.join(__dirname, "..");
const TOOLS_JSON = path.join(ROOT, "data", "tools.json");

function isoDateOnly(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function toNumberId(id) {
  const n = Number(id);
  return Number.isFinite(n) ? n : 0;
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function normalizeUrl(u) {
  if (!u || typeof u !== "string") return "";
  const s = u.trim();
  if (!s) return "";
  try {
    return new URL(s).toString();
  } catch {
    return "";
  }
}

function buildPricingCandidates(tool) {
  const candidates = [];
  const pricingUrl = normalizeUrl(tool.pricing_url);
  if (pricingUrl) candidates.push(pricingUrl);

  const home = normalizeUrl(tool.website_url);
  if (home) {
    try {
      const base = new URL(home);
      const baseOrigin = `${base.protocol}//${base.host}`;
      const paths = ["/pricing", "/pricing/", "/plans", "/plan", "/price", "/prices", "/billing"];
      for (const p of paths) candidates.push(`${baseOrigin}${p}`);
      candidates.push(home);
    } catch {
      // ignore
    }
  }

  return uniqBy(candidates, (x) => x);
}

async function fetchHtml(url, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; AIToolDirectoryBot/1.0; +https://example.com/bot) CursorAgent",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) return { ok: false, status: res.status, finalUrl: url, html: "" };
    const finalUrl = res.url || url;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
      return { ok: false, status: res.status, finalUrl, html: "" };
    }
    const html = await res.text();
    return { ok: true, status: res.status, finalUrl, html };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, html: "" };
  } finally {
    clearTimeout(t);
  }
}

function extractFromJsonLd($) {
  const plans = [];
  const scripts = $('script[type="application/ld+json"]');
  scripts.each((_, el) => {
    const raw = $(el).text();
    if (!raw || raw.length < 2) return;
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return;
    }
    const nodes = Array.isArray(json) ? json : [json];
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const offers = node.offers || node.Offers || node.offer;
      const offerList = Array.isArray(offers) ? offers : offers ? [offers] : [];
      for (const offer of offerList) {
        if (!offer || typeof offer !== "object") continue;
        const price = offer.price != null ? String(offer.price) : "";
        const currency = offer.priceCurrency ? String(offer.priceCurrency) : "";
        const name = offer.name ? String(offer.name) : offer.description ? String(offer.description) : "Offer";
        if (!price) continue;
        plans.push({
          name: name.slice(0, 40),
          price: currency ? `${price} ${currency}` : price,
          desc: offer.description ? String(offer.description).slice(0, 120) : undefined,
        });
      }
    }
  });
  return uniqBy(plans, (p) => `${p.name}|${p.price}`);
}

function cleanText(s) {
  return s.replace(/\s+/g, " ").trim();
}

function extractHeuristicPlans(htmlText) {
  const lines = (Array.isArray(htmlText) ? htmlText : [htmlText])
    .flatMap((t) => String(t || "").split(/[\r\n]+/))
    .map((l) => cleanText(l))
    .filter((l) => l.length >= 6 && l.length <= 180);

  const planNameRe = /\b(Free|Starter|Basic|Plus|Pro|Team|Business|Enterprise|Premium|Standard)\b/i;
  const priceRe =
    /(\$|€|£|₩)\s?\d{1,4}(?:[.,]\d{1,2})?(?:\s?(?:k|K))?(?:\s?\/\s?(?:mo|month|yr|year|m|y))?/i;
  const priceWordRe = /\b(Free|무료)\b/i;

  const found = [];
  for (const line of lines) {
    const hasPrice = priceRe.test(line) || priceWordRe.test(line);
    if (!hasPrice) continue;

    const nameMatch = line.match(planNameRe);
    const priceMatch = line.match(priceRe) || line.match(priceWordRe);
    if (!priceMatch) continue;
    const name = nameMatch ? nameMatch[0] : "Plan";
    const price = priceMatch[0].replace(/\s+/g, " ").trim();
    found.push({ name, price, desc: line.length > 60 ? line.slice(0, 120) : undefined });
  }

  // Keep top few unique entries
  const uniq = uniqBy(found, (p) => `${p.name}|${p.price}`);
  return uniq.slice(0, 6);
}

function decidePricingType(existing, plans) {
  const joined = plans.map((p) => `${p.name} ${p.price}`.toLowerCase()).join(" ");
  const hasFree = /\bfree\b|무료|\$0\b|₩0\b/.test(joined);
  const hasPaid = /\$\s?\d|€\s?\d|£\s?\d|₩\s?\d/.test(joined);
  if (hasFree && hasPaid) return "무료+유료";
  if (hasFree && !hasPaid) return "무료";
  if (!hasFree && hasPaid) return "유료";
  return existing || "무료+유료";
}

async function updateOneTool(tool) {
  const candidates = buildPricingCandidates(tool);
  let picked = "";
  let html = "";
  for (const u of candidates) {
    const r = await fetchHtml(u);
    if (!r.ok || !r.html) continue;
    picked = r.finalUrl || u;
    html = r.html;
    // Heuristic: prefer pages that likely are pricing.
    const lower = picked.toLowerCase();
    if (lower.includes("pricing") || lower.includes("plan") || lower.includes("billing") || lower.includes("price")) {
      break;
    }
  }

  if (!picked || !html) {
    return { ok: false, pricing_url: tool.pricing_url || "", pricing_plans: tool.pricing_plans || [] };
  }

  const $ = cheerio.load(html);
  const jsonLdPlans = extractFromJsonLd($);
  const snippetTexts = [];
  $("h1,h2,h3,h4,h5,h6,p,li,span,div").each((_, el) => {
    const t = cleanText($(el).text() || "");
    if (t.length < 6 || t.length > 180) return;
    // Prefer lines that likely contain pricing keywords
    if (/(pricing|plan|month|year|\/mo|\/yr|per\s+month|per\s+year|free|starter|pro|team|enterprise|무료|월|년)/i.test(t)) {
      snippetTexts.push(t);
    }
  });
  const heuristicPlans = extractHeuristicPlans(snippetTexts.slice(0, 400));

  const plans = jsonLdPlans.length > 0 ? jsonLdPlans : heuristicPlans;
  const note =
    plans.length === 0
      ? "가격 정보 자동 수집(추출 실패) — 가격 페이지 링크를 확인해 주세요."
      : jsonLdPlans.length > 0
        ? "가격 정보 자동 수집(JSON-LD 기반)."
        : "가격 정보 자동 수집(텍스트 추출 기반). 일부 값은 지역/프로모션에 따라 달라질 수 있습니다.";

  return {
    ok: true,
    pricing_url: picked,
    pricing_plans: plans,
    pricing_note: note,
  };
}

async function run() {
  const today = isoDateOnly();
  const raw = fs.readFileSync(TOOLS_JSON, "utf-8");
  const tools = JSON.parse(raw);
  if (!Array.isArray(tools)) throw new Error("tools.json must be an array");

  const sorted = [...tools].sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fb !== fa) return fb - fa;
    return toNumberId(b.id) - toNumberId(a.id);
  });
  const top = uniqBy(sorted, (t) => t.slug).slice(0, 50);
  const topSlugs = new Set(top.map((t) => t.slug));

  console.log(`[pricing] updating top ${top.length} tools (${today})`);

  const concurrency = 5;
  let idx = 0;
  let updatedCount = 0;
  let extractedPlansCount = 0;
  let failedCount = 0;

  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= top.length) return;
      const tool = top[i];
      const label = `${tool.name} (${tool.slug})`;
      try {
        const res = await updateOneTool(tool);
        const tIdx = tools.findIndex((x) => x.slug === tool.slug);
        if (tIdx >= 0) {
          if (res.pricing_url) tools[tIdx].pricing_url = res.pricing_url;
          tools[tIdx].pricing_last_updated_at = today;

          const nextPlans = Array.isArray(res.pricing_plans) ? res.pricing_plans : [];
          if (nextPlans.length > 0) {
            tools[tIdx].pricing_plans = nextPlans;
          }

          // Only overwrite pricing_note when we extracted something, or when empty.
          if ((tools[tIdx].pricing_note || "").trim().length === 0 || nextPlans.length > 0) {
            if (res.pricing_note) tools[tIdx].pricing_note = res.pricing_note;
          }

          tools[tIdx].pricing = decidePricingType(tools[tIdx].pricing, tools[tIdx].pricing_plans || []);
          updatedCount++;
          if ((tools[tIdx].pricing_plans || []).length > 0) extractedPlansCount++;
        }
        console.log(`[pricing] ok: ${label} → ${res.pricing_url || "(no pricing url)"}`);
      } catch (e) {
        failedCount++;
        console.log(`[pricing] fail: ${label}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  // Keep original order, just write updated values.
  fs.writeFileSync(TOOLS_JSON, JSON.stringify(tools, null, 2) + "\n", "utf-8");

  console.log(
    `[pricing] done. updated=${updatedCount}, withPlans=${extractedPlansCount}, failed=${failedCount}, top50=${topSlugs.size}`
  );
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

