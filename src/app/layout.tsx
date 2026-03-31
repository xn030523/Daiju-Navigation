import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getSiteMeta } from "@/lib/navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();

  return {
    // 功能入口：根布局统一输出 metadataBase、canonical 和开放图信息，作为全站 SEO 基座。
    metadataBase: new URL(siteMeta.siteUrl),
    title: {
      default: siteMeta.title,
      template: `%s | ${siteMeta.title}`,
    },
    description: siteMeta.description,
    keywords: siteMeta.keywords,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteMeta.title,
      description: siteMeta.description,
      type: "website",
      url: siteMeta.siteUrl,
      siteName: siteMeta.title,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: siteMeta.title,
      description: siteMeta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "baidu-site-verification": "codeva-YhVcYMuG23",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DSG969J25C" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DSG969J25C');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?8848467cee451f3aa40243587337a362";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
