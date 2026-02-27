import { ReactNode } from 'react';

interface GameClientLayoutProps {
  setup: ReactNode;
  gameplay: ReactNode;
  result: ReactNode;
}

export default function GameClientLayout({
  setup,
  gameplay,
  result,
}: GameClientLayoutProps) {
  return (
    <div className="w-full h-full">
      {setup}
      {gameplay}
      {result}
    </div>
  );
}
