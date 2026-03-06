# AI 툴 올인원 (AI Tool Directory)

한국 시장을 타깃으로 한 **AI 툴 디렉토리/검색/탐색 서비스**입니다.  
카테고리·가격·기능 기준으로 AI 도구를 빠르게 비교하고, 툴 상세에서 기능/활용 사례/가격/대안을 확인할 수 있습니다.

## 로컬 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) (선택) 시드 데이터 생성

- **툴 데이터**: `data/tools.json` — `npm run seed`
- **글 데이터**: `data/articles.json` — `npm run seed:articles`

```bash
npm run seed
npm run seed:articles
```

### 3) 개발 서버 실행

```bash
npm run dev
```

### 4) 접속

- `http://localhost:3000` — 홈
- `http://localhost:3000/tools` — 툴 리스트
- `http://localhost:3000/tools/<slug>` — 툴 상세
- `http://localhost:3000/categories/<category>` — 카테고리 페이지
- `http://localhost:3000/articles` — AI 관련 글
- `http://localhost:3000/news` — AI 소식

## 환경변수

이 프로젝트는 기본적으로 **로컬 JSON 데이터 기반**으로 동작하며, 환경변수 없이도 실행됩니다.  
필요 시 `.env.example`을 참고해 `.env.local`을 생성하세요.

```bash
cp .env.example .env.local
```

## DB / Prisma (선택)

현재는 Prisma/DB 없이도 동작하도록 구성되어 있습니다.  
향후 Prisma를 추가한다면 아래처럼 운영을 권장합니다.

- **로컬**: Postgres/SQLite + `prisma migrate` + `seed`
- **Vercel**: Neon/Supabase 등 **managed Postgres** + `DATABASE_URL` 설정

## Vercel 배포 방법

### 필수 체크

- `npm run build` 가 **에러 없이 성공**해야 합니다.
- `.env` 파일은 커밋하지 않습니다. (`.gitignore` 처리됨)

### 웹 UI로 배포

1. Vercel 로그인
2. **Import Git Repository** → `han30230/ai_tool_web`
3. Framework: **Next.js**
4. Environment Variables 설정 (필요 시)
   - `NEXT_PUBLIC_SITE_URL` (권장)
   - `DATABASE_URL` (Prisma/DB 사용 시)
   - `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY` (검색 연동 시)
5. Deploy

### (가능하면) CLI로 배포

```bash
npx vercel login
npx vercel
npx vercel --prod
```

## (선택) Meilisearch 사용 시

Meilisearch를 붙이는 경우:

- Vercel에 `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`를 등록
- 운영 환경에서 미설정 시에도 **검색 기능만 비활성화**되도록 구성하는 것을 권장합니다.

---

## 운영 가이드

### 툴 추가 방법

1. `scripts/seed-data.js` 내부 `rawTools` 배열에 새 툴 객체 추가.
2. 필수 필드: `name`, `description`, `category`, `tags`, `pricing`, `korean_support`, `website_url`, `featured`.
3. `category`는 `lib/categories.ts`의 `CATEGORIES[].slug` 중 하나여야 함.
4. 저장 후 `npm run seed` 실행 → `data/tools.json` 갱신.
5. (선택) `website_url`이 없거나 잘못된 항목은 시드에서 제외됨.

### 카테고리 추가 방법

1. `lib/categories.ts`의 `CATEGORIES` 배열에 `{ slug, name, nameEn, description }` 추가.
2. `components/CategoryPills.tsx`의 `PILL_ORDER`와 `PILL_LABELS`에 해당 slug 추가.
3. 시드 데이터에 해당 카테고리 툴이 있으면 자동으로 개수 표시됨.

### 글(Articles) 관리 방법

1. **초기 데이터**: `npm run seed:articles` → `data/articles.json` 생성 (30개 샘플).
2. **수동 편집**: `data/articles.json`을 직접 수정하거나, `scripts/seed-articles.js`의 `ARTICLES` 배열에 항목을 추가한 뒤 다시 실행.
3. **필드**: `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `cover_image`, `published_at`, `read_time`, `featured`.
4. **카테고리**: 사용법(usage), 워크플로우(workflow), 프롬프트(prompt), 국내 사례(local-case), 생산성(productivity), 마케팅(marketing), 개발(development), 디자인(design).

### 뉴스(News) 관리 방법

1. **자동 수집**: `/news` 페이지는 `lib/news.ts`에 정의된 RSS URL 목록을 주기적으로 fetch합니다 (revalidate: 1시간).
2. **RSS 소스**: `lib/news.ts`의 `RSS_SOURCES` 배열에서 URL·소스명 수정 가능.
3. **Fallback**: 외부 RSS fetch가 모두 실패하면 `FALLBACK_NEWS`(로컬 시드)가 표시되며, 빌드/런타임 오류로 페이지가 죽지 않습니다.
4. **배포 시**: Vercel 등에서 빌드 시 네트워크가 제한될 수 있으므로, 첫 로드에 fallback이 나올 수 있습니다. 배포 후 한 번 이상 방문하면 캐시가 채워져 RSS 기반 목록이 보입니다.

### 환경변수 설명

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 배포된 사이트 URL (canonical, sitemap, OG용) | 배포 시 권장 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 측정 ID (G-XXXXXXXXXX) | 선택 |
| `DATABASE_URL` | Prisma/DB 사용 시 연결 문자열 | 선택 |
| `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY` | 검색 엔진 연동 시 | 선택 |

### 문의

서비스·제휴·툴 제출 문의: **han30230@gmail.com** (문의 페이지 `/contact`에서 동일 이메일 사용)

### 배포 전 확인

- `docs/DEPLOYMENT_CHECKLIST.md` 참고.

