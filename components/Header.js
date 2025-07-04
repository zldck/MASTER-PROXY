import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black bg-opacity-80 text-white shadow-md">
      <nav className="flex justify-between items-center px-6 py-4">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold">
          <Link href="/">StreamTobi</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <Link href="/" className="hover:text-red-500 transition">Home</Link>
          <Link href="/movie" className="hover:text-red-500 transition">Movies</Link>
          <Link href="/series" className="hover:text-red-500 transition">Series</Link>

          {/* Browse Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
              Browse
            </button>
            <div
              className="absolute opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100 transform origin-top transition-all duration-300 ease-out mt-2 bg-black bg-opacity-50 rounded shadow-lg w-32 z-50"
            >
              <Link href="/browse-movie">
                <div className="px-4 py-2 hover:bg-red-600 cursor-pointer">Movies</div>
              </Link>
              <Link href="/browse-series">
                <div className="px-4 py-2 hover:bg-red-600 cursor-pointer">Series</div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
