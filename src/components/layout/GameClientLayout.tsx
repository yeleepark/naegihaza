import { ReactNode } from 'react';

interface GameClientLayoutProps {
  gameState: string;
  setup: ReactNode;
  gameplay: ReactNode;
  result: ReactNode;
}

export default function GameClientLayout({
  gameState,
  setup,
  gameplay,
  result,
}: GameClientLayoutProps) {
  return (
    <div className="w-full h-full">
      {gameState === 'setup' && setup}
      {gameState !== 'setup' && gameState !== 'result' && gameplay}
      {gameState === 'result' && result}
    </div>
  );
}
