/**
 * 모든 툴의 description을 2문단 이상으로 확장하고,
 * features, use_cases, pros, cons가 비어 있으면 카테고리 기본값으로 채웁니다.
 * Run: node scripts/enrich-tool-descriptions.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TOOLS_PATH = path.join(ROOT, "data", "tools.json");

const FEATURES_BY_CATEGORY = {
  "chatbot-llm": ["문서 요약", "다국어 번역", "코딩 보조", "브레인스토밍", "질의응답", "초안 작성", "대화형 인터페이스", "컨텍스트 이해"],
  "image-generation": ["텍스트→이미지 생성", "스타일 조정", "해상도 업스케일", "이미지 편집", "배치 생성", "프롬프트 가이드", "상업적 이용", "API 연동"],
  "video-generation": ["텍스트/이미지→영상", "자동 자막", "영상 편집", "템플릿 라이브러리", "음성 오버", "해상도 옵션", "소셜 포맷 출력", "협업 기능"],
  "audio-voice": ["TTS 음성 합성", "음성 클론", "다국어 지원", "감정/톤 조절", "STT 음성 인식", "오디오 편집", "API 제공", "배치 처리"],
  writing: ["카피 작성", "문법·톤 교정", "요약·확장", "다국어 작성", "SEO 최적화", "템플릿 활용", "브랜드 음성 유지", "협업·버전 관리"],
  productivity: ["메모·노트 정리", "할 일 관리", "회의 요약", "일정 연동", "검색·태그", "템플릿", "알림·리마인더", "팀 공유"],
  coding: ["코드 자동완성", "코드 생성", "리팩터링 제안", "버그 탐지", "문서화 생성", "다국어 지원", "IDE 연동", "API 문서 검색"],
  design: ["UI 컴포넌트 생성", "로고·아이콘", "색상·타이포 추천", "반응형 레이아웃", "디자인 시스템", "프로토타입", "협업·피드백", "에셋 내보내기"],
  marketing: ["광고 카피", "캠페인 아이디어", "타겟 분석", "A/B 테스트 문구", "소셜 포스트", "이메일 제목", "랜딩페이지 카피", "성과 예측"],
  seo: ["키워드 리서치", "메타 태그 제안", "내용 최적화", "경쟁 분석", "백링크 아이디어", "로컬 SEO", "보고서 생성", "순위 추적"],
  "data-analytics": ["데이터 시각화", "자연어 질의", "예측·트렌드", "대시보드", "자동 인사이트", "보고서 생성", "연동·ETL", "알림·임계값"],
  research: ["논문 검색·요약", "인용 분석", "관련 연구 매핑", "팩트 체크", "출처 정리", "메타 분석 보조", "용어 정의", "타임라인 정리"],
  education: ["개념 설명", "퀴즈 생성", "학습 경로 추천", "요약·플래시카드", "다국어 학습", "적응형 난이도", "진도 추적", "과제 피드백"],
  automation: ["워크플로우 설계", "앱 간 연동", "트리거·스케줄", "조건 분기", "데이터 변환", "알림", "로그·모니터링", "템플릿 라이브러리"],
  "no-code": ["드래그 앤 드롭 빌더", "DB·폼 연동", "인증·권한", "배포·호스팅", "템플릿", "API 연동", "반응형", "버전 관리"],
  "3d-gaming": ["3D 모델 생성", "텍스처·머티리얼", "애니메이션", "씬 구성", "에셋 최적화", "게임 엔진 연동", "VR/AR 지원", "협업"],
  business: ["영업 대화 분석", "리드 스코어링", "예측·파이프라인", "CRM 연동", "리포트 자동화", "이메일 추천", "미팅 요약", "KPI 대시보드"],
  translation: ["다국어 번역", "문맥 반영", "용어집", "로컬라이제이션", "배치 번역", "API", "품질 검수 보조", "포맷 유지"],
  presentation: ["슬라이드 자동 생성", "템플릿 추천", "차트·다이어그램", "일관된 디자인", "발표 노트", "협업·코멘트", "내보내기", "애니메이션"],
  "social-media": ["포스트 작성", "해시태그 제안", "스케줄링", "캘린더 뷰", "분석·인사이트", "멀티 채널", "이미지 제안", "A/B 테스트"],
};

const DESCRIPTION_EXPANSION_BY_CATEGORY = {
  "chatbot-llm": "개인 업무 요약·이메일 초안부터 팀 리서치, 코딩 보조까지 다양한 용도로 쓸 수 있습니다. 무료 한도와 유료 플랜 차이는 공식 사이트에서 확인하는 것이 좋습니다.",
  "image-generation": "썸네일, 마케팅 소재, 콘셉트 아트, SNS 이미지 등에 활용할 수 있습니다. 무료 크레딧 한도와 상업적 이용·저작권 조건은 서비스마다 다르니 공식 페이지를 꼭 확인하세요.",
  "video-generation": "숏폼, 유튜브, 광고 영상, 강의 영상 등 제작 시간을 줄이는 데 도움이 됩니다. 출력 해상도·저작권·상업 이용 조건은 플랜별로 확인하세요.",
  "audio-voice": "팟캐스트, 유튜브 나레이션, 고객 안내 음성, 다국어 더빙 등에 쓰입니다. 무료 티어 한도와 상업적 사용 가능 여부는 공식 사이트에서 확인하세요.",
  writing: "블로그, 광고 카피, 이메일, 보고서 초안 등을 빠르게 만들 때 유용합니다. 톤·브랜드 가이드를 지정하면 결과 품질이 좋아집니다.",
  productivity: "회의 메모, 할 일 정리, 일정 조율, 팀 공유까지 업무 흐름에 맞게 붙여 쓰면 효율이 올라갑니다. 연동 가능한 앱은 공식 문서를 참고하세요.",
  coding: "보일러플레이트 작성, 리팩터링, 버그 원인 추정, 테스트·문서 초안 등에 활용할 수 있습니다. 사내 코드 정책(외부 전송 여부)을 확인한 뒤 도입하세요.",
  design: "UI 목업, 로고·아이콘 초안, 색상·타이포 제안, 프로토타입 등을 빠르게 만들 때 쓰입니다. 실제 디자인 시스템과 맞추려면 출력을 한 번 다듬는 것이 좋습니다.",
  marketing: "광고 문구, 소셜 캡션, 이메일 제목, 랜딩 카피 등 여러 버전을 빠르게 뽑을 때 유리합니다. 타깃과 톤을 구체적으로 주면 품질이 좋아집니다.",
  seo: "키워드 리서치, 메타 태그·제목 제안, 본문 구조 잡기에 도움이 됩니다. 최종 반영 전 검색량·경쟁도는 별도 도구로 한 번 더 확인하세요.",
  research: "논문 검색·요약, 인용 정리, 리터처 리뷰 초안에 활용할 수 있습니다. 인용 형식과 사실 관계는 사람이 최종 확인하는 것이 안전합니다.",
  education: "개념 설명, 퀴즈·플래시카드 생성, 학습 경로 제안 등에 쓸 수 있습니다. 시험·과제 답은 직접 작성하는 것이 원칙입니다.",
  "no-code": "앱·웹 프로토타입을 코드 없이 빠르게 만들 때 유용합니다. 배포·도메인·결제 연동 등은 플랜별로 지원 범위가 다르니 확인하세요.",
  business: "영업·마케팅 자동화, 리드 정리, 리포트 생성 등에 활용할 수 있습니다. 기존 CRM·메일과 연동 가능 여부는 공식 사이트에서 확인하세요.",
  presentation: "슬라이드 초안·레이아웃을 빠르게 만들 때 쓰입니다. 숫자·차트는 실제 데이터로 반드시 교체하세요.",
  "social-media": "포스트 초안, 해시태그 제안, 스케줄링, 간단한 분석까지 SNS 운영을 한 곳에서 돌릴 때 유용합니다. 채널별 연동은 플랜을 확인하세요.",
};

const DEFAULT_FEATURES = ["AI 기반 자동화", "직관적인 인터페이스", "다양한 템플릿", "협업 기능", "API·연동", "보고서·분석", "맞춤 설정", "지속 업데이트"];
const DEFAULT_USE_CASES = ["[일반] 일상 질의응답", "[일반] 문서 요약", "[마케터] 광고 카피 작성", "[개발자] 코드 생성·보조", "[디자이너] 이미지·아이콘 제작", "[학생] 개념 정리"];
const DEFAULT_PROS = ["사용이 쉽고 학습 곡선이 낮음", "다양한 용도로 활용 가능", "정기적인 업데이트와 신기능", "무료 플랜 또는 체험 제공", "API·연동 옵션 제공"];
const DEFAULT_CONS = ["유료 플랜이 비쌀 수 있음", "고급 기능은 제한적일 수 있음", "인터넷 연결 필요", "특정 언어·지역 제한 가능"];

const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, "utf8"));
let expanded = 0;
let featuresAdded = 0;
let useCasesAdded = 0;
let prosConsAdded = 0;

tools.forEach((t) => {
  const cat = t.category || "chatbot-llm";
  const expansion = DESCRIPTION_EXPANSION_BY_CATEGORY[cat] || "공식 사이트에서 최신 기능·가격·한도를 확인하세요.";
  const desc = (t.description || "").trim();
  if (desc.length > 0 && desc.length < 200 && !desc.includes("\n\n")) {
    t.description = desc + "\n\n" + expansion;
    t.short_description = (t.short_description || desc).length > 120 ? (t.short_description || desc).slice(0, 117) + "…" : (t.short_description || desc);
    expanded++;
  }
  if (!t.features || t.features.length < 5) {
    t.features = FEATURES_BY_CATEGORY[cat] ? FEATURES_BY_CATEGORY[cat].slice(0, 8) : DEFAULT_FEATURES;
    featuresAdded++;
  }
  if (!t.use_cases || t.use_cases.length < 4) {
    t.use_cases = DEFAULT_USE_CASES.slice(0, 6);
    useCasesAdded++;
  }
  if (!t.pros || t.pros.length < 3) {
    t.pros = [...(t.korean_support ? ["한국어를 공식 지원"] : []), ...(t.pricing === "무료" || t.pricing === "무료+유료" ? ["무료로 시작 가능"] : []), ...DEFAULT_PROS].slice(0, 6);
    prosConsAdded++;
  }
  if (!t.cons || t.cons.length < 2) {
    t.cons = DEFAULT_CONS.slice(0, 4);
    prosConsAdded++;
  }
});

fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2), "utf8");
console.log("Enrich done. Expanded description:", expanded, "| Features added:", featuresAdded, "| Use cases:", useCasesAdded, "| Pros/cons:", prosConsAdded);
