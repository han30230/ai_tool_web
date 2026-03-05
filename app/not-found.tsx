import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-slate-900">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-slate-600">요청하신 툴 또는 페이지가 없거나 이동되었을 수 있습니다.</p>
      <Link href="/" className="mt-4 text-primary hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
