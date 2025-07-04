// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [hovering, setHovering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/70 border-b border-white/10 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Left: Brand */}
        <div className="text-xl font-bold tracking-wide">
          <Link href="/" passHref legacyBehavior>
            <a>StreamTobi</a>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Search and Nav */}
        <div className="hidden sm:flex flex-1 items-center justify-end space-x-6">
          <nav className="flex space-x-4 text-sm items-center">
            <Link href="/" passHref legacyBehavior>
              <a>Home</a>
            </Link>
            <Link href="/movie" passHref legacyBehavior>
              <a>Movies</a>
            </Link>
            <Link href="/series" passHref legacyBehavior>
              <a>Series</a>
            </Link>
            <div
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="relative"
            >
              <button className="hover:text-red-400 transition">Browse</button>
              <div
                className={`absolute top-full left-0 mt-1 w-40 bg-black border border-white/10 rounded-md shadow-lg text-white text-sm transition-all duration-300 ease-in-out overflow-hidden ${hovering ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                <Link href="/browse-movie" passHref legacyBehavior>
                  <a className="block px-4 py-3 hover:bg-red-600 transition">Browse Movies</a>
                </Link>
                <Link href="/browse-series" passHref legacyBehavior>
                  <a className="block px-4 py-3 hover:bg-red-600 transition">Browse Series</a>
                </Link>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Search movies or series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-full focus:outline-none focus:ring focus:border-red-500 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Mobile Dropdown Menu with animation */}
        <div
          className={`w-full overflow-hidden transition-all duration-500 ease-in-out sm:hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex flex-col mt-3 text-sm space-y-2">
            <input
              type="text"
              placeholder="Search movies or series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-full focus:outline-none focus:ring focus:border-red-500 placeholder:text-gray-400"
            />
            <Link href="/" passHref legacyBehavior>
              <a>Home</a>
            </Link>
            <Link href="/movie" passHref legacyBehavior>
              <a>Movies</a>
            </Link>
            <Link href="/series" passHref legacyBehavior>
              <a>Series</a>
            </Link>
            <div className="border-t border-white/10 pt-2">
              <Link href="/browse-movie" passHref legacyBehavior>
                <a className="block py-2">Browse Movies</a>
              </Link>
              <Link href="/browse-series" passHref legacyBehavior>
                <a className="block py-2">Browse Series</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
