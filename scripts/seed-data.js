/**
 * Seed data: real AI tools only (no synthetic/placeholder entries).
 * Run: node scripts/seed-data.js
 * Output: data/tools.json
 */

const fs = require("fs");
const path = require("path");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "tool";
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Root domain for Clearbit (better logo availability). e.g. chat.openai.com → openai.com */
function getRootDomainForLogo(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    const parts = host.split(".");
    if (parts.length >= 3) {
      return parts.slice(-2).join(".");
    }
    return host;
  } catch {
    return "";
  }
}

const rawTools = [
  // Chatbot / LLM (25)
  { name: "ChatGPT", description: "OpenAI의 대화형 AI. 글쓰기, 요약, 코딩 보조, 번역 등 다양한 작업 지원.", category: "chatbot-llm", tags: ["대화", "글쓰기", "번역", "코딩"], pricing: "무료+유료", korean_support: true, website_url: "https://chat.openai.com", featured: true },
  { name: "Claude", description: "Anthropic의 AI 어시스턴트. 긴 문서 분석, 창작, 코딩에 강점.", category: "chatbot-llm", tags: ["대화", "문서", "코딩"], pricing: "무료+유료", korean_support: true, website_url: "https://claude.ai", featured: true },
  { name: "Google Gemini", description: "구글의 멀티모달 AI. 검색·Gmail·문서와 연동.", category: "chatbot-llm", tags: ["대화", "검색", "구글"], pricing: "무료+유료", korean_support: true, website_url: "https://gemini.google.com", featured: true },
  { name: "Perplexity AI", description: "검색 연동 AI. 출처가 포함된 답변으로 리서치에 유용.", category: "chatbot-llm", tags: ["검색", "리서치", "출처"], pricing: "무료+유료", korean_support: true, website_url: "https://perplexity.ai", featured: true },
  { name: "Microsoft Copilot", description: "MS 365 연동 AI 어시스턴트. Outlook, Word, Teams 통합.", category: "chatbot-llm", tags: ["오피스", "생산성", "Microsoft"], pricing: "무료+유료", korean_support: true, website_url: "https://copilot.microsoft.com", featured: true },
  { name: "Poe", description: "다양한 AI 모델을 한 곳에서 사용. ChatGPT, Claude, Gemini 등.", category: "chatbot-llm", tags: ["멀티모델", "챗봇"], pricing: "무료+유료", korean_support: true, website_url: "https://poe.com", featured: false },
  { name: "You.com", description: "검색 기반 AI. 실시간 정보와 소스 인용.", category: "chatbot-llm", tags: ["검색", "AI"], pricing: "무료+유료", korean_support: false, website_url: "https://you.com", featured: false },
  { name: "Hugging Chat", description: "Hugging Face의 오픈소스 LLM 챗봇. 다양한 모델 선택.", category: "chatbot-llm", tags: ["오픈소스", "LLM"], pricing: "무료", korean_support: false, website_url: "https://huggingface.co/chat", featured: false },
  { name: "Character.AI", description: "캐릭터와 대화하는 AI. 롤플레이, 창작.", category: "chatbot-llm", tags: ["캐릭터", "대화", "엔터테인먼트"], pricing: "무료+유료", korean_support: true, website_url: "https://character.ai", featured: false },
  { name: "Pi", description: "Inflection AI의 친근한 개인 어시스턴트.", category: "chatbot-llm", tags: ["대화", "어시스턴트"], pricing: "무료", korean_support: false, website_url: "https://pi.ai", featured: false },
  { name: "Grok", description: "xAI의 실시간 정보 연동 챗봇.", category: "chatbot-llm", tags: ["실시간", "X"], pricing: "유료", korean_support: false, website_url: "https://x.ai", featured: false },
  { name: "Mistral Chat", description: "Mistral AI 공식 챗봇. 빠른 추론과 다국어.", category: "chatbot-llm", tags: ["대화", "오픈소스"], pricing: "무료+유료", korean_support: true, website_url: "https://chat.mistral.ai", featured: false },
  { name: "Cohere Chat", description: "엔터프라이즈용 AI 대화. RAG, 커스텀 모델.", category: "chatbot-llm", tags: ["엔터프라이즈", "RAG"], pricing: "유료", korean_support: true, website_url: "https://cohere.com", featured: false },
  { name: "Writesonic", description: "마케팅·블로그용 AI 글쓰기. SEO 최적화.", category: "chatbot-llm", tags: ["글쓰기", "마케팅"], pricing: "무료+유료", korean_support: false, website_url: "https://writesonic.com", featured: false },
  { name: "Jasper", description: "브랜드 음성 맞춤 콘텐츠 생성. 마케팅 팀용.", category: "chatbot-llm", tags: ["마케팅", "브랜드"], pricing: "유료", korean_support: false, website_url: "https://jasper.ai", featured: false },
  { name: "Copy.ai", description: "광고 카피, 이메일, 소셜 포스트 생성.", category: "chatbot-llm", tags: ["카피", "마케팅"], pricing: "무료+유료", korean_support: true, website_url: "https://copy.ai", featured: false },
  { name: "Chatsonic", description: "실시간 검색 연동 AI 글쓰기 도구.", category: "chatbot-llm", tags: ["글쓰기", "검색"], pricing: "무료+유료", korean_support: false, website_url: "https://writesonic.com/chat", featured: false },
  { name: "Komo", description: "탐색·채팅·요약 통합 AI.", category: "chatbot-llm", tags: ["검색", "채팅"], pricing: "무료+유료", korean_support: true, website_url: "https://komo.ai", featured: false },
  { name: "Phind", description: "개발자용 AI 검색. 코드와 문서 검색.", category: "chatbot-llm", tags: ["개발", "검색", "코드"], pricing: "무료+유료", korean_support: false, website_url: "https://phind.com", featured: false },
  { name: "Cursor Composer", description: "코드 에디터 내 대화형 AI. 코드 생성·수정.", category: "chatbot-llm", tags: ["코딩", "IDE"], pricing: "무료+유료", korean_support: false, website_url: "https://cursor.com", featured: false },
  { name: "Bing Chat", description: "Bing 검색 연동 AI. Edge 통합.", category: "chatbot-llm", tags: ["검색", "Microsoft"], pricing: "무료", korean_support: true, website_url: "https://bing.com/chat", featured: false },
  { name: "Meta AI", description: "Meta의 AI 어시스턴트. WhatsApp, Instagram 연동.", category: "chatbot-llm", tags: ["소셜", "메신저"], pricing: "무료", korean_support: true, website_url: "https://meta.ai", featured: false },
  { name: "Groq", description: "초고속 LLM 추론 API. 저지연 채팅.", category: "chatbot-llm", tags: ["API", "속도"], pricing: "무료+유료", korean_support: false, website_url: "https://groq.com", featured: false },
  { name: "Together AI", description: "오픈소스 모델 API. 다양한 LLM 호스팅.", category: "chatbot-llm", tags: ["API", "오픈소스"], pricing: "유료", korean_support: false, website_url: "https://together.ai", featured: false },
  { name: "Replicate", description: "다양한 AI 모델 API. 이미지·음성·LLM.", category: "chatbot-llm", tags: ["API", "모델"], pricing: "무료+유료", korean_support: false, website_url: "https://replicate.com", featured: false },
  // Image Generation (18)
  { name: "Midjourney", description: "디스코드 기반 이미지 생성 AI. 예술·콘셉트 아트.", category: "image-generation", tags: ["이미지", "아트", "디자인"], pricing: "유료", korean_support: false, website_url: "https://midjourney.com", featured: true },
  { name: "DALL-E 3", description: "OpenAI 이미지 생성. ChatGPT 통합.", category: "image-generation", tags: ["이미지", "OpenAI"], pricing: "유료", korean_support: true, website_url: "https://openai.com/dall-e-3", featured: true },
  { name: "Stable Diffusion", description: "오픈소스 이미지 생성. 로컬·API·플러그인.", category: "image-generation", tags: ["이미지", "오픈소스"], pricing: "무료+유료", korean_support: false, website_url: "https://stability.ai", featured: true },
  { name: "Ideogram", description: "텍스트가 정확한 이미지 생성. 로고·포스터.", category: "image-generation", tags: ["이미지", "텍스트"], pricing: "무료+유료", korean_support: true, website_url: "https://ideogram.ai", featured: true },
  { name: "Leonardo.Ai", description: "게임·3D 에셋용 이미지 생성. 일관된 스타일.", category: "image-generation", tags: ["이미지", "게임", "3D"], pricing: "무료+유료", korean_support: false, website_url: "https://leonardo.ai", featured: true },
  { name: "Runway Gen-3", description: "이미지·영상 생성. AI 비디오 툴.", category: "image-generation", tags: ["이미지", "영상"], pricing: "유료", korean_support: false, website_url: "https://runwayml.com", featured: false },
  { name: "Adobe Firefly", description: "Adobe 크리에이티브 연동 이미지 생성.", category: "image-generation", tags: ["이미지", "Adobe", "디자인"], pricing: "무료+유료", korean_support: true, website_url: "https://firefly.adobe.com", featured: false },
  { name: "Canva AI", description: "Canva 내 이미지 생성·편집. 템플릿 연동.", category: "image-generation", tags: ["이미지", "디자인", "템플릿"], pricing: "무료+유료", korean_support: true, website_url: "https://canva.com", featured: false },
  { name: "Flux", description: "Black Forest Labs의 고품질 이미지 생성.", category: "image-generation", tags: ["이미지", "품질"], pricing: "무료+유료", korean_support: false, website_url: "https://blackforestlabs.ai", featured: false },
  { name: "Imagine Art", description: "모바일·웹 이미지 생성. 다양한 스타일.", category: "image-generation", tags: ["이미지", "모바일"], pricing: "무료+유료", korean_support: false, website_url: "https://imagine.art", featured: false },
  { name: "Lexica", description: "Stable Diffusion 검색·생성. 프롬프트 갤러리.", category: "image-generation", tags: ["이미지", "프롬프트"], pricing: "무료+유료", korean_support: false, website_url: "https://lexica.art", featured: false },
  { name: "Playground AI", description: "이미지 생성·편집. 필터·인페인팅.", category: "image-generation", tags: ["이미지", "편집"], pricing: "무료+유료", korean_support: false, website_url: "https://playground.com", featured: false },
  { name: "Krea", description: "실시간 AI 이미지 생성. 디자인 워크플로우.", category: "image-generation", tags: ["이미지", "실시간"], pricing: "무료+유료", korean_support: false, website_url: "https://krea.ai", featured: false },
  { name: "Recraft", description: "벡터·일러스트 생성. 브랜드 스타일.", category: "image-generation", tags: ["이미지", "벡터"], pricing: "무료+유료", korean_support: false, website_url: "https://recraft.ai", featured: false },
  { name: "Pebblely", description: "제품 사진 배경 생성. 이커머스용.", category: "image-generation", tags: ["이미지", "제품", "이커머스"], pricing: "무료+유료", korean_support: false, website_url: "https://pebblely.com", featured: false },
  { name: "PhotoRoom", description: "배경 제거·제품 이미지 AI.", category: "image-generation", tags: ["이미지", "배경제거"], pricing: "무료+유료", korean_support: true, website_url: "https://photoroom.com", featured: false },
  { name: "Luma Dream Machine", description: "이미지→영상 생성. 3D 시나리오.", category: "image-generation", tags: ["이미지", "영상"], pricing: "유료", korean_support: false, website_url: "https://lumalabs.ai", featured: false },
  { name: "Fal.ai", description: "다양한 이미지 모델 API. 플러그인.", category: "image-generation", tags: ["API", "이미지"], pricing: "무료+유료", korean_support: false, website_url: "https://fal.ai", featured: false },
  // Video Generation (12)
  { name: "Runway", description: "AI 영상 편집·생성. Gen-3 Alpha.", category: "video-generation", tags: ["영상", "편집", "생성"], pricing: "유료", korean_support: false, website_url: "https://runwayml.com", featured: true },
  { name: "Pika Labs", description: "텍스트·이미지에서 영상 생성.", category: "video-generation", tags: ["영상", "생성"], pricing: "무료+유료", korean_support: false, website_url: "https://pika.art", featured: true },
  { name: "Synthesia", description: "AI 아바타 영상. 강의·프레젠테이션.", category: "video-generation", tags: ["영상", "아바타", "교육"], pricing: "유료", korean_support: true, website_url: "https://synthesia.io", featured: true },
  { name: "Lumen5", description: "텍스트→영상. 뉴스·소셜 영상 자동 제작.", category: "video-generation", tags: ["영상", "마케팅"], pricing: "무료+유료", korean_support: true, website_url: "https://lumen5.com", featured: false },
  { name: "HeyGen", description: "AI 아바타·음성 클론. 다국어 영상.", category: "video-generation", tags: ["영상", "아바타", "음성"], pricing: "무료+유료", korean_support: true, website_url: "https://heygen.com", featured: false },
  { name: "Descript", description: "영상·팟캐스트 편집. 음성 클론, 자막.", category: "video-generation", tags: ["영상", "편집", "팟캐스트"], pricing: "무료+유료", korean_support: false, website_url: "https://descript.com", featured: false },
  { name: "Kapwing", description: "온라인 영상 편집. AI 자막·리사이즈.", category: "video-generation", tags: ["영상", "편집", "자막"], pricing: "무료+유료", korean_support: false, website_url: "https://kapwing.com", featured: false },
  { name: "InVideo", description: "템플릿 기반 AI 영상 제작.", category: "video-generation", tags: ["영상", "템플릿"], pricing: "무료+유료", korean_support: false, website_url: "https://invideo.io", featured: false },
  { name: "FlexClip", description: "AI 영상 제작·편집. 스톡 연동.", category: "video-generation", tags: ["영상", "편집"], pricing: "무료+유료", korean_support: false, website_url: "https://flexclip.com", featured: false },
  { name: "Creatomate", description: "자동화 영상 템플릿. API 연동.", category: "video-generation", tags: ["영상", "자동화"], pricing: "유료", korean_support: false, website_url: "https://creatomate.com", featured: false },
  { name: "Wisecut", description: "자동 편집·침묵 제거·자막.", category: "video-generation", tags: ["영상", "편집", "자막"], pricing: "무료+유료", korean_support: false, website_url: "https://wisecut.video", featured: false },
  { name: "Pictory", description: "블로그·스크립트→영상. 자동 편집.", category: "video-generation", tags: ["영상", "콘텐츠"], pricing: "유료", korean_support: false, website_url: "https://pictory.ai", featured: false },
  // Audio / Voice (10)
  { name: "ElevenLabs", description: "고품질 AI 음성 합성. 다국어·클론.", category: "audio-voice", tags: ["음성", "TTS", "클론"], pricing: "무료+유료", korean_support: true, website_url: "https://elevenlabs.io", featured: true },
  { name: "Murf", description: "AI 보이스 오버. 20+ 언어.", category: "audio-voice", tags: ["음성", "TTS"], pricing: "무료+유료", korean_support: true, website_url: "https://murf.ai", featured: false },
  { name: "Resemble AI", description: "음성 클론·커스텀 TTS.", category: "audio-voice", tags: ["음성", "클론"], pricing: "유료", korean_support: false, website_url: "https://resemble.ai", featured: false },
  { name: "Play.ht", description: "텍스트→음성. 자연스러운 발음.", category: "audio-voice", tags: ["음성", "TTS"], pricing: "무료+유료", korean_support: true, website_url: "https://play.ht", featured: false },
  { name: "Speechify", description: "텍스트 음성 변환. 오디오북·요약.", category: "audio-voice", tags: ["음성", "리딩"], pricing: "무료+유료", korean_support: true, website_url: "https://speechify.com", featured: false },
  { name: "Lovo", description: "AI 보이스·영상 더빙.", category: "audio-voice", tags: ["음성", "더빙"], pricing: "무료+유료", korean_support: true, website_url: "https://lovo.ai", featured: false },
  { name: "Descript Overdub", description: "음성 클론으로 더빙·수정.", category: "audio-voice", tags: ["음성", "편집"], pricing: "유료", korean_support: false, website_url: "https://descript.com", featured: false },
  { name: "Whisper", description: "OpenAI 음성 인식. 다국어 STT.", category: "audio-voice", tags: ["STT", "음성인식"], pricing: "무료+유료", korean_support: true, website_url: "https://openai.com/whisper", featured: false },
  { name: "AssemblyAI", description: "음성→텍스트 API. 실시간·배치.", category: "audio-voice", tags: ["STT", "API"], pricing: "유료", korean_support: true, website_url: "https://assemblyai.com", featured: false },
  { name: "Suno", description: "AI 음악·노래 생성.", category: "audio-voice", tags: ["음악", "생성"], pricing: "무료+유료", korean_support: false, website_url: "https://suno.com", featured: false },
  // Writing (15)
  { name: "Notion AI", description: "노션 내장 AI. 메모 요약, 초안, 번역.", category: "writing", tags: ["메모", "문서", "요약"], pricing: "무료+유료", korean_support: true, website_url: "https://notion.so", featured: true },
  { name: "Grammarly", description: "문법·톤 교정. AI 글쓰기 보조.", category: "writing", tags: ["문법", "교정", "영작"], pricing: "무료+유료", korean_support: true, website_url: "https://grammarly.com", featured: true },
  { name: "QuillBot", description: "패러프레이징·요약·문법 검사.", category: "writing", tags: ["요약", "패러프레이즈"], pricing: "무료+유료", korean_support: true, website_url: "https://quillbot.com", featured: false },
  { name: "Jasper", description: "마케팅·광고 카피 생성.", category: "writing", tags: ["카피", "마케팅"], pricing: "유료", korean_support: false, website_url: "https://jasper.ai", featured: false },
  { name: "Copy.ai", description: "이메일·광고·소셜 카피.", category: "writing", tags: ["카피", "이메일"], pricing: "무료+유료", korean_support: true, website_url: "https://copy.ai", featured: false },
  { name: "Writesonic", description: "블로그·랜딩페이지·SEO 글.", category: "writing", tags: ["SEO", "블로그"], pricing: "무료+유료", korean_support: false, website_url: "https://writesonic.com", featured: false },
  { name: "Rytr", description: "다양한 톤의 글쓰기. 30+ 언어.", category: "writing", tags: ["글쓰기", "다국어"], pricing: "무료+유료", korean_support: true, website_url: "https://rytr.me", featured: false },
  { name: "Wordtune", description: "문장 재작성·톤 조절.", category: "writing", tags: ["글쓰기", "교정"], pricing: "무료+유료", korean_support: true, website_url: "https://wordtune.com", featured: false },
  { name: "Simplified", description: "콘텐츠·디자인 올인원. 글+이미지.", category: "writing", tags: ["글쓰기", "디자인"], pricing: "무료+유료", korean_support: false, website_url: "https://simplified.com", featured: false },
  { name: "HyperWrite", description: "브라우저 확장 글쓰기 보조.", category: "writing", tags: ["글쓰기", "확장"], pricing: "무료+유료", korean_support: false, website_url: "https://hyperwrite.ai", featured: false },
  { name: "Sudowrite", description: "창작 글쓰기. 소설·스토리.", category: "writing", tags: ["창작", "소설"], pricing: "유료", korean_support: false, website_url: "https://sudowrite.com", featured: false },
  { name: "Writer", description: "기업용 글쓰기·가이드라인.", category: "writing", tags: ["기업", "스타일가이드"], pricing: "유료", korean_support: false, website_url: "https://writer.com", featured: false },
  { name: "Frase", description: "SEO 콘텐츠 작성·리서치.", category: "writing", tags: ["SEO", "리서치"], pricing: "유료", korean_support: false, website_url: "https://frase.io", featured: false },
  { name: "BlogSEO", description: "블로그 SEO 최적화 AI.", category: "writing", tags: ["SEO", "블로그"], pricing: "무료+유료", korean_support: false, website_url: "https://blogseo.ai", featured: false },
  { name: "Longshot", description: "블로그·팩트 체크 글쓰기.", category: "writing", tags: ["블로그", "팩트"], pricing: "무료+유료", korean_support: false, website_url: "https://longshot.ai", featured: false },
  // Productivity (12)
  { name: "Notion", description: "올인원 워크스페이스. AI 요약·작성.", category: "productivity", tags: ["메모", "위키", "프로젝트"], pricing: "무료+유료", korean_support: true, website_url: "https://notion.so", featured: true },
  { name: "Mem", description: "AI 메모·지식 관리. 자동 연결.", category: "productivity", tags: ["메모", "지식관리"], pricing: "무료+유료", korean_support: false, website_url: "https://mem.ai", featured: false },
  { name: "Otter.ai", description: "회의 녹음·자동 필기·요약.", category: "productivity", tags: ["회의", "필기", "요약"], pricing: "무료+유료", korean_support: true, website_url: "https://otter.ai", featured: true },
  { name: "Fireflies", description: "회의 녹음·트랜스크립트·요약.", category: "productivity", tags: ["회의", "녹음"], pricing: "무료+유료", korean_support: true, website_url: "https://fireflies.ai", featured: false },
  { name: "Reclaim", description: "캘린더·일정 AI 최적화.", category: "productivity", tags: ["캘린더", "일정"], pricing: "무료+유료", korean_support: false, website_url: "https://reclaim.ai", featured: false },
  { name: "Motion", description: "AI 일정·태스크 스케줄링.", category: "productivity", tags: ["일정", "태스크"], pricing: "유료", korean_support: false, website_url: "https://usemotion.com", featured: false },
  { name: "Todoist", description: "태스크 관리. AI 자연어 입력.", category: "productivity", tags: ["할일", "관리"], pricing: "무료+유료", korean_support: true, website_url: "https://todoist.com", featured: false },
  { name: "TickTick", description: "할일·캘린더·포모도로. AI 보조.", category: "productivity", tags: ["할일", "캘린더"], pricing: "무료+유료", korean_support: true, website_url: "https://ticktick.com", featured: false },
  { name: "Taskade", description: "AI 프로젝트·마인드맵·체크리스트.", category: "productivity", tags: ["프로젝트", "마인드맵"], pricing: "무료+유료", korean_support: false, website_url: "https://taskade.com", featured: false },
  { name: "Genei", description: "리서치·요약·노트. PDF 연동.", category: "productivity", tags: ["리서치", "요약"], pricing: "무료+유료", korean_support: false, website_url: "https://genei.io", featured: false },
  { name: "Bardeen", description: "브라우저 자동화. 워크플로우.", category: "productivity", tags: ["자동화", "브라우저"], pricing: "무료+유료", korean_support: false, website_url: "https://bardeen.ai", featured: false },
  { name: "Scribe", description: "프로세스 문서 자동 생성.", category: "productivity", tags: ["문서", "프로세스"], pricing: "무료+유료", korean_support: false, website_url: "https://scribehow.com", featured: false },
  // Coding (15)
  { name: "Cursor", description: "AI 코드 에디터. 자동완성·대화형 편집.", category: "coding", tags: ["IDE", "코딩"], pricing: "무료+유료", korean_support: false, website_url: "https://cursor.com", featured: true },
  { name: "GitHub Copilot", description: "코드 자동완성. VS Code 등 연동.", category: "coding", tags: ["자동완성", "GitHub"], pricing: "유료", korean_support: false, website_url: "https://github.com/features/copilot", featured: true },
  { name: "Replit Agent", description: "브라우저 IDE. AI 코드 생성·실행.", category: "coding", tags: ["IDE", "온라인"], pricing: "무료+유료", korean_support: false, website_url: "https://replit.com", featured: false },
  { name: "Codeium", description: "무료 코드 자동완성. 70+ 언어.", category: "coding", tags: ["자동완성", "무료"], pricing: "무료+유료", korean_support: false, website_url: "https://codeium.com", featured: false },
  { name: "Tabnine", description: "팀 코드 패턴 학습. 자동완성.", category: "coding", tags: ["자동완성", "팀"], pricing: "무료+유료", korean_support: false, website_url: "https://tabnine.com", featured: false },
  { name: "Amazon CodeWhisperer", description: "AWS 연동 코드 제안.", category: "coding", tags: ["AWS", "자동완성"], pricing: "무료+유료", korean_support: false, website_url: "https://aws.amazon.com/codewhisperer", featured: false },
  { name: "Sourcegraph Cody", description: "코드베이스 검색·질의.", category: "coding", tags: ["코드검색", "질의"], pricing: "무료+유료", korean_support: false, website_url: "https://sourcegraph.com/cody", featured: false },
  { name: "Windsurf", description: "AI 네이티브 코드 에디터.", category: "coding", tags: ["IDE", "AI"], pricing: "무료+유료", korean_support: false, website_url: "https://codeium.com/windsurf", featured: false },
  { name: "Bolt.new", description: "풀스택 앱 빠른 프로토타이핑.", category: "coding", tags: ["프로토타입", "풀스택"], pricing: "무료+유료", korean_support: false, website_url: "https://bolt.new", featured: false },
  { name: "v0 by Vercel", description: "UI 컴포넌트 생성. React·Tailwind.", category: "coding", tags: ["UI", "React"], pricing: "무료+유료", korean_support: false, website_url: "https://v0.dev", featured: false },
  { name: "Mintlify", description: "API 문서 자동 생성.", category: "coding", tags: ["문서", "API"], pricing: "무료+유료", korean_support: false, website_url: "https://mintlify.com", featured: false },
  { name: "Sweep", description: "GitHub 이슈→PR 자동 생성.", category: "coding", tags: ["GitHub", "자동화"], pricing: "유료", korean_support: false, website_url: "https://sweep.dev", featured: false },
  { name: "Stripe Docs AI", description: "Stripe 문서 AI 검색.", category: "coding", tags: ["문서", "Stripe"], pricing: "무료", korean_support: false, website_url: "https://stripe.com/docs", featured: false },
  { name: "Continue", description: "오픈소스 코딩 어시스턴트. VS Code.", category: "coding", tags: ["VS Code", "오픈소스"], pricing: "무료", korean_support: false, website_url: "https://continue.dev", featured: false },
  { name: "Codex", description: "OpenAI 코드 생성 API.", category: "coding", tags: ["API", "코드생성"], pricing: "유료", korean_support: false, website_url: "https://openai.com/codex", featured: false },
  // Design (10)
  { name: "Figma AI", description: "Figma 내 AI 디자인 보조.", category: "design", tags: ["UI", "Figma"], pricing: "무료+유료", korean_support: true, website_url: "https://figma.com", featured: true },
  { name: "Uizard", description: "스케치·텍스트→UI 디자인.", category: "design", tags: ["UI", "와이어프레임"], pricing: "무료+유료", korean_support: false, website_url: "https://uizard.io", featured: false },
  { name: "Galileo AI", description: "텍스트→UI 디자인 생성.", category: "design", tags: ["UI", "생성"], pricing: "무료+유료", korean_support: false, website_url: "https://usegalileo.ai", featured: false },
  { name: "Visily", description: "와이어프레임→고충실도 UI.", category: "design", tags: ["UI", "와이어프레임"], pricing: "무료+유료", korean_support: false, website_url: "https://visily.ai", featured: false },
  { name: "Khroma", description: "AI 색상 팔레트 생성.", category: "design", tags: ["색상", "팔레트"], pricing: "무료", korean_support: false, website_url: "https://khroma.co", featured: false },
  { name: "Looka", description: "로고·브랜드 키트 AI 생성.", category: "design", tags: ["로고", "브랜딩"], pricing: "유료", korean_support: false, website_url: "https://looka.com", featured: false },
  { name: "Brandmark", description: "로고·파비콘 생성.", category: "design", tags: ["로고", "브랜딩"], pricing: "무료+유료", korean_support: false, website_url: "https://brandmark.io", featured: false },
  { name: "Fronty", description: "이미지→HTML/CSS 코드.", category: "design", tags: ["코드", "이미지"], pricing: "무료+유료", korean_support: false, website_url: "https://fronty.com", featured: false },
  { name: "Magician", description: "Figma 플러그인. 아이콘·텍스트.", category: "design", tags: ["Figma", "플러그인"], pricing: "무료+유료", korean_support: false, website_url: "https://magician.design", featured: false },
  { name: "Diagram", description: "다이어그램·플로우차트 AI.", category: "design", tags: ["다이어그램", "플로우"], pricing: "무료+유료", korean_support: false, website_url: "https://diagram.com", featured: false },
  // Marketing (10)
  { name: "Jasper", description: "브랜드 음성 마케팅 콘텐츠.", category: "marketing", tags: ["마케팅", "콘텐츠"], pricing: "유료", korean_support: false, website_url: "https://jasper.ai", featured: true },
  { name: "Copy.ai", description: "광고 카피·이메일·랜딩.", category: "marketing", tags: ["카피", "광고"], pricing: "무료+유료", korean_support: true, website_url: "https://copy.ai", featured: false },
  { name: "HubSpot AI", description: "CRM·마케팅 자동화 AI.", category: "marketing", tags: ["CRM", "자동화"], pricing: "유료", korean_support: true, website_url: "https://hubspot.com", featured: false },
  { name: "Persado", description: "마케팅 메시지 최적화.", category: "marketing", tags: ["메시지", "최적화"], pricing: "유료", korean_support: false, website_url: "https://persado.com", featured: false },
  { name: "Phrasee", description: "이메일·광고 언어 최적화.", category: "marketing", tags: ["이메일", "광고"], pricing: "유료", korean_support: false, website_url: "https://phrasee.co", featured: false },
  { name: "Omneky", description: "AI 광고 크리에이티브.", category: "marketing", tags: ["광고", "크리에이티브"], pricing: "유료", korean_support: false, website_url: "https://omneky.com", featured: false },
  { name: "Smartly", description: "광고 자동화·크리에이티브.", category: "marketing", tags: ["광고", "자동화"], pricing: "유료", korean_support: false, website_url: "https://smartly.io", featured: false },
  { name: "AdCreative", description: "광고 이미지·카피 생성.", category: "marketing", tags: ["광고", "이미지"], pricing: "무료+유료", korean_support: false, website_url: "https://adcreative.ai", featured: false },
  { name: "Pencil", description: "광고 크리에이티브 AI.", category: "marketing", tags: ["광고", "크리에이티브"], pricing: "유료", korean_support: false, website_url: "https://pencil.ai", featured: false },
  { name: "Creatopy", description: "배너·광고 디자인 자동화.", category: "marketing", tags: ["배너", "디자인"], pricing: "무료+유료", korean_support: false, website_url: "https://creatopy.com", featured: false },
  // SEO (10)
  { name: "Surfer SEO", description: "콘텐츠·키워드 최적화.", category: "seo", tags: ["키워드", "콘텐츠"], pricing: "유료", korean_support: false, website_url: "https://surferseo.com", featured: true },
  { name: "Frase", description: "SEO 콘텐츠 작성·리서치.", category: "seo", tags: ["SEO", "리서치"], pricing: "유료", korean_support: false, website_url: "https://frase.io", featured: false },
  { name: "SEMrush Writing Assistant", description: "SEO 글쓰기·키워드 제안.", category: "seo", tags: ["SEO", "키워드"], pricing: "유료", korean_support: true, website_url: "https://semrush.com", featured: false },
  { name: "MarketMuse", description: "콘텐츠 전략·키워드 맵.", category: "seo", tags: ["콘텐츠", "전략"], pricing: "유료", korean_support: false, website_url: "https://marketmuse.com", featured: false },
  { name: "Clearscope", description: "콘텐츠 최적화·점수.", category: "seo", tags: ["콘텐츠", "최적화"], pricing: "유료", korean_support: false, website_url: "https://clearscope.io", featured: false },
  { name: "Outranking", description: "SEO 글쓰기·경쟁 분석.", category: "seo", tags: ["SEO", "글쓰기"], pricing: "유료", korean_support: false, website_url: "https://outranking.io", featured: false },
  { name: "Alli AI", description: "자동 SEO 최적화.", category: "seo", tags: ["자동화", "SEO"], pricing: "유료", korean_support: false, website_url: "https://alli.ai", featured: false },
  { name: "RankIQ", description: "블로그 SEO·키워드 리서치.", category: "seo", tags: ["블로그", "키워드"], pricing: "무료+유료", korean_support: false, website_url: "https://rankiq.com", featured: false },
  { name: "Scalenut", description: "SEO 콘텐츠·클러스터.", category: "seo", tags: ["SEO", "콘텐츠"], pricing: "무료+유료", korean_support: false, website_url: "https://scalenut.com", featured: false },
  { name: "Topic", description: "SEO 콘텐츠 플래너.", category: "seo", tags: ["SEO", "플래닝"], pricing: "유료", korean_support: false, website_url: "https://topic.io", featured: false },
  // Data / Analytics (8)
  { name: "Tableau AI", description: "데이터 시각화·인사이트.", category: "data-analytics", tags: ["시각화", "분석"], pricing: "유료", korean_support: true, website_url: "https://tableau.com", featured: true },
  { name: "Power BI", description: "MS 비즈니스 인텔리전스.", category: "data-analytics", tags: ["BI", "시각화"], pricing: "무료+유료", korean_support: true, website_url: "https://powerbi.microsoft.com", featured: false },
  { name: "ThoughtSpot", description: "자연어로 데이터 질의.", category: "data-analytics", tags: ["질의", "BI"], pricing: "유료", korean_support: false, website_url: "https://thoughtspot.com", featured: false },
  { name: "Sigma", description: "스프레드시트형 데이터 분석.", category: "data-analytics", tags: ["분석", "스프레드시트"], pricing: "유료", korean_support: false, website_url: "https://sigmacomputing.com", featured: false },
  { name: "Aible", description: "AI 자동 ML·예측.", category: "data-analytics", tags: ["ML", "예측"], pricing: "유료", korean_support: false, website_url: "https://aible.com", featured: false },
  { name: "MonkeyLearn", description: "텍스트 분석·분류 API.", category: "data-analytics", tags: ["NLP", "분류"], pricing: "무료+유료", korean_support: false, website_url: "https://monkeylearn.com", featured: false },
  { name: "Obviously AI", description: "노코드 예측 분석.", category: "data-analytics", tags: ["예측", "노코드"], pricing: "무료+유료", korean_support: false, website_url: "https://obviouslyai.com", featured: false },
  { name: "DataRobot", description: "자동화 ML 플랫폼.", category: "data-analytics", tags: ["ML", "자동화"], pricing: "유료", korean_support: false, website_url: "https://datarobot.com", featured: false },
  // Research (8)
  { name: "Elicit", description: "논문 리서치·요약·인용.", category: "research", tags: ["논문", "리서치"], pricing: "무료+유료", korean_support: false, website_url: "https://elicit.org", featured: true },
  { name: "Consensus", description: "과학 논문 검색·합의 도출.", category: "research", tags: ["논문", "과학"], pricing: "무료+유료", korean_support: false, website_url: "https://consensus.app", featured: false },
  { name: "Semantic Scholar", description: "AI 기반 학술 검색.", category: "research", tags: ["학술", "검색"], pricing: "무료", korean_support: false, website_url: "https://semanticscholar.org", featured: false },
  { name: "Iris.ai", description: "연구자용 논문 매핑.", category: "research", tags: ["논문", "매핑"], pricing: "유료", korean_support: false, website_url: "https://iris.ai", featured: false },
  { name: "Scholarcy", description: "논문 요약·플래시카드.", category: "research", tags: ["요약", "논문"], pricing: "무료+유료", korean_support: false, website_url: "https://scholarcy.com", featured: false },
  { name: "Scite", description: "인용 분석·증거 검색.", category: "research", tags: ["인용", "분석"], pricing: "유료", korean_support: false, website_url: "https://scite.ai", featured: false },
  { name: "Litmaps", description: "논문 지도·연관 연구.", category: "research", tags: ["논문", "시각화"], pricing: "무료+유료", korean_support: false, website_url: "https://litmaps.com", featured: false },
  { name: "ResearchRabbit", description: "논문 발견·알림.", category: "research", tags: ["논문", "알림"], pricing: "무료", korean_support: false, website_url: "https://researchrabbitapp.com", featured: false },
  // Education (8)
  { name: "Khan Academy Khanmigo", description: "Khan Academy AI 튜터.", category: "education", tags: ["튜터", "수학", "과학"], pricing: "무료+유료", korean_support: false, website_url: "https://khanacademy.org", featured: true },
  { name: "Duolingo Max", description: "AI 언어 학습. 설명·롤플레이.", category: "education", tags: ["언어", "학습"], pricing: "유료", korean_support: true, website_url: "https://duolingo.com", featured: false },
  { name: "Quizlet AI", description: "플래시카드·퀴즈 생성.", category: "education", tags: ["퀴즈", "암기"], pricing: "무료+유료", korean_support: true, website_url: "https://quizlet.com", featured: false },
  { name: "Course Hero", description: "과제 도움·학습 자료.", category: "education", tags: ["과제", "자료"], pricing: "무료+유료", korean_support: false, website_url: "https://coursehero.com", featured: false },
  { name: "Socratic", description: "과제 질문 AI 풀이.", category: "education", tags: ["과제", "풀이"], pricing: "무료", korean_support: true, website_url: "https://socratic.org", featured: false },
  { name: "Knowji", description: "어휘·언어 학습 AI.", category: "education", tags: ["어휘", "언어"], pricing: "무료+유료", korean_support: false, website_url: "https://knowji.com", featured: false },
  { name: "Gradescope", description: "과제 채점·분석.", category: "education", tags: ["채점", "과제"], pricing: "유료", korean_support: false, website_url: "https://gradescope.com", featured: false },
  { name: "Cognii", description: "에세이 채점·피드백.", category: "education", tags: ["채점", "에세이"], pricing: "유료", korean_support: false, website_url: "https://cognii.com", featured: false },
  // Automation (8)
  { name: "Zapier", description: "앱 연동 자동화. 5000+ 앱.", category: "automation", tags: ["자동화", "연동"], pricing: "무료+유료", korean_support: true, website_url: "https://zapier.com", featured: true },
  { name: "Make", description: "시각적 자동화. Integromat 후속.", category: "automation", tags: ["자동화", "시각적"], pricing: "무료+유료", korean_support: true, website_url: "https://make.com", featured: false },
  { name: "n8n", description: "오픈소스 워크플로우 자동화.", category: "automation", tags: ["자동화", "오픈소스"], pricing: "무료+유료", korean_support: false, website_url: "https://n8n.io", featured: false },
  { name: "Pipedream", description: "개발자용 자동화·API.", category: "automation", tags: ["API", "자동화"], pricing: "무료+유료", korean_support: false, website_url: "https://pipedream.com", featured: false },
  { name: "Bardeen", description: "브라우저 자동화. 스크래핑.", category: "automation", tags: ["브라우저", "자동화"], pricing: "무료+유료", korean_support: false, website_url: "https://bardeen.ai", featured: false },
  { name: "Reclaim", description: "캘린더·일정 자동화.", category: "automation", tags: ["캘린더", "일정"], pricing: "무료+유료", korean_support: false, website_url: "https://reclaim.ai", featured: false },
  { name: "Workato", description: "엔터프라이즈 통합·자동화.", category: "automation", tags: ["엔터프라이즈", "통합"], pricing: "유료", korean_support: false, website_url: "https://workato.com", featured: false },
  { name: "Tray.io", description: "고급 워크플로우 자동화.", category: "automation", tags: ["워크플로우", "엔터프라이즈"], pricing: "유료", korean_support: false, website_url: "https://tray.io", featured: false },
  // No-Code (6)
  { name: "Bubble", description: "노코드 웹앱 빌더. 데이터베이스.", category: "no-code", tags: ["웹앱", "노코드"], pricing: "무료+유료", korean_support: false, website_url: "https://bubble.io", featured: true },
  { name: "Softr", description: "Airtable·Google 시트→웹앱.", category: "no-code", tags: ["웹앱", "데이터"], pricing: "무료+유료", korean_support: false, website_url: "https://softr.io", featured: false },
  { name: "Glide", description: "스프레드시트→모바일 앱.", category: "no-code", tags: ["모바일", "앱"], pricing: "무료+유료", korean_support: false, website_url: "https://glideapps.com", featured: false },
  { name: "Adalo", description: "노코드 모바일·웹 앱.", category: "no-code", tags: ["앱", "노코드"], pricing: "무료+유료", korean_support: false, website_url: "https://adalo.com", featured: false },
  { name: "Outsystems", description: "로우코드 엔터프라이즈 앱.", category: "no-code", tags: ["엔터프라이즈", "로우코드"], pricing: "유료", korean_support: false, website_url: "https://outsystems.com", featured: false },
  { name: "Retool", description: "내부 도구·대시보드 빌더.", category: "no-code", tags: ["대시보드", "내부도구"], pricing: "무료+유료", korean_support: false, website_url: "https://retool.com", featured: false },
  // 3D / Gaming (6)
  { name: "Luma AI", description: "3D 캡처·네오메트리.", category: "3d-gaming", tags: ["3D", "캡처"], pricing: "무료+유료", korean_support: false, website_url: "https://lumalabs.ai", featured: true },
  { name: "Rodin", description: "AI 3D 스컬프팅.", category: "3d-gaming", tags: ["3D", "스컬프팅"], pricing: "유료", korean_support: false, website_url: "https://hyper.io/rodin", featured: false },
  { name: "Kaedim", description: "2D 이미지→3D 모델.", category: "3d-gaming", tags: ["3D", "모델"], pricing: "무료+유료", korean_support: false, website_url: "https://kaedim3d.com", featured: false },
  { name: "Meshy", description: "텍스트·이미지→3D 에셋.", category: "3d-gaming", tags: ["3D", "에셋"], pricing: "무료+유료", korean_support: false, website_url: "https://meshy.ai", featured: false },
  { name: "Promethean AI", description: "게임 월드·에셋 자동 생성.", category: "3d-gaming", tags: ["게임", "에셋"], pricing: "유료", korean_support: false, website_url: "https://prometheanai.com", featured: false },
  { name: "Layer", description: "3D 에셋·씬 생성.", category: "3d-gaming", tags: ["3D", "씬"], pricing: "무료+유료", korean_support: false, website_url: "https://layer.ai", featured: false },
  // Business (6)
  { name: "Gong", description: "영업 대화 분석·인사이트.", category: "business", tags: ["영업", "분석"], pricing: "유료", korean_support: false, website_url: "https://gong.io", featured: true },
  { name: "Chorus", description: "영업 콜 분석. Zoom·Teams.", category: "business", tags: ["영업", "콜"], pricing: "유료", korean_support: false, website_url: "https://chorus.ai", featured: false },
  { name: "Cresta", description: "콜센터·실시간 코칭.", category: "business", tags: ["콜센터", "코칭"], pricing: "유료", korean_support: false, website_url: "https://cresta.com", featured: false },
  { name: "People.ai", description: "영업 활동·CRM 자동화.", category: "business", tags: ["CRM", "영업"], pricing: "유료", korean_support: false, website_url: "https://people.ai", featured: false },
  { name: "Clari", description: "수익 예측·파이프라인.", category: "business", tags: ["예측", "수익"], pricing: "유료", korean_support: false, website_url: "https://clari.com", featured: false },
  { name: "Copy.ai for Sales", description: "영업 이메일·메시지.", category: "business", tags: ["영업", "이메일"], pricing: "무료+유료", korean_support: true, website_url: "https://copy.ai", featured: false },
  // Translation (6)
  { name: "DeepL", description: "고품질 기계 번역. 문서 번역.", category: "translation", tags: ["번역", "문서"], pricing: "무료+유료", korean_support: true, website_url: "https://deepl.com", featured: true },
  { name: "Google Translate", description: "다국어 번역. 실시간·이미지.", category: "translation", tags: ["번역", "다국어"], pricing: "무료+유료", korean_support: true, website_url: "https://translate.google.com", featured: false },
  { name: "Unbabel", description: "엔터프라이즈 번역·편집.", category: "translation", tags: ["번역", "엔터프라이즈"], pricing: "유료", korean_support: true, website_url: "https://unbabel.com", featured: false },
  { name: "Lokalise", description: "로컬라이제이션·번역 관리.", category: "translation", tags: ["로컬라이제이션", "관리"], pricing: "무료+유료", korean_support: false, website_url: "https://lokalise.com", featured: false },
  { name: "Phrase", description: "TMS·기계번역 통합.", category: "translation", tags: ["TMS", "번역"], pricing: "유료", korean_support: false, website_url: "https://phrase.com", featured: false },
  { name: "Smartcat", description: "번역·로컬라이제이션 플랫폼.", category: "translation", tags: ["번역", "플랫폼"], pricing: "무료+유료", korean_support: true, website_url: "https://smartcat.com", featured: false },
  // Presentation (6)
  { name: "Gamma", description: "AI 프레젠테이션 생성. 텍스트→슬라이드.", category: "presentation", tags: ["프레젠테이션", "슬라이드"], pricing: "무료+유료", korean_support: true, website_url: "https://gamma.app", featured: true },
  { name: "Beautiful.ai", description: "자동 레이아웃 프레젠테이션.", category: "presentation", tags: ["프레젠테이션", "레이아웃"], pricing: "유료", korean_support: false, website_url: "https://beautiful.ai", featured: false },
  { name: "Tome", description: "AI 스토리텔링 프레젠테이션.", category: "presentation", tags: ["프레젠테이션", "스토리"], pricing: "무료+유료", korean_support: false, website_url: "https://tome.app", featured: false },
  { name: "Pitch", description: "팀 피치덱·프레젠테이션.", category: "presentation", tags: ["피치덱", "팀"], pricing: "무료+유료", korean_support: true, website_url: "https://pitch.com", featured: false },
  { name: "Canva Presentations", description: "Canva AI 슬라이드·디자인.", category: "presentation", tags: ["슬라이드", "디자인"], pricing: "무료+유료", korean_support: true, website_url: "https://canva.com", featured: false },
  { name: "Slidesgo", description: "AI 프레젠테이션 템플릿.", category: "presentation", tags: ["템플릿", "프레젠테이션"], pricing: "무료+유료", korean_support: false, website_url: "https://slidesgo.com", featured: false },
  // Social Media (8)
  { name: "Buffer", description: "SNS 스케줄링·분석.", category: "social-media", tags: ["스케줄링", "SNS"], pricing: "무료+유료", korean_support: true, website_url: "https://buffer.com", featured: true },
  { name: "Hootsuite", description: "소셜 미디어 관리·AI 캡션.", category: "social-media", tags: ["SNS", "관리"], pricing: "무료+유료", korean_support: true, website_url: "https://hootsuite.com", featured: false },
  { name: "Lately", description: "콘텐츠→소셜 포스트 자동 생성.", category: "social-media", tags: ["콘텐츠", "자동화"], pricing: "유료", korean_support: false, website_url: "https://lately.ai", featured: false },
  { name: "Copy.ai Social", description: "소셜 캡션·해시태그 생성.", category: "social-media", tags: ["캡션", "해시태그"], pricing: "무료+유료", korean_support: true, website_url: "https://copy.ai", featured: false },
  { name: "Later", description: "인스타그램·소셜 스케줄링.", category: "social-media", tags: ["인스타그램", "스케줄링"], pricing: "무료+유료", korean_support: false, website_url: "https://later.com", featured: false },
  { name: "Sprout Social", description: "소셜 관리·분석·AI 인사이트.", category: "social-media", tags: ["분석", "관리"], pricing: "유료", korean_support: false, website_url: "https://sproutsocial.com", featured: false },
  { name: "Loom", description: "비디오 메시지·공유.", category: "social-media", tags: ["비디오", "메시지"], pricing: "무료+유료", korean_support: true, website_url: "https://loom.com", featured: false },
  { name: "Taplio", description: "링크드인 콘텐츠·성장.", category: "social-media", tags: ["링크드인", "콘텐츠"], pricing: "무료+유료", korean_support: false, website_url: "https://taplio.com", featured: false },
];

