import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-xl font-bold text-slate-900">글을 찾을 수 없습니다</h1>
      <p className="mt-2 text-slate-600">
        요청하신 글이 없거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href="/articles"
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        AI 관련 글 목록으로
      </Link>
    </div>
  );
}
