import type { Metadata } from "next";
import { Press_Start_2P, Jua } from "next/font/google";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

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
  title: "Naegihaza - 내기하자",
  description: "내기하자! 친구들과 함께 즐기는 내기 게임 플랫폼",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍀</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full overflow-hidden">
      <body className={`${pressStart2P.variable} ${jua.variable} h-full overflow-hidden antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
