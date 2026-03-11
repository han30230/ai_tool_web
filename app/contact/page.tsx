import { getBaseUrl, CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "문의",
  description: "제휴·광고·툴 제출·일반 문의. AI 툴 올인원.",
  alternates: { canonical: `${getBaseUrl()}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">문의</h1>
      <p className="text-slate-600">
        제휴·광고·툴 제출·일반 문의는 아래 이메일로 보내 주세요.
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">이메일</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-primary hover:underline">{CONTACT_EMAIL}</a>
        <p className="mt-3 text-xs text-slate-500">운영 시간 내 순차적으로 답변드립니다.</p>
      </div>
    </div>
  );
}
