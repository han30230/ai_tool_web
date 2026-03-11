# 툴 추가 및 콘텐츠 업데이트 가이드

## 1. AI 툴을 더 추가하려면

현재 툴 데이터는 **`data/tools.json`** 한 파일에서 관리됩니다. 새 툴을 넣는 방법은 **세 가지**입니다.

### 방법 0: 일괄 추가 스크립트 (반자동)

새 툴 목록을 JSON 파일로 준비한 뒤 한 번에 병합할 수 있습니다.

1. **`data/pending-tools.json`** 파일을 만든다 (또는 임의 경로의 JSON 파일 준비).
2. 배열 형식으로 툴을 넣는다. `id`는 넣지 않아도 되며, 스크립트가 자동 부여합니다.
   - 예시 형식: `data/pending-tools.example.json` 참고.
3. 터미널에서 실행:
   ```bash
   node scripts/merge-tools.js
   # 또는
   node scripts/merge-tools.js path/to/my-new-tools.json
   ```
4. `data/tools.json`에 자동으로 추가됩니다. **slug가 기존과 중복되면 해당 항목은 건너뜁니다.**

구글 시트·노션 등에서 JSON으로 내보낸 뒤 이 스크립트를 주기적으로 실행하면, “반자동”으로 툴을 늘릴 수 있습니다.

### 방법 A: `data/tools.json`에 직접 추가 (권장)

1. `data/tools.json`을 연다.
2. 배열 맨 앞 또는 원하는 위치에 **기존 툴과 같은 형식**으로 객체를 하나 추가한다.

**필수 필드 예시:**

```json
{
  "id": "고유ID(숫자문자열)",
  "slug": "서비스영문이름",
  "name": "표시 이름",
  "description": "한 줄 설명.",
  "short_description": "짧은 설명(없으면 description과 동일)",
  "category": "카테고리 slug",
  "tags": ["태그1", "태그2"],
  "pricing": "무료" | "유료" | "무료+유료",
  "korean_support": true 또는 false,
  "website_url": "https://...",
  "featured": true 또는 false,
  "features": [],
  "last_updated_at": "2026-03-10"
}
```

**카테고리 slug** (반드시 아래 중 하나):

- `chatbot-llm` (챗봇/LLM)
- `image-generation` (이미지 생성)
- `video-generation` (영상 생성)
- `audio-voice` (오디오/음성)
- `writing` (글쓰기)
- `productivity` (생산성)
- `coding` (코딩/개발)
- `design` (디자인)
- `marketing` (마케팅)
- `seo` (SEO)
- `data-analytics` (데이터/분석)
- `research` (리서치)
- `education` (교육)
- `automation` (자동화)
- `no-code` (노코드)
- `3d-gaming` (3D/게이밍)
- `business` (비즈니스)
- `translation` (번역)
- `presentation` (프레젠테이션)
- `social-media` (소셜 미디어)

**선택 필드:**

- `logo_url`: 로고 이미지 URL (없으면 Clearbit/도메인 기반으로 자동 시도)
- `pricing_url`: 공식 가격 페이지
- `pricing_last_updated_at`: "2026-03-10"
- `pricing_note`: 가격 관련 안내 문구
- `pricing_plans`: `[{ "name": "플랜명", "price": "$0", "desc": "설명" }]`

**주의:**

- `id`는 배열 안에서 **중복되지 않는** 값으로 넣어야 합니다. (예: 기존 최대 id + 1)
- `slug`는 URL에 사용되므로 **영문 소문자, 숫자, 하이픈만** 사용하는 것이 좋습니다. (예: `new-ai-tool`)

### 방법 B: 시드 스크립트로 일괄 반영

- `scripts/seed-data.js` 안의 `rawTools` 배열에 새 툴을 추가한 뒤  
  `node scripts/seed-data.js` 를 실행하면 `data/tools.json`이 **전체 재생성**됩니다.
- 이 방식은 스크립트가 정의한 형식만 넣으므로, 이미 `tools.json`에만 있던 **가격 정보(pricing_plans 등)** 는 덮어쓰일 수 있습니다. 가격을 세밀하게 관리 중이면 **방법 A**를 쓰는 것이 안전합니다.

---

## 2. AI 관련 글이 자동으로 업데이트되나요?

**완전 자동은 아니지만**, 일괄 추가 스크립트로 반자동화할 수 있습니다.

- **완전 자동**: 외부 CMS·API·DB와 연동하면 가능합니다. 현재 구조는 정적 JSON 파일 기반이라, 그대로두면 수동 또는 스크립트 반자동입니다.
- **반자동 (권장)**: 새 글을 **`data/pending-articles.json`** 에 배열로 넣은 뒤 아래를 실행하면 `data/articles.json`에 병합됩니다. 출처 블록이 없으면 자동으로 붙습니다.
  ```bash
  node scripts/merge-articles.js
  # 또는
  node scripts/merge-articles.js path/to/new-articles.json
  ```
- 예시 형식: **`data/pending-articles.example.json`** 참고.
- 배포 후에는 서버를 다시 빌드/배포해야 새 글이 보입니다.

---

## 3. AI 소식은 자동으로 업데이트되나요?

**예.** AI 소식은 **자동으로** 가져옵니다.

- **`lib/aiNewsFetcher.ts`** 에서 다음 RSS 피드를 읽어옵니다.
  - OpenAI, TechCrunch AI, DeepMind, arXiv AI 등
- `/api/ai-news` (또는 이 fetcher를 쓰는 페이지)가 **약 30분마다** 캐시를 갱신하므로, 별도 작업 없이 최신 소식이 반영됩니다.
- 새 뉴스 소스를 넣으려면 `lib/aiNewsFetcher.ts`의 `AI_NEWS_FEEDS` 배열에 `{ url: "RSS URL", source: "표시 이름" }` 을 추가하면 됩니다.

---

## 요약

| 항목           | 데이터 위치          | 자동 업데이트 | 추가/수정 방법 |
|----------------|----------------------|---------------|----------------|
| **AI 툴**      | `data/tools.json`    | 아니요        | JSON 직접 수정, **`merge-tools.js`** 로 일괄 추가, 또는 시드 실행 |
| **AI 관련 글** | `data/articles.json` | 아니요        | JSON 직접 수정, **`merge-articles.js`** 로 일괄 추가, 또는 시드 실행 |
| **AI 소식**    | 외부 RSS             | 예 (약 30분)  | 소스 추가는 `lib/aiNewsFetcher.ts` |

**완전 자동**으로 툴·글을 늘리려면 백엔드/DB 또는 CMS(Strapi, Notion API 등)와 연동한 뒤, 해당 소스에서 JSON을 생성·다운로드하고 위 merge 스크립트를 cron 등으로 주기 실행하는 방식을 사용할 수 있습니다.
