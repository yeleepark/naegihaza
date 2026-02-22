import type { Metadata } from "next";
import { Press_Start_2P, Jua } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://naegihaza.com'),
  title: {
    default: "랜덤 선택기 · 룰렛 · 사다리타기 · 팀 나누기 무료 온라인 도구",
    template: "%s | Naegihaza"
  },
  description: "친구들과 빠르게 결정하세요. 룰렛, 사다리타기, 주사위, 벌칙 정하기, 팀 나누기를 한 번에 사용할 수 있는 무료 랜덤 선택 도구입니다.",
  keywords: [
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
    title: '랜덤 선택기 · 룰렛 · 사다리타기 · 팀 나누기 무료 온라인 도구',
    description: '친구들과 빠르게 결정하세요. 룰렛, 사다리타기, 주사위, 벌칙 정하기, 팀 나누기를 한 번에 사용할 수 있는 무료 랜덤 선택 도구입니다.',
    images: [
      {
        url: 'https://naegihaza.com',
        width: 1200,
        height: 630,
        alt: 'Naegihaza - 내기하자',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '랜덤 선택기 · 룰렛 · 사다리타기 · 팀 나누기 무료 온라인 도구',
    description: '친구들과 빠르게 결정하세요. 룰렛, 사다리타기, 주사위, 벌칙 정하기, 팀 나누기를 한 번에 사용할 수 있는 무료 랜덤 선택 도구입니다.',
    images: ['https://naegihaza.com'],
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

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Naegihaza',
  alternateName: '내기하자',
  url: 'https://naegihaza.com',
  description: '친구들과 빠르게 결정하세요. 룰렛, 사다리타기, 주사위, 벌칙 정하기, 팀 나누기를 한 번에 사용할 수 있는 무료 랜덤 선택 도구입니다.',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web Browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  creator: { '@type': 'Person', name: 'Seoyoon Park', email: 'dev.yelee@gmail.com' },
  inLanguage: ['ko', 'en', 'zh', 'es'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', ratingCount: '1' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4501038602130909"
          crossOrigin="anonymous"
        />
        {/* JSON-LD는 body에서 렌더링해 head hydration 불일치 방지 */}
      </head>
      <body className={`${pressStart2P.variable} ${jua.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          suppressHydrationWarning
        />
        {children}
      </body>
    </html>
  );
}
