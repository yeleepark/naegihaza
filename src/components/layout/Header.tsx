import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black text-white py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-[family-name:var(--font-inter)] text-xl font-black lowercase">
            naegihaza
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-inter)] text-sm font-medium hover:text-pink-400 transition-colors"
          >
            Games
          </Link>
        </nav>
      </div>
    </header>
  );
}
