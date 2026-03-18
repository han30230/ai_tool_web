import { getLocale } from "next-intl/server";
import "./globals.css";
import { CoupangSideBanners } from "../components/CoupangSideBanners";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="mSloSvOWLYEVYdiiUVK7AEiuMl1zmtDXp7f37QyKu_g" />
        <link rel="preconnect" href="https://logo.clearbit.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="flex min-h-screen flex-col antialiased coupang-side-padding">
        <CoupangSideBanners />
        {children}
      </body>
    </html>
  );
}