function pushTool(tools, slugUsed, idRef, tool) {
  let baseSlug = slugify(tool.name) || `tool-${idRef.current}`;
  let slug = baseSlug;
  let n = 0;
  while (slugUsed.has(slug)) {
    slug = `${baseSlug}-${++n}`;
  }
  slugUsed.add(slug);
  const rootDomain = tool.website_url ? getRootDomainForLogo(tool.website_url) : "";
  const short_description = tool.description && tool.description.length > 80
    ? tool.description.slice(0, 77) + "…"
    : (tool.description || "");
  tools.push({
    id: String(idRef.current++),
    slug,
    name: tool.name,
    description: tool.description,
    short_description: short_description || tool.description,
    category: tool.category,
    tags: tool.tags,
    pricing: tool.pricing,
    korean_support: tool.korean_support,
    website_url: tool.website_url,
    logo_url: rootDomain ? `https://logo.clearbit.com/${rootDomain}` : undefined,
    featured: tool.featured || false,
    features: [],
    last_updated_at: new Date().toISOString().slice(0, 10),
  });
}

// Build tool list from rawTools only (no synthetic/placeholder tools).
const tools = [];
const slugUsed = new Set();
const idRef = { current: 1 };
for (const t of rawTools) {
  if (!t.website_url) {
    console.warn(`[seed] Skipping "${t.name}": missing website_url`);
    continue;
  }
  try {
    new URL(t.website_url);
  } catch (_) {
    console.warn(`[seed] Skipping "${t.name}": invalid website_url`);
    continue;
  }
  pushTool(tools, slugUsed, idRef, {
    name: t.name,
    description: t.description,
    category: t.category,
    tags: t.tags,
    pricing: t.pricing,
    korean_support: t.korean_support,
    website_url: t.website_url,
    featured: t.featured || false,
  });
}

const outDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, "tools.json"), JSON.stringify(tools, null, 2), "utf-8");
console.log(`Wrote ${tools.length} tools to data/tools.json`);
