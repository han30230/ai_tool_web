"use client";

/**
 * Default AI icon when logo image fails to load.
 * Futurepedia-style fallback (sparkle / AI chip).
 */
export function FallbackAIIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  const s = size * 0.45;
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
          fill="currentColor"
          opacity={0.9}
        />
        <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      </svg>
    </div>
  );
}
