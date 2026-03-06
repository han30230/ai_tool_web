import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: "AI 툴 올인원 서비스 이용약관.",
  alternates: { canonical: `${getBaseUrl()}/terms` },
};

export default function TermsPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-2xl font-bold text-slate-900">이용약관</h1>
      <p className="text-sm text-slate-500">최종 업데이트: 2025년 1월</p>
      <div className="mt-6 space-y-4 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-800">제1조 (목적)</h2>
          <p>본 약관은 AI 툴 올인원(이하 &quot;서비스&quot;)의 이용 조건 및 절차를 정함을 목적으로 합니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">제2조 (서비스 내용)</h2>
          <p>서비스는 AI 도구 정보 검색·비교·추천 및 관련 콘텐츠를 제공합니다. 제공 정보는 공개된 자료를 바탕으로 하며, 실제 서비스 정책은 각 제공처에 따릅니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">제3조 (이용자의 의무)</h2>
          <p>이용자는 서비스를 법령 및 약관에 따라 이용해야 하며, 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">제4조 (면책)</h2>
          <p>서비스에 게재된 툴 정보의 정확성·최신성에 대해 보증하지 않습니다. 이용자가 외부 사이트로 이동해 이용하는 서비스에 대한 책임은 해당 사업자에게 있습니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">제5조 (문의)</h2>
          <p>약관 관련 문의는 <Link href="/contact" className="text-primary hover:underline">문의하기</Link>를 이용해 주세요.</p>
        </section>
      </div>
    </div>
  );
}
