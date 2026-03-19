import { CoupangPartnersWidget } from "./CoupangPartnersWidget";
import { CoupangSideColumn } from "./CoupangSideColumn";

type Side = "left" | "right";

function SideBanner({ side }: { side: Side }) {
  const widgetIdRaw = process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID;
  const trackingCode = process.env.NEXT_PUBLIC_COUPANG_TRACKING_CODE;
  const template = process.env.NEXT_PUBLIC_COUPANG_TEMPLATE ?? "carousel";

  const href =
    side === "left"
      ? process.env.NEXT_PUBLIC_COUPANG_LEFT_URL
      : process.env.NEXT_PUBLIC_COUPANG_RIGHT_URL;

  const imgSrc =
    side === "left"
      ? process.env.NEXT_PUBLIC_COUPANG_LEFT_IMG
      : process.env.NEXT_PUBLIC_COUPANG_RIGHT_IMG;

  const alt = side === "left" ? "Coupang Partners (Left)" : "Coupang Partners (Right)";

  const widgetId = widgetIdRaw ? Number(widgetIdRaw) : undefined;
  const useWidget = Number.isFinite(widgetId) && !!trackingCode;

  if (!useWidget && !href) return null;

  return (
    <aside
      className={[
        "fixed top-40 z-40 hidden lg:block",
        side === "left" ? "-left-2 xl:-left-4" : "-right-2 xl:-right-4",
      ].join(" ")}
      aria-label={alt}
    >
      <div className="w-[var(--coupang-side-banner-width)]">
        {useWidget ? (
          <CoupangSideColumn
            side={side}
            widgetId={widgetId as number}
            trackingCode={trackingCode as string}
            template={template}
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block hover:shadow transition-shadow"
            >
              {imgSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc} alt={alt} className="h-auto w-full" loading="lazy" />
              ) : (
                <div className="p-3 text-xs text-slate-600">
                  쿠팡 파트너스 배너
                  <div className="mt-1 text-[11px] text-slate-500">이미지 URL 환경변수 설정 필요</div>
                </div>
              )}
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}

export function CoupangSideBanners() {
  const widgetIdRaw = process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID;
  const trackingCode = process.env.NEXT_PUBLIC_COUPANG_TRACKING_CODE;
  const template = process.env.NEXT_PUBLIC_COUPANG_TEMPLATE ?? "carousel";
  const widgetId = widgetIdRaw ? Number(widgetIdRaw) : undefined;
  const useSideWidget = Number.isFinite(widgetId) && !!trackingCode;

  const mobileWidgetIdRaw = process.env.NEXT_PUBLIC_COUPANG_MOBILE_WIDGET_ID;
  const mobileWidgetId = mobileWidgetIdRaw ? Number(mobileWidgetIdRaw) : undefined;
  const useMobileWidget = Number.isFinite(mobileWidgetId) && !!trackingCode;

  const mobileHref = process.env.NEXT_PUBLIC_COUPANG_MOBILE_URL;
  const mobileImg = process.env.NEXT_PUBLIC_COUPANG_MOBILE_IMG;

  return (
    <>
      <SideBanner side="left" />
      <SideBanner side="right" />

      {(useMobileWidget || mobileHref || useSideWidget) && (
        <aside
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
          aria-label="Coupang Partners (Mobile)"
        >
          <div className="mx-auto w-full max-w-[900px] border-t border-slate-200 bg-white shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.35)]">
            {useMobileWidget ? (
              <div className="h-[var(--coupang-mobile-banner-height)] px-3">
                <CoupangPartnersWidget
                  widgetId={mobileWidgetId as number}
                  trackingCode={trackingCode as string}
                  template={template}
                  width={320}
                  height={50}
                  fallback={
                    mobileHref ? (
                      <a
                        href={mobileHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex h-[var(--coupang-mobile-banner-height)] w-full items-center justify-center"
                      >
                        {mobileImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mobileImg}
                            alt="Coupang Partners (Mobile)"
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-sm text-slate-700">쿠팡 파트너스 배너</div>
                        )}
                      </a>
                    ) : null
                  }
                />
              </div>
            ) : useSideWidget ? (
              <div className="h-[var(--coupang-mobile-banner-height)] px-3">
                <CoupangPartnersWidget
                  widgetId={widgetId as number}
                  trackingCode={trackingCode as string}
                  template={template}
                  width={320}
                  height={50}
                />
              </div>
            ) : (
              <a
                href={mobileHref}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex h-[var(--coupang-mobile-banner-height)] w-full items-center justify-center px-3"
              >
                {mobileImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mobileImg}
                    alt="Coupang Partners (Mobile)"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-sm text-slate-700">쿠팡 파트너스 배너</div>
                )}
              </a>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

