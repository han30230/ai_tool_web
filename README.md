# AI 툴 올인원 (AI Tool Directory)

한국 시장을 타깃으로 한 **AI 툴 디렉토리/검색/탐색 서비스**입니다.  
카테고리·가격·기능 기준으로 AI 도구를 빠르게 비교하고, 툴 상세에서 기능/활용 사례/가격/대안을 확인할 수 있습니다.

## 로컬 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) (선택) 시드 데이터 생성

초기 데이터는 `data/tools.json`에 저장되며, 아래 명령으로 재생성할 수 있습니다.

```bash
npm run seed
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

