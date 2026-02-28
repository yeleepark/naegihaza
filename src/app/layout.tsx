import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Press_Start_2P, Jua } from "next/font/google";
import { defaultLocale } from "@/i18n/settings";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://naegihaza.com'),
  title: {
    default: "Naegihaza - Let's Bet | Random Games with Friends",
    template: "%s | Naegihaza"
  },
  description: "Let's bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.",
  keywords: [
    "내기하자", "내기하자 사이트", "내기하자 게임",
    "betting", "game", "roulette", "dice", "random", "friends", "online game", "free game", "decision maker", "naegihaza", "내기", "룰렛", "주사위",
    "랜덤 선택기", "랜덤 추첨기", "룰렛 돌리기", "온라인 룰렛", "사다리타기", "벌칙 정하기", "술게임 정하기", "점심 메뉴 정하기", "내기 정하기", "친구 게임", "파티 게임", "랜덤 게임 사이트", "이름 추첨", "당번 뽑기", "팀 나누기", "제비뽑기", "운빨 게임", "주사위 굴리기", "폭탄 게임",
  ],
  authors: [{ name: "Seoyoon Park" }],
  creator: "Seoyoon Park",
  publisher: "Naegihaza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍀</text></svg>",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'es_ES'],
    url: 'https://naegihaza.com',
    siteName: 'Naegihaza',
    title: "Naegihaza - Let's Bet | Random Games with Friends",
    description: "Let's bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Naegihaza - Let's Bet",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Naegihaza - Let's Bet | Random Games with Friends",
    description: "Let's bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '7QNgFfKqEhJohjkkXaSq87m7zqSSwPRnh3XWeztXdBQ',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fef3e2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4501038602130909"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${pressStart2P.variable} ${jua.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
