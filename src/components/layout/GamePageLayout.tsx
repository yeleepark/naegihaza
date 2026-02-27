import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type GamePageLayoutProps = {
  game: React.ReactNode;
  description: React.ReactNode;
};

export default function GamePageLayout({ game, description }: GamePageLayoutProps) {
  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col overflow-hidden bg-[#fef3e2]">
      <Header />

      <main className="relative flex-1 min-h-0 overflow-y-auto">
        <section className="h-[calc(100dvh-3.25rem)] flex items-start justify-center p-4 md:p-8">
          {game}
        </section>
        <section className="min-h-[calc(100dvh-3.25rem)] flex flex-col">
          <div className="flex-1 py-8">
            {description}
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
