import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white
        border-4 border-black
        rounded-2xl
        p-8
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
