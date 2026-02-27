import Footer from '@/components/layout/Footer';

type GamePageLayoutProps = {
  header: React.ReactNode;
  game: React.ReactNode;
  description: React.ReactNode;
};

export default function GamePageLayout({ header, game, description }: GamePageLayoutProps) {
  return (
    <div className="md:h-screen md:h-[100dvh] w-screen flex flex-col md:overflow-hidden bg-[#fef3e2]">
      {header}

      <main className="relative flex-1 min-h-0 overflow-y-auto">
        <section className="min-h-[calc(100dvh-3.25rem)] md:h-[calc(100dvh-3.25rem)] flex items-start justify-center p-4 md:p-8">
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
