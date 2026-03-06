# 배포 전 체크리스트

배포 직전에 아래 항목을 확인하세요.

## 빌드 및 환경

- [ ] `npm run build` 에러 없이 성공
- [ ] `npm run lint` 통과
- [ ] TypeScript 에러 없음
- [ ] `.env` / `.env.local` 커밋되지 않음 (`.gitignore` 확인)
- [ ] 배포 환경에 필요한 env 설정 완료
  - [ ] `NEXT_PUBLIC_SITE_URL` (프로덕션 URL, canonical/sitemap/OG용)
  - [ ] (선택) `NEXT_PUBLIC_GA_ID` (Google Analytics)

## SEO

- [ ] 주요 페이지에 `title`, `description` 설정됨 (홈, 툴 리스트, 카테고리, 툴 상세, 글/뉴스/문의)
- [ ] `metadataBase` 또는 canonical URL 설정 확인
- [ ] `/sitemap.xml` 접속 시 목록 정상 노출
- [ ] `/robots.txt` 접속 시 allow/sitemap 정상
- [ ] JSON-LD (WebSite, Organization, SoftwareApplication, BreadcrumbList) 오류 없음

## 콘텐츠 및 링크

- [ ] Broken link 없음 (내부 링크 클릭 시 404 없음)
- [ ] 툴 상세 페이지 `website_url` 유효 (외부 링크)
- [ ] 정책 페이지 노출 확인: 개인정보처리방침(`/privacy`), 이용약관(`/terms`), 문의(`/contact`)
- [ ] Footer에 정책/문의 링크 노출

## UI/UX

- [ ] 모바일에서 필터·카테고리 pills·검색창·상세 레이아웃 정상
- [ ] 툴 카드 높이/정렬 통일감
- [ ] 검색 결과 없을 때 empty state 메시지 및 “전체 목록 보기” 동작
- [ ] 이미지(로고) 로딩 실패 시 fallback 동작

## 분석 및 정책

- [ ] (선택) Google Analytics 또는 Plausible 연동 후 이벤트 확인
  - 검색, 툴 클릭, 공식 링크 클릭, 카테고리 클릭 등
- [ ] 개인정보처리방침·이용약관 내용 검토
- [ ] 문의 이메일 또는 폼 안내 확인

## 최종 점검

- [ ] 프로덕션 URL에서 홈 / 툴 리스트 / 툴 상세 / 카테고리 / 가격별·대안·비교 페이지 정상 동작
- [ ] OG 이미지·타이틀 공유 시 미리보기 정상
- [ ] Lighthouse(Performance, Accessibility, Best Practices, SEO) 점수 확인
