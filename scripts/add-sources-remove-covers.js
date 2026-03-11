/**
 * 1. Set all article cover_image to ""
 * 2. Append "출처 및 참고" block to each article content (if not already present)
 * Run: node scripts/add-sources-remove-covers.js
 */
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "articles.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const SOURCE_BLOCK = `

---
**출처 및 참고**
- 본 글은 AI 툴 올인원에서 정리한 가이드입니다.
- 언급된 서비스(OpenAI, Anthropic, Google, Microsoft 등)의 공식 문서·웹사이트를 참고하였습니다. 기능·가격·정책은 각 서비스 공식 사이트에서 확인하시기 바랍니다.
- [AI 서비스 모음](/tools)에서 해당 툴의 최신 정보를 확인할 수 있습니다.
`;

data.forEach((a) => {
  a.cover_image = "";
  if (!a.content.includes("**출처 및 참고**")) {
    a.content = (a.content || "").trim() + SOURCE_BLOCK;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
console.log("Done: cover_image cleared and sources appended for", data.length, "articles.");
