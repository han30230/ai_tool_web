/**
 * Seed articles: English slugs, unique Unsplash images, real content (800~1500 chars).
 * Run: node scripts/seed-articles.js
 * Output: data/articles.json
 */

const fs = require("fs");
const path = require("path");

// 30 unique Unsplash images (AI/tech/productivity) - no duplicates
const COVERS = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1686191128892-cf7f8e7e8b2e?w=800&q=80",
  "https://images.unsplash.com/photo-1676299085922-6cbedae6b698?w=800&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  "https://images.unsplash.com/photo-1682685797736-7b9d1fce9a3c?w=800&q=80",
  "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  "https://images.unsplash.com/photo-1677442136018-5f43c2d2c97f?w=800&q=80",
  "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
  "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
];

const ARTICLES = [
  { slug: "chatgpt-productivity-guide", title: "ChatGPT 업무 자동화 10가지 방법", category: "usage", tags: ["ChatGPT", "업무자동화", "생산성"], read_time: 6, featured: true, content: `## ChatGPT로 업무 효율 2배 올리기

ChatGPT를 단순 채팅 도구로만 쓰고 계시다면 아쉽습니다. 업무 자동화에 활용하면 반복 작업을 크게 줄일 수 있습니다.

### 1. 이메일 초안·답장 작성
받은 메일을 붙여넣고 "공손한 답장 초안 작성해줘"라고 요청하면 됩니다. 톤과 길이를 지정하면 더 정확합니다.

### 2. 회의록 요약
녹음 파일이나 긴 회의록을 넣고 "3줄 요약", "액션 아이템만 추출"을 요청하세요.

### 3. 보고서·제안서 초안
개요만 알려주면 절차별 문단을 채워줍니다. 데이터가 있다면 표로 정리해 달라고 할 수 있습니다.

### 4. 번역·다듬기
해외 메일이나 문서를 한국어로 번역하고, 비즈니스 톤으로 다듬어 달라고 요청하세요.

### 5. 코드 설명·주석
코드 블록을 넣으면 동작 설명이나 한글 주석을 생성해 줍니다.

### 6. 브레인스토밍
아이디어를 "10개만 짧게", "장단점 포함해서"처럼 구체적으로 요청하면 활용도가 높아집니다.

### 7. 체크리스트·가이드
"온보딩 체크리스트", "배포 전 점검 목록"처럼 형식을 지정하면 바로 활용 가능한 목록을 만들어 줍니다.

### 8. 소셜/광고 카피
캠페인 컨셉과 타깃만 알려주면 여러 버전의 카피를 제안합니다.

### 9. 질의응답 요약
FAQ나 긴 Q&A 문서를 넣고 "질문별로 한 줄 요약"을 요청할 수 있습니다.

### 10. 스케줄·일정 초안
행사명과 날짜만 나열하면 시간순 정리나 공지 문구 초안을 만들어 줍니다.

실제로 쓰려면 "역할(마케터/개발자 등)", "목적", "형식"을 구체적으로 적는 것이 좋습니다. 더 많은 AI 툴은 [AI 서비스 모음](/tools)에서 비교해 보세요.` },
  { slug: "best-ai-tools-for-marketers", title: "마케터를 위한 AI 툴 TOP 10", category: "marketing", tags: ["마케팅", "AI", "추천"], read_time: 8, featured: true, content: `## 마케팅 업무에 바로 쓰는 AI 툴 10선

마케팅은 카피, 이미지, 데이터 분석까지 폭이 넓습니다. 구역별로 추천 툴을 정리했습니다.

### 카피·콘텐츠
- **Jasper, Copy.ai**: 광고 카피, 블로그 제목·본문 초안을 빠르게 만듭니다.
- **ChatGPT, Claude**: 메일, 소개문, SNS 문구 등 범용 작성에 적합합니다.

### 이미지·영상
- **Canva AI, Midjourney, DALL-E**: 배너·소셜 이미지, 아이디어 시각화에 활용하세요.
- **Runway, Pictory**: 영상 편집·자동 자막·숏폼 제작에 유용합니다.

### SEO·분석
- **Surfer SEO, Frase**: 키워드 연구와 SEO 최적화 글쓰기를 지원합니다.
- **ChatGPT + 검색**: 경쟁사 분석, 타깃 키워드 제안을 요청할 수 있습니다.

### 이메일·캠페인
- **Mailchimp, HubSpot**: AI 기능으로 세그먼트 제안, 제목 A/B 테스트를 도와줍니다.

공통 팁은 "타깃", "톤", "목적"을 명확히 적는 것입니다. 무료 체험으로 먼저 써보고, [AI 툴 디렉토리](/tools)에서 카테고리별로 더 찾아보세요.` },
  { slug: "free-ai-image-generators", title: "무료 AI 이미지 생성 툴 비교", category: "usage", tags: ["이미지생성", "무료", "DALL-E"], read_time: 7, featured: true, content: `## 무료로 쓸 수 있는 AI 이미지 생성 툴

유료 서비스 없이도 괜찮은 품질의 AI 이미지를 만들 수 있습니다.

### DALL-E 3 (ChatGPT Plus/무료 크레딧)
OpenAI의 이미지 생성. 프롬프트 이해도가 좋고, 한글도 가능합니다. ChatGPT 무료 사용자에게는 월 일정 크레딧이 주어지는 경우가 있습니다.

### Microsoft Designer (Bing Image Creator)
Bing 계정으로 무료 이용 가능. DALL-E 기반으로 다양한 스타일을 지원합니다.

### Leonardo.Ai
일일 무료 크레딧으로 고품질 이미지를 생성할 수 있습니다. 게임·캐릭터 스타일에 강점이 있습니다.

### Playground AI
무료 티어에서 일일 제한 있음. 여러 모델을 한 곳에서 써볼 수 있습니다.

### Craiyon (구 Dall-E mini)
완전 무료. 품질은 상대적으로 낮지만 빠르게 아이디어를 시각화할 때 유용합니다.

### 비교 시 체크할 점
- 일일/월간 생성 횟수 제한
- 상업적 이용 가능 여부
- 해상도·다운로드 형식
- 한글 프롬프트 지원 여부

이미지 툴만 따로 쓰고 싶다면 [이미지 생성 카테고리](/categories/image-generation)에서 더 많은 옵션을 확인해 보세요.` },
  { slug: "ai-tools-for-students", title: "학생들이 쓰면 좋은 AI 툴 15가지", category: "productivity", tags: ["학생", "학습", "요약"], read_time: 7, featured: true, content: `## 공부와 과제에 활용하는 AI 툴

과제 정리, 논문 요약, 발표 준비까지 학생에게 유용한 툴을 모았습니다.

### 요약·정리
- **ChatGPT, Claude**: 긴 글·논문을 요약하거나 질문에 답하는 데 활용하세요.
- **Notion AI**: 노트를 요약하거나 액션 아이템을 추출할 수 있습니다.

### 글쓰기·보고서
- **Grammarly**: 문법·맥락 교정으로 보고서 품질을 높입니다.
- **QuillBot**: 표절 방지와 문장 다듬기에 유용합니다.

### 번역·언어
- **DeepL, Google 번역**: 논문이나 자료 번역 시 문맥이 자연스럽습니다.

### 발표·PT
- **Gamma, Beautiful.ai**: 텍스트만 넣어도 슬라이드 초안이 만들어집니다.
- **Canva**: 발표 자료 디자인을 빠르게 완성할 수 있습니다.

### 코딩·수학
- **Phind, Cursor**: 코딩 과제나 알고리즘 설명을 도와줍니다.
- **Wolfram Alpha**: 수식·통계 계산과 시각화에 강합니다.

### 주의사항
과제나 시험 답은 직접 작성해야 합니다. AI는 이해를 돕고 초안을 만드는 도구로만 쓰는 것을 권장합니다. 더 많은 툴은 [AI 툴 목록](/tools)에서 카테고리별로 확인하세요.` },
  { slug: "ai-blog-writing-guide", title: "AI로 블로그 글 작성하는 방법", category: "usage", tags: ["블로그", "글쓰기", "SEO"], read_time: 6, featured: false, content: `## AI를 활용한 블로그 글쓰기 워크플로우

블로그 글을 처음부터 끝까지 AI만 쓰기보다, 단계별로 보조하는 방식이 품질과 SEO에 유리합니다.

### 1단계: 주제·키워드 정하기
ChatGPT나 Perplexity에 "이 주제로 블로그 글 쓸 건데, 검색될 만한 키워드 10개 추천해줘"라고 요청하세요. SEO 툴(Surfer, Frase 등)과 함께 쓰면 좋습니다.

### 2단계: 목차(아웃라인) 만들기
선정한 키워드를 넣고 "블로그 목차 만들어줘. H2, H3까지."라고 하면 구조가 나옵니다. 여기에 본인 경험·데이터를 넣을 구간을 표시해 두세요.

### 3단계: 본문 초안 작성
섹션별로 "이 목차에 맞게 2~3문단 작성해줘. 톤은 ~하게."처럼 요청합니다. 한 번에 전체를 받기보다는 구간별로 쓰고 수정하는 편이 자연스럽습니다.

### 4단계: 다듬기·검증
AI 문장은 반복적일 수 있으니, 예시 추가·숫자 보강·링크 삽입은 직접 하세요. 표절 체크와 사실 확인도 꼭 합니다.

### 5단계: 메타·제목
"이 글에 맞는 SEO 메타 디스크립션과 제목 3개 추천해줘"로 마무리하면 됩니다.

정리하면, AI는 아이디어·구조·초안을 돕고, 독자성과 정확성은 사람이 채우는 방식이 좋습니다. [글쓰기·생산성 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "ai-coding-tools-for-developers", title: "개발자를 위한 AI 코딩 툴 정리", category: "development", tags: ["개발", "Cursor", "Copilot"], read_time: 8, featured: true, content: `## 개발 생산성을 높이는 AI 코딩 도구

코드 작성, 리뷰, 리팩터링, 문서화까지 개발 단계별로 쓸 수 있는 AI 툴을 정리했습니다.

### IDE 통합형
- **GitHub Copilot**: 코드 자동 완성, 주석에서 코드 생성. VS Code 등 주요 IDE 지원.
- **Cursor**: VS Code 기반에 AI 채팅·편집이 통합되어 있습니다. 코드베이스 질의에 강합니다.
- **Amazon CodeWhisperer**: AWS 생태계와 연동된 무료 티어가 있습니다.

### 채팅·설명
- **ChatGPT, Claude**: 코드 설명, 버그 원인 추정, 테스트 케이스 작성 요청에 활용하세요.
- **Phind**: 검색 결과와 코드를 함께 보여줘서 "이 에러 왜 나와?" 같은 질문에 유용합니다.

### 리뷰·품질
- **CodeRabbit, Sourcery**: PR 리뷰와 리팩터링 제안을 자동으로 해 줍니다.

### 문서·테스트
- **Mintlify, Docify**: 코드에서 API 문서를 자동 생성합니다.
- **ChatGPT/Claude**: "이 함수용 유닛 테스트 작성해줘" 요청으로 초안을 만들 수 있습니다.

선택 시 고려할 점: 사용 중인 언어·프레임워크 지원, 비용(무료 한도), 코드가 외부로 전송되는지 여부입니다. [개발 도구 카테고리](/categories/coding-developer-tools)에서 더 많은 툴을 비교해 보세요.` },
  { slug: "ai-youtube-content-creation", title: "AI로 유튜브 콘텐츠 만드는 방법", category: "workflow", tags: ["유튜브", "영상", "자막"], read_time: 6, featured: false, content: `## 유튜브 제작에 활용하는 AI 툴

기획부터 편집·자막까지 유튜브 제작 단계별로 쓸 수 있는 AI를 소개합니다.

### 기획·스크립트
ChatGPT나 Claude에 "이 주제로 유튜브 스크립트 5분 분량으로 작성해줘. 도입부는 시선 잡는 문장으로."처럼 요청하세요. 타깃과 톤을 지정하면 더 맞는 초안이 나옵니다.

### 음성·나레이션
**ElevenLabs, Murf**: 스크립트를 넣으면 자연스러운 음성으로 변환해 줍니다. 여러 목소리와 언어를 선택할 수 있습니다.

### 영상 편집·자막
**Descript**: 음성 기반 편집으로 말한 부분을 텍스트 수정만으로 고칠 수 있습니다. 자동 자막 생성도 가능합니다.
**Runway, Pictory**: 영상 자동 편집, 하이라이트 클립 생성, 자막 삽입을 지원합니다.

### 썸네일·자료
**Canva, Midjourney, DALL-E**: 썸네일이나 B장 이미지를 만들 때 활용하세요.

### 분석
**TubeBuddy, VidIQ**: 키워드·트렌드 분석으로 제목·태그 개선을 도와줍니다.

영상 한 편을 AI만으로 만들기보다, 기획·스크립트·자막은 AI로 하고 연출·편집 터치는 사람이 더하는 방식이 효율적입니다. [영상·오디오 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "ai-prompt-writing-tips", title: "AI 프롬프트 잘 쓰는 법", category: "prompt", tags: ["프롬프트", "팁", "한글"], read_time: 6, featured: true, content: `## 프롬프트만 바꿔도 결과가 달라집니다

같은 AI라도 지시가 구체적일수록 원하는 결과에 가깝게 나옵니다.

### 1. 역할·상황 지정
"당신은 10년 차 마케터입니다"처럼 역할을 주고, "신제품 런칭 카피를 써달라"고 하면 톤과 수준이 달라집니다.

### 2. 목적·형식 명시
"이메일 답장 초안"인지 "SNS 한 줄 카피 5개"인지, "표로 정리"인지 "불릿 3줄"인지 적어 주세요.

### 3. 제약·조건 넣기
"200자 이내", "초등학생도 이해할 수 있게", "비격식체"처럼 조건을 주면 불필요한 출력이 줄어듭니다.

### 4. 예시 한두 개 주기
"예: 이런 톤으로 → (예시 문장)"을 넣으면 스타일을 맞추기 쉽습니다.

### 5. 단계 나누기
한 번에 "기획부터 실행까지 다 해줘"보다는 "1단계: 목차만", "2단계: 1번만 상세히"처럼 나누어 요청하는 편이 낫습니다.

### 6. 반복 수정
첫 결과가 마음에 안 들면 "더 짧게", "두 번째 문장만 바꿔줘"처럼 구체적으로 피드백을 주세요.

한글 프롬프트도 대부분 잘 이해합니다. 다만 전문 용어나 숫자는 정확히 적는 것이 좋습니다. [AI 툴 비교](/tools)에서 다양한 도구를 확인해 보세요.` },
  { slug: "ai-workflow-automation", title: "AI 업무 자동화 워크플로우", category: "workflow", tags: ["자동화", "워크플로우", "생산성"], read_time: 7, featured: true, content: `## 반복 업무를 줄이는 AI 워크플로우

매일 똑같이 하던 작업을 AI와 단계를 정리해 두면 시간을 크게 아낄 수 있습니다.

### 이메일·문서
- 수신 메일을 복사해 ChatGPT/Claude에 넣고 "요약 + 답장 초안" 요청.
- Notion AI로 회의 노트를 요약·액션 아이템만 추출.

### 리서치·정리
- Perplexity에 질문을 넣고 "출처 링크 포함해서 요약해줘"로 자료 수집.
- 여러 문서를 한꺼번에 넣고 "공통점·차이점 표로 정리" 요청.

### 콘텐츠 배치
- 한 번 만든 카피를 "트위터용 280자", "인스타 캡션", "메일 제목"으로 각각 바꿔 달라고 요청.
- Canva에서 브랜드 컬러·폰트 저장 후 템플릿만 바꿔서 재사용.

### 개발·운영
- GitHub Copilot으로 보일러플레이트 작성, 테스트 케이스 초안 생성.
- "이 에러 로그 원인과 해결 방법 추천해줘"로 디버깅 시간 단축.

### 지속 개선
자주 쓰는 지시문(프롬프트)을 메모장이나 Notion에 저장해 두고, "이 형식으로 요청해줘"처럼 재사용하면 더 빠릅니다. [자동화·생산성 툴](/tools)에서 도구를 더 찾아볼 수 있습니다.` },
  { slug: "ai-ppt-presentation", title: "AI로 PPT 만드는 방법", category: "productivity", tags: ["PPT", "발표", "Gamma"], read_time: 5, featured: false, content: `## 발표 자료를 AI로 빠르게 만드는 법

텍스트만 있으면 슬라이드 초안이 나오는 툴들이 많아졌습니다.

### Gamma
주제와 개요를 입력하면 자동으로 슬라이드가 생성됩니다. 테마와 레이아웃을 고르고, 문구를 수정하면 됩니다. 무료 체험 가능.

### Beautiful.ai
템플릿 기반이지만 AI로 내용을 채워 넣을 수 있습니다. 차트·레이아웃이 자동 정렬되어 디자인이 깔끔합니다.

### Canva
"프레젠테이션" 템플릿을 고른 뒤, AI에 "이 주제로 10장 분량 초안 만들어줘"라고 요청한 내용을 복사해 넣으면 됩니다.

### ChatGPT + 수동 배치
ChatGPT에 "이 발표용 목차별로 슬라이드 한 장당 문장 3개씩 작성해줘"로 초안을 받고, PowerPoint나 Google 슬라이드에 붙여 넣는 방식도 가능합니다.

### 활용 팁
- 제목 슬라이드와 목차, 마무리 슬라이드는 공통 패턴이므로 한 번 만들어 두고 복제해 쓰세요.
- 숫자·그래프는 AI가 만들어 준 문장을 참고만 하고, 실제 데이터는 직접 넣는 것이 안전합니다.

[프레젠테이션·생산성 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "claude-long-document-summary", title: "Claude로 긴 문서 요약하는 워크플로우", category: "workflow", tags: ["Claude", "요약", "문서"], read_time: 4, featured: false, content: `## 긴 문서·논문을 Claude로 요약하기

Claude는 긴 컨텍스트를 잘 처리하므로, 보고서·논문·계약서 초안 요약에 적합합니다.

### 기본 절차
1. 문서 전체 또는 핵심 구간을 복사해 Claude 채팅창에 붙여넣습니다.
2. "3문단으로 요약해줘", "핵심 주장만 불릿으로", "의사결정에 필요한 부분만 추려줘"처럼 목적을 명시합니다.
3. 필요하면 "이 부분만 더 자세히 설명해줘"처럼 구간을 지정해 요청합니다.

### 활용 예
- **회의록**: 장문 회의록에서 결론·할 일·미결 사항만 추출.
- **논문**: 서론·방법·결과·한계를 각각 2~3줄로 요약.
- **RFP/제안서**: 요구사항 목록과 제안 포인트만 표로 정리.

### 주의사항
민감한 문서는 업로드·공유 정책을 확인한 뒤 사용하세요. 요약 결과도 사실 확인이 필요할 수 있습니다. [챗봇·LLM 툴](/tools)에서 Claude 등 대안을 비교해 보세요.` },
  { slug: "ai-copywriting-jasper-copyai", title: "광고 카피에 쓰는 AI: Jasper vs Copy.ai", category: "marketing", tags: ["카피", "광고", "Jasper"], read_time: 6, featured: false, content: `## 광고·마케팅 카피에 특화된 AI 툴

Jasper와 Copy.ai는 마케팅 카피·광고 문구 생성에 많이 쓰입니다.

### Jasper
- 브랜드 보이스 설정, 캠페인 유형(이메일, 소셜, 랜딩 등) 선택 가능.
- 팀 협업·워크플로우 기능이 있어 대량 제작 시 유리합니다.
- 무료 체험 후 유료 플랜.

### Copy.ai
- 무료 티어가 있어 소규모로 써보기 좋습니다.
- 이메일, SNS, 블로그 등 용도별 템플릿이 많습니다.
- 개별 문구보다는 여러 버전을 한 번에 받고 고르는 데 적합합니다.

### 선택 가이드
- 예산이 적으면 Copy.ai 무료로 시작하고, 팀·브랜드 기능이 필요하면 Jasper를 검토하세요.
- 둘 다 "타깃", "톤", "키 메시지"를 구체적으로 적을수록 결과가 좋아집니다.

[마케팅 툴](/categories/marketing)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "figma-ai-design-tips", title: "Figma AI 플러그인으로 디자인 속도 올리기", category: "design", tags: ["Figma", "디자인", "AI"], read_time: 5, featured: false, content: `## Figma에서 쓸 수 있는 AI 플러그인

Figma는 플러그인으로 AI 기능을 확장할 수 있습니다.

### 자주 쓰는 유형
- **텍스트 생성**: 프롬프트로 더미 텍스트·헤드라인 생성.
- **이미지 생성**: DALL-E 등 연동 플러그인으로 배경·아이콘 생성.
- **레이아웃 제안**: 선택한 컴포넌트를 바탕으로 레이아웃 변형 제안.
- **번역**: 화면 내 텍스트를 다국어로 번역해 주는 플러그인.

### 활용 팁
- 디자인 시스템이 있으면 "이 스타일 가이드에 맞게 버튼 5종 만들어줘"처럼 요청하면 일관성이 유지됩니다.
- 초안은 AI로 만들고, 픽셀 단위 조정과 접근성은 사람이 점검하는 것이 좋습니다.

[디자인 툴](/categories/design)에서 Figma 외 AI 디자인 툴을 더 볼 수 있습니다.` },
  { slug: "github-copilot-tips", title: "GitHub Copilot 실전 활용 팁", category: "development", tags: ["Copilot", "GitHub", "코딩"], read_time: 6, featured: false, content: `## GitHub Copilot으로 코딩 속도 높이기

Copilot은 코드 컨텍스트를 읽고 다음 줄이나 함수를 제안합니다.

### 잘 쓰는 법
- **주석으로 의도 적기**: "// 사용자 이메일로 로그인 검증"처럼 한 줄만 적어도 구현 제안이 나옵니다.
- **함수명·변수명을 명확히**: 이름만으로도 제안 품질이 달라집니다.
- **반복 패턴은 한 번 보여주기**: 비슷한 코드가 있으면 그 스타일로 이어서 제안합니다.

### 활용 예
- 보일러플레이트(API 호출, 테스트 케이스) 작성.
- 에러 처리 패턴, 로깅 코드 추가.
- 다른 언어로 같은 로직 번역("이걸 파이썬으로 바꿔줘").

### 주의
제안된 코드는 반드시 읽고, 보안·성능을 확인한 뒤 사용하세요. 비공개 코드는 사용 정책을 확인합니다. [개발자 도구](/categories/coding-developer-tools)에서 다른 AI 코딩 툴도 비교해 보세요.` },
  { slug: "image-ai-prompt-examples", title: "이미지 생성 AI 프롬프트 예시 20선", category: "prompt", tags: ["이미지", "프롬프트", "Midjourney"], read_time: 8, featured: false, content: `## 이미지 생성 결과를 좋게 하는 프롬프트 예시

스타일·구도·분위기를 키워드로 넣으면 원하는 이미지에 가깝게 나옵니다.

### 포트레이트
"professional headshot, soft lighting, neutral background, 35mm lens"
"일러스트 스타일, 부드러운 색감, 여성 실루엣, 단색 배경"

### 제품·브랜드
"product photography, white background, clean minimal, high resolution"
"패키지 디자인 목업, 상단 뷰, 자연광"

### 배경·분위기
"cozy cafe interior, warm lighting, morning, shallow depth of field"
"미니멀 오피스, 큰 창문, 식물, 북유럽 스타일"

### 일러스트
"flat design illustration, pastel colors, 2D character"
"디지털 아트, 사이버펑크, 네온 조명"

### 공통 팁
- "high quality, 4k, detailed" 같은 품질 키워드를 뒤에 붙이면 해상도·디테일이 좋아지는 경우가 많습니다.
- 툴마다 문법이 다르므로(Midjourney는 /imagine, DALL-E는 문장) 각 툴 가이드를 참고하세요.

[이미지 생성 툴](/categories/image-generation)에서 다양한 서비스를 비교할 수 있습니다.` },
  { slug: "korean-ai-customer-service", title: "한국어 AI 챗봇 활용: 고객 응대 자동화", category: "local-case", tags: ["한국어", "챗봇", "고객응대"], read_time: 6, featured: false, content: `## 한국어 AI 챗봇으로 고객 응대 자동화하기

국내 서비스에 한국어 AI 챗봇을 붙이면 FAQ·문의 1차 응대를 자동화할 수 있습니다.

### 도입 시 고려사항
- **한글 이해도**: 일부 모델은 한글보다 영어가 더 자연스러우므로, 한국어 전용 또는 다국어 지원이 잘 된 제품을 고르세요.
- **연동**: 챗봇 빌더가 카카오톡, 네이버 톡, 웹 위젯 등과 연동되는지 확인합니다.
- **에스컬레이션**: AI가 답하지 못하는 경우 상담원 연결·티켓 생성이 되는지 봅니다.

### 활용 예
- FAQ 자동 응답, 주문·배송 조회 안내.
- 상담 시간 외 문의 접수 및 다음 영업일 회신 안내.
- 간단한 견적·상품 추천 대화.

### 정리
핵심은 "자주 묻는 질문"을 정리해 넣고, 답변 초안을 AI로 만든 뒤 사람이 검수하는 것입니다. [챗봇·AI 툴](/tools)에서 한국어 지원 여부를 확인해 보세요.` },
  { slug: "meeting-summary-ai-tools", title: "회의 녹음·요약 AI 툴 비교: Otter vs Fireflies", category: "productivity", tags: ["회의", "요약", "녹음"], read_time: 5, featured: false, content: `## 회의 내용을 자동으로 정리해 주는 AI

Otter와 Fireflies는 회의 녹음·자동 필기·요약을 해 주는 대표 툴입니다.

### Otter.ai
- 실시간 자막·필기, Zoom/Meet 연동.
- 회의 후 요약·액션 아이템 자동 추출.
- 무료 플랜에서 월 일정 시간 제한.

### Fireflies.ai
- 회의 녹음·텍스트 변환·요약, CRM·슬랙 연동.
- 검색으로 "이 단어 나온 구간" 찾기 가능.
- 팀 단위 플랜이 있습니다.

### 선택 시 체크
- 사용하는 화상회의 도구와 연동되는지.
- 한국어 음성 인식 정확도(테스트 권장).
- 녹음 보관·삭제 정책과 개인정보 처리.

회의가 많다면 한 달 무료 체험으로 둘 다 써보고, 팀 협업 기능이 필요하면 유료 플랜을 비교해 보세요. [생산성·오디오 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "seo-content-ai-tools", title: "SEO 글쓰기를 위한 AI 도구 활용법", category: "marketing", tags: ["SEO", "글쓰기", "콘텐츠"], read_time: 6, featured: false, content: `## SEO 맞춤 콘텐츠를 AI로 보조하기

검색 유입을 노리는 글에는 키워드·구조·가독성이 중요합니다. AI로 초안을 만들고 사람이 다듬는 방식이 효율적입니다.

### 키워드·구조
- **Surfer SEO, Frase**: 타깃 키워드와 경쟁 글 분석으로 목차·헤딩 제안.
- **ChatGPT/Claude**: "이 키워드로 블로그 목차 만들어줘. H2, H3 포함." 요청.

### 본문 작성
- 키워드를 자연스럽게 넣은 문단을 섹션별로 요청하고, 중복·과도한 키워드 삽입은 피하세요.
- 메타 디스크립션·제목 변형은 "SEO용 3가지 버전 추천해줘"로 받을 수 있습니다.

### 점검
- AI가 만든 글은 독자성과 사실 관계를 반드시 확인합니다.
- 내부 링크·이미지 alt는 직접 넣는 것이 좋습니다.

[SEO·마케팅 툴](/tools)에서 관련 AI 툴을 더 찾아볼 수 있습니다.` },
  { slug: "v0-bolt-ui-prototype", title: "v0·Bolt로 UI 프로토타입 빠르게 만들기", category: "design", tags: ["v0", "UI", "프로토타입"], read_time: 5, featured: false, content: `## 프롬프트로 UI 초안을 만드는 툴

v0 (Vercel)와 Bolt (StackBlitz)는 텍스트 설명만으로 React 기반 UI 초안을 만들어 줍니다.

### v0
- "대시보드 사이드바 포함해서"처럼 설명하면 컴포넌트 코드가 나옵니다.
- shadcn/ui 스타일을 많이 사용해, 현대적인 UI가 빠르게 나옵니다.
- Next.js·React 프로젝트에 복사해 넣어 사용할 수 있습니다.

### Bolt
- StackBlitz 환경에서 동일하게 프롬프트로 UI를 생성합니다.
- 실시간 미리보기와 수정이 가능합니다.

### 활용
- 아이디어 단계에서 와이어프레임 대신 클릭 가능한 프로토타입을 빠르게 만들 때 유용합니다.
- 디자이너·개발자 간 소통용으로 "이런 화면"을 바로 보여줄 수 있습니다.

[디자인·개발 툴](/tools)에서 더 많은 옵션을 확인해 보세요.` },
  { slug: "ai-voice-synthesis-elevenlabs-murf", title: "AI 음성 합성 툴: ElevenLabs vs Murf 비교", category: "usage", tags: ["음성", "TTS", "ElevenLabs"], read_time: 5, featured: false, content: `## 자연스러운 AI 음성으로 콘텐츠 만들기

ElevenLabs와 Murf는 유료·무료 옵션이 있는 대표 TTS(음성 합성) 서비스입니다.

### ElevenLabs
- 음질·감정 표현이 뛰어나 게임·영상 더빙에 많이 쓰입니다.
- 무료 티어(월 일정 글자 수), 유료로 더 많은 양과 목소리 선택.
- 한글 지원이 강화되고 있습니다.

### Murf
- 비즈니스·교육·유튜브용 목소리가 많습니다.
- 비디오·슬라이드에 음성 삽입하는 워크플로우가 편합니다.
- 무료 체험 후 유료 플랜.

### 선택 가이드
- 예산이 적으면 ElevenLabs 무료로 시작해 보시고, 상업용·대량 제작이 필요하면 Murf 포함 유료 플랜을 비교하세요.
- 사용할 언어(한글/영어) 지원 수준을 반드시 확인하세요.

[오디오·음성 툴](/categories/audio-voice)에서 더 많은 서비스를 비교할 수 있습니다.` },
  { slug: "ai-tools-by-role", title: "업무별 AI 툴 스택 추천: 마케팅·개발·디자인", category: "workflow", tags: ["스택", "업무별", "추천"], read_time: 7, featured: true, content: `## 직무별로 골라 쓰는 AI 툴

역할마다 자주 쓰는 툴 조합을 정리했습니다.

### 마케팅
- 카피: Jasper, Copy.ai / ChatGPT
- 이미지: Canva, Midjourney, DALL-E
- SEO: Surfer, Frase
- 메일·캠페인: Mailchimp, HubSpot

### 개발
- 코드: GitHub Copilot, Cursor, Phind
- 문서: Mintlify, ChatGPT
- 리뷰: CodeRabbit

### 디자인
- UI 초안: v0, Bolt
- 이미지·아이콘: Midjourney, DALL-E, Canva
- 편집: Figma + AI 플러그인

### 공통
- 문서·요약: ChatGPT, Claude, Notion AI
- 리서치: Perplexity

한두 개씩 익혀 두고, [AI 툴 전체 목록](/tools)에서 카테고리별로 더 찾아보세요.` },
  { slug: "free-ai-tools-starter", title: "무료로 시작하는 AI 툴 15선", category: "usage", tags: ["무료", "시작", "추천"], read_time: 8, featured: true, content: `## 비용 없이 써볼 수 있는 AI 툴

유료 전환 없이도 꽤 쓸 만한 무료 옵션들이 많습니다.

### 챗봇·대화
- ChatGPT (무료 버전), Google Gemini, Claude – 일일 제한 내에서 사용.
- Poe – 여러 모델을 한 앱에서.

### 이미지
- Microsoft Designer(Bing), Craiyon – 완전 무료.
- Leonardo.Ai, Playground – 일일 크레딧 무료.

### 글쓰기·생산성
- Notion AI (제한적 무료), Google Docs 기반 도구.
- Grammarly 무료 버전 – 문법·맞춤법.

### 개발
- GitHub Copilot (학생/오픈소스 무료), Amazon CodeWhisperer 무료 티어.
- Phind, ChatGPT – 코드 질의.

### 음성·영상
- ElevenLabs 무료 글자 수, Descript 무료 티어.

무료 한도(일일/월간)와 상업적 이용 가능 여부를 각 서비스에서 확인하세요. [무료 툴 모음](/pricing/free)에서 더 볼 수 있습니다.` },
  { slug: "ai-video-subtitle-edit", title: "영상 자막·편집 AI: Descript, Runway 활용", category: "workflow", tags: ["영상", "자막", "편집"], read_time: 6, featured: false, content: `## 영상 편집을 가속하는 AI 툴

Descript와 Runway는 영상 제작·편집 단계에서 자주 쓰입니다.

### Descript
- 음성→텍스트 자동 전사, 텍스트 수정만으로 영상 편집(말 잘라내기 등).
- 더빙·음성 클론으로 수정 구간만 다시 녹음하는 것처럼 처리 가능.
- 팟캐스트·유튜브 편집에 적합합니다.

### Runway
- 영상 내 객체 제거, 배경 변경, 자동 자막 삽입.
- 텍스트→영상 생성 등 창작 단계에도 쓸 수 있습니다.

### 활용 팁
- 자막은 한 번 생성 후 구간별로만 수정하면 시간을 많이 줄일 수 있습니다.
- 상업용 이용 시 각 서비스 라이선스를 확인하세요.

[영상 생성·편집 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "ai-translation-quality", title: "번역 품질 높이는 AI 툴 활용법", category: "usage", tags: ["번역", "DeepL", "품질"], read_time: 4, featured: false, content: `## AI로 번역 품질 올리기

기계 번역을 그대로 쓰기보다, 도구와 단계를 정리하면 자연스러운 결과를 얻을 수 있습니다.

### 추천 툴
- **DeepL**: 문맥·어감이 자연스러워 비즈니스 문서에 많이 쓰입니다.
- **Google 번역**: 다양한 언어·대량 텍스트에 무료로 쓸 수 있습니다.
- **ChatGPT/Claude**: "이 문장을 한국어로 번역해줘. 비격식체로."처럼 톤 지정이 가능합니다.

### 품질 올리는 법
- 전문 용어는 처음 한 번 맞춰 두고 동일하게 사용.
- 문단 단위로 번역한 뒤, 전체 흐름을 한 번 더 읽고 다듬기.
- "고객 대상 공식 문서 톤으로"처럼 용도와 타깃을 지정해 요청하세요.

[번역·언어 툴](/tools)에서 관련 서비스를 더 찾아볼 수 있습니다.` },
  { slug: "korean-company-chatgpt-case", title: "국내 기업 ChatGPT 업무 도입 사례", category: "local-case", tags: ["ChatGPT", "국내", "도입"], read_time: 6, featured: false, content: `## 국내에서 ChatGPT를 업무에 쓰는 사례

많은 기업이 내부 업무 보조·고객 응대 보조에 ChatGPT를 도입하고 있습니다.

### 자주 쓰는 용도
- 이메일·보고서 초안 작성, 회의록 요약.
- 제안서·계약서 초안 검토(비공개 정보 제외).
- 개발·마케팅 팀의 아이디어 스케치·키워드 연구.

### 도입 시 점검
- 업무용으로 쓸 때는 ChatGPT Team/Enterprise처럼 데이터가 학습에 쓰이지 않는 플랜을 검토하세요.
- 내부 가이드라인(어떤 문서를 넣지 말지, 결과 검수 절차)을 정해 두는 것이 좋습니다.

### 정리
"비공개 정보는 넣지 않기", "결과는 반드시 사람이 확인"을 원칙으로 두면 리스크를 줄일 수 있습니다. [챗봇·LLM 툴](/tools)에서 다른 옵션도 비교해 보세요.` },
  { slug: "prompt-library-reuse", title: "프롬프트 라이브러리 만들어 재사용하기", category: "prompt", tags: ["프롬프트", "라이브러리", "재사용"], read_time: 5, featured: false, content: `## 자주 쓰는 프롬프트를 모아 두기

같은 유형의 작업은 프롬프트를 저장해 두고 변수만 바꿔 쓰면 효율이 올라갑니다.

### 저장 위치
- Notion, Google Docs: 제목으로 구분해 두고 복사해 쓰기.
- Cursor/IDE 스니펫: 코드 생성용 프롬프트를 저장.
- 텍스트 확장 도구(Raycast, Alfred 등): 단축어로 불러오기.

### 예시
- "다음 이메일에 공손한 답장 초안 작성: [메일 본문]"
- "이 코드에 한글 주석 달아줘: [코드]"
- "아래 내용 3줄 요약: [본문]"

### 활용
- 팀에서 공유하면 톤·형식이 통일됩니다.
- 주기적으로 결과를 보고 "이 버전이 더 좋다"면 프롬프트를 업데이트하세요.

[AI 툴](/tools)에서 다양한 도구를 확인할 수 있습니다.` },
  { slug: "designer-ai-image-icon-tools", title: "디자이너를 위한 AI 이미지·아이콘 툴", category: "design", tags: ["디자인", "이미지", "아이콘"], read_time: 6, featured: false, content: `## 디자인 작업에 쓰는 AI 이미지·아이콘 도구

배경, 일러스트, 아이콘을 AI로 만들면 초안 단계가 빨라집니다.

### 이미지 생성
- **Midjourney, DALL-E**: 분위기·스타일 지정에 강합니다.
- **Leonardo**: 게임·캐릭터 아트에 적합.
- **Canva AI**: 템플릿 안에서 이미지 생성·교체.

### 아이콘·그래픽
- **Iconify, Phosphor**: 무료 아이콘 세트 (AI는 아님).
- **Midjourney/DALL-E**: "flat icon set, 10 icons, blue theme"처럼 세트 단위 생성 가능.

### 워크플로우
- 레퍼런스 이미지를 프롬프트에 함께 넣거나, "이 이미지 스타일로 비슷하게" 요청.
- 상업적 이용 가능 여부와 라이선스를 각 툴에서 확인하세요.

[디자인·이미지 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "weekly-ai-tools-picks", title: "주간 AI 툴 추천: 이번 주 주목할 서비스", category: "usage", tags: ["주간", "추천", "신규"], read_time: 4, featured: true, content: `## 이번 주 주목할 AI 툴

매주 새로 나오거나 업데이트된 AI 서비스 중에서 눈에 띄는 것을 짧게 소개합니다.

### 확인 방법
- [AI 툴 전체 목록](/tools)에서 "최신순"으로 정렬해 보세요.
- [새로 추가된 툴](/tools?sort=new) 섹션에서 최근 등록된 서비스를 볼 수 있습니다.

### 활용 팁
- 무료 체험이 있는 툴은 한 번씩 써보고, 팀 업무에 맞는지 검토해 보세요.
- 카테고리·가격 필터로 "무료", "이미지 생성"처럼 조건을 걸어 찾을 수 있습니다.

정기적으로 [AI 툴 올인원](/tools)을 방문해 새 툴과 업데이트 소식을 확인해 보시기 바랍니다.` },
  { slug: "ai-code-review-refactor", title: "코드 리뷰·리팩터링에 쓰는 AI 도구", category: "development", tags: ["코드리뷰", "리팩터링", "AI"], read_time: 5, featured: false, content: `## 리뷰와 리팩터링을 AI로 보조하기

PR 리뷰나 레거시 코드 정리를 AI가 도와주면 일정을 줄일 수 있습니다.

### 리뷰
- **CodeRabbit, Sourcery**: PR에 코멘트와 개선 제안을 자동으로 달아 줍니다.
- **ChatGPT/Claude**: "이 diff 리뷰해줘. 보안·성능 위주로." 요청.

### 리팩터링
- **Cursor**: 코드베이스 전체를 참고해 "이 함수 리팩터링해줘" 요청 가능.
- **Copilot**: 반복 패턴을 바꿀 때 제안을 받을 수 있습니다.

### 주의
제안된 변경은 반드시 사람이 검토한 뒤 머지하세요. 테스트와 린트도 다시 돌리는 것이 안전합니다. [개발자 도구](/categories/coding-developer-tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "email-automation-workflow", title: "이메일 작성·답장 자동화 워크플로우", category: "workflow", tags: ["이메일", "자동화", "워크플로우"], read_time: 5, featured: false, content: `## 이메일 업무를 AI로 가속하기

받은 메일 답장, 발신 초안을 반자동으로 처리하는 방법입니다.

### 기본 흐름
1. 받은 메일 본문을 복사해 ChatGPT/Claude에 붙여넣기.
2. "공손한 답장 초안", "거절 메일 톤으로", "2문장으로 요약해서 답장"처럼 지시.
3. 나온 초안을 복사해 메일 클라이언트에 붙이고, 받는 사람·첨부만 확인해 발송.

### 활용
- Gmail·Outlook에서는 별도 자동화 없이 수동 복사로도 충분히 시간을 줄일 수 있습니다.
- Zapier·Make로 "특정 라벨 메일 → AI 요약 → 슬랙 전송" 같은 플로우를 만들 수 있습니다.

### 주의
민감한 내용·개인정보가 포함된 메일은 AI에 넣지 않도록 가이드라인을 정해 두세요. [생산성 툴](/tools)에서 연동 가능한 도구를 더 찾아볼 수 있습니다.` },
  { slug: "sns-content-ai-tools", title: "SNS 콘텐츠 제작에 활용하는 AI 툴", category: "marketing", tags: ["SNS", "콘텐츠", "소셜"], read_time: 5, featured: false, content: `## SNS 포스팅을 AI로 빠르게 만들기

캡션, 해시태그, 이미지까지 한 번에 준비할 수 있습니다.

### 텍스트
- **Jasper, Copy.ai**: 플랫폼별(인스타, 트위터 등) 길이와 톤에 맞춰 여러 버전 생성.
- **ChatGPT**: "이 제품으로 인스타 캡션 5개, 해시태그 포함" 요청.

### 이미지
- **Canva**: 템플릿 + AI 이미지로 소셜 사이즈 자동 맞춤.
- **Midjourney, DALL-E**: 피드용 일러스트·배경 생성.

### 일괄 제작
- 한 주제로 "트위터용 280자", "인스타 캡션", "링크드인 요약"을 동시에 요청해 두고 골라 쓰면 효율적입니다.

[마케팅·소셜 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
  { slug: "research-ai-perplexity-elicit", title: "연구·리서치용 AI: Perplexity, Elicit 활용", category: "productivity", tags: ["리서치", "Perplexity", "논문"], read_time: 6, featured: false, content: `## 리서치와 논문 조사를 AI로 보조하기

Perplexity와 Elicit은 출처가 있는 답변·논문 요약에 강합니다.

### Perplexity
- 질문을 넣으면 웹 검색 결과를 반영한 답변과 출처 링크를 제공합니다.
- "최근 1년 논문 기준으로 요약해줘"처럼 조건을 줄 수 있습니다.

### Elicit
- 논문 검색·요약·핵심 주장 추출에 특화되어 있습니다.
- "이 주제 관련 논문 10편 요약해줘"로 리터처 리뷰 초안을 도와받을 수 있습니다.

### 활용 팁
- 답변만 믿지 말고, 제시된 링크를 열어 원문을 확인하세요.
- 인용이 필요하면 형식(APA, MLA 등)을 지정해 요청할 수 있습니다.

[리서치·생산성 툴](/tools)에서 더 많은 옵션을 확인할 수 있습니다.` },
];

const categoryNames = { usage: "사용법", workflow: "워크플로우", prompt: "프롬프트", "local-case": "국내 사례", productivity: "생산성", marketing: "마케팅", development: "개발", design: "디자인" };

const now = new Date();
const articles = ARTICLES.map((a, i) => {
  const published = new Date(now);
  published.setDate(published.getDate() - (ARTICLES.length - i));
  const excerpt = a.content.split("\n").filter((l) => l.trim()).slice(0, 3).join(" ").replace(/##?/g, "").trim().slice(0, 160) + "…";
  return {
    id: String(i + 1),
    slug: a.slug,
    title: a.title,
    excerpt,
    content: a.content,
    category: a.category,
    tags: a.tags,
    cover_image: COVERS[i % COVERS.length],
    published_at: published.toISOString().slice(0, 10),
    read_time: a.read_time,
    featured: a.featured || false,
  };
});

const outDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "articles.json"), JSON.stringify(articles, null, 2), "utf-8");
console.log(`Wrote ${articles.length} articles to data/articles.json`);
