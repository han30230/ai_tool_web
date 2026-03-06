import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "AI 툴 올인원 개인정보처리방침.",
  alternates: { canonical: `${getBaseUrl()}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">개인정보처리방침</h1>
      <p className="mt-1 text-sm text-slate-500">최종 업데이트: 2025년 1월</p>
      <div className="mt-6 space-y-5 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-800">1. 수집하는 개인정보</h2>
          <p>AI 툴 올인원은 서비스 이용 시 이메일(구독 신청 시), 접속 로그 등 최소한의 정보를 수집할 수 있습니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">2. 이용 목적</h2>
          <p>수집된 정보는 서비스 개선, 뉴스레터 발송, 문의 대응에만 사용됩니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">3. 보관 및 파기</h2>
          <p>개인정보는 목적 달성 후 지체 없이 파기하며, 법령에 따른 보존 기간이 있는 경우 해당 기간 동안 보관합니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-800">4. 문의</h2>
          <p>개인정보 관련 문의는 <Link href="/contact" className="text-primary hover:underline">문의하기</Link>를 이용해 주세요.</p>
        </section>
      </div>
    </div>
  );
}
