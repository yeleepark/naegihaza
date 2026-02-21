export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-pixel-kr text-[10px] text-white/60">
            © 2026 Seoyoon Park. All rights reserved.
          </div>

          <div className="flex">
            <a
              href="mailto:Seoyoon Park <dev.yelee@gmail.com>"
              className="font-pixel-kr text-[10px] hover:text-pink-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
