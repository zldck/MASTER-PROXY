import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

const genres = [
  { name: "Most Popular", id: "popular" },
  { name: "Most Rated", id: "top_rated" },
  { name: "Action & Adventure", id: 10759 },
  { name: "Animation", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Drama", id: 18 },
  { name: "Family", id: 10751 },
  { name: "Kids", id: 10762 },
  { name: "Mystery", id: 9648 },
  { name: "News", id: 10763 },
  { name: "Reality", id: 10764 },
  { name: "Sci-Fi & Fantasy", id: 10765 },
  { name: "Soap", id: 10766 },
  { name: "Talk", id: 10767 },
  { name: "War & Politics", id: 10768 },
  { name: "Western", id: 37 },
];

export default function BrowseSeriesPage() {
  const [category, setCategory] = useState("popular");
  const [items, setItems] = useState([]);
  const [backdrop, setBackdrop] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  const fetchData = async (reset = false) => {
    setLoading(true);
    let url = "";

    if (category === "popular" || category === "top_rated") {
      url = `https://api.themoviedb.org/3/tv/${category}?api_key=b2b5c3479e0348c308499b783fb337b8&page=${page}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=b2b5c3479e0348c308499b783fb337b8&with_genres=${category}&page=${page}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setItems((prev) => (reset ? data.results : [...prev, ...data.results]));
    if (reset && data.results.length > 0) {
      setBackdrop(data.results[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchData(true);
  }, [category]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    if (page > 1) fetchData();
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={scrollContainerRef} className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={backdrop?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {backdrop?.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/original${backdrop.backdrop_path}`}
                alt={backdrop.name}
                layout="fill"
                objectFit="cover"
                priority
                className="z-0"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Genre Buttons */}
      <div className="px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setCategory(genre.id)}
              className={`px-3 py-1 rounded-full border transition duration-300 font-medium text-sm ${
                category === genre.id
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white border-gray-600 hover:bg-white hover:text-black"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Grid of Series */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setBackdrop(item)}
              className="cursor-pointer bg-gray-900 hover:bg-gray-800 rounded-xl overflow-hidden transition duration-300"
            >
              <Link href={`/details/tv/${item.id}`}>
                <div>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.name}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                  <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">
                      {item.name}
                    </h2>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>{(item.first_air_date || "").slice(0, 4)}</span>
                      <span>⭐ {item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-white text-black px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 transition"
      >
        TOP
      </button>
    </div>
  );
}