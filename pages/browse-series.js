// pages/browse-series.js
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';
const GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

export default function BrowseSeries() {
  const [genreSeries, setGenreSeries] = useState({});
  const [heroBackdrop, setHeroBackdrop] = useState('https://image.tmdb.org/t/p/original/xOjRNnQw5hqR1EULJ2iHkGwJVA4.jpg');
  const [hoverTimer, setHoverTimer] = useState(null);
  const [pageByGenre, setPageByGenre] = useState({});
  const [loadingByGenre, setLoadingByGenre] = useState({});
  const containerRefs = useRef({});

  const fetchSeriesByGenre = useCallback((genreId, genreName, page = 1) => {
    if (loadingByGenre[genreName]) return;
    setLoadingByGenre(prev => ({ ...prev, [genreName]: true }));

    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setGenreSeries(prev => ({
          ...prev,
          [genreName]: [...(prev[genreName] || []), ...data.results],
        }));
        setPageByGenre(prev => ({ ...prev, [genreName]: page + 1 }));
        setLoadingByGenre(prev => ({ ...prev, [genreName]: false }));
      });
  }, [loadingByGenre]);

  useEffect(() => {
    GENRES.forEach(genre => {
      fetchSeriesByGenre(genre.id, genre.name);
    });
  }, [fetchSeriesByGenre]);

  const handlePosterHover = (backdropPath) => {
    clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      if (backdropPath) {
        setHeroBackdrop(`https://image.tmdb.org/t/p/original${backdropPath}`);
      }
    }, 200);
    setHoverTimer(timer);
  };

  const handleScroll = (genreName, genreId) => {
    const ref = containerRefs.current[genreName];
    if (!ref) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref;
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      fetchSeriesByGenre(genreId, genreName, pageByGenre[genreName] || 2);
    }
  };

  return (
    <>
      <Head><title>Browse Series • StreamTobi</title></Head>

      <div className="min-h-screen bg-black text-white overflow-y-auto">
        <Header />

        {/* Hero Section */}
        <div className="relative h-[60vh] w-full mb-8 transition-all duration-500 ease-in-out">
          <img
            src={heroBackdrop}
            alt="hero backdrop"
            className="w-full h-full object-cover object-top transition-all duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute bottom-10 left-6 sm:left-10">
            <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-xl">Discover Series by Genre</h1>
            <p className="mt-2 text-sm text-gray-300 max-w-md">Explore trending and top-rated TV shows across genres and categories.</p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
          {GENRES.map(genre => (
            <section key={genre.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">{genre.name}</h2>
              <div
                className="overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
                ref={el => containerRefs.current[genre.name] = el}
                onScroll={() => handleScroll(genre.name, genre.id)}
              >
                <div className="flex gap-3 transition-transform duration-300 ease-in-out">
                  {(genreSeries[genre.name] || []).map(tv => (
                    <Link key={tv.id} href={`/details/series/${tv.id}`} legacyBehavior>
                      <a
                        className="flex-shrink-0 w-20 sm:w-24 md:w-28 lg:w-32"
                        onMouseEnter={() => handlePosterHover(tv.backdrop_path)}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                          alt={tv.name}
                          className="rounded-md shadow-md hover:scale-105 transition duration-300 ease-in-out"
                        />
                        <p className="mt-2 text-xs sm:text-sm text-center line-clamp-1">{tv.name}</p>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
