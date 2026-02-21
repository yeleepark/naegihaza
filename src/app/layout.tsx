import type { Metadata } from "next";
import { Press_Start_2P, Jua } from "next/font/google";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";
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
    default: "Naegihaza - Let's Bet | Random Games with Friends",
    template: "%s | Naegihaza"
  },
  description: "Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets. Supports Korean, English, Chinese, and Spanish.",
  keywords: ["betting", "game", "roulette", "dice", "random", "friends", "online game", "free game", "decision maker", "naegihaza", "내기", "룰렛", "주사위"],
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
    title: 'Naegihaza - Let\'s Bet | Random Games',
    description: 'Free online betting game platform to enjoy with friends. Random roulette and dice rolling games.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Naegihaza - 내기하자',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naegihaza - Let\'s Bet',
    description: 'Free online betting game platform with random roulette and dice rolling',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <head>
        <StructuredData />
      </head>
      <body className={`${pressStart2P.variable} ${jua.variable} h-full overflow-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}
