// pages/browse-movie.js
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },
  { id: 16, name: 'Animation' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' },
  { id: 10752, name: 'War' },
  { id: 99, name: 'Documentary' },
  { id: 12, name: 'Adventure' },
  { id: 14, name: 'Fantasy' },
  { id: 9648, name: 'Mystery' },
  { id: 80, name: 'Crime' },
  { id: 53, name: 'Thriller' },
  { id: 10402, name: 'Music' },
  { id: 10770, name: 'TV Movie' },
];

export default function BrowseMovie() {
  const [genreMovies, setGenreMovies] = useState({});
  const [heroBackdrop, setHeroBackdrop] = useState('https://image.tmdb.org/t/p/original/zK2sFxFEFsLCG1lHVeLXMZ0DAsI.jpg');
  const [hoverTimer, setHoverTimer] = useState(null);
  const [pageByGenre, setPageByGenre] = useState({});
  const [loadingByGenre, setLoadingByGenre] = useState({});
  const containerRefs = useRef({});

  const fetchMoviesByGenre = useCallback((genreId, genreName, page = 1) => {
    if (loadingByGenre[genreName]) return;
    setLoadingByGenre(prev => ({ ...prev, [genreName]: true }));

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setGenreMovies(prev => ({
          ...prev,
          [genreName]: [...(prev[genreName] || []), ...data.results],
        }));
        setPageByGenre(prev => ({ ...prev, [genreName]: page + 1 }));
        setLoadingByGenre(prev => ({ ...prev, [genreName]: false }));
      });
  }, [loadingByGenre]);

  useEffect(() => {
    GENRES.forEach(genre => {
      fetchMoviesByGenre(genre.id, genre.name);
    });
  }, [fetchMoviesByGenre]);

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
      fetchMoviesByGenre(genreId, genreName, pageByGenre[genreName] || 2);
    }
  };

  return (
    <>
      <Head><title>Browse Movies • StreamTobi</title></Head>

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
            <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-xl">Discover Movies by Genre</h1>
            <p className="mt-2 text-sm text-gray-300 max-w-md">Explore trending and popular films categorized in genres to suit your mood.</p>
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
                  {(genreMovies[genre.name] || []).map(movie => (
                    <Link key={movie.id} href={`/details/movie/${movie.id}`} legacyBehavior>
                      <a
                        className="flex-shrink-0 w-20 sm:w-24 md:w-28 lg:w-32"
                        onMouseEnter={() => handlePosterHover(movie.backdrop_path)}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="rounded-md shadow-md hover:scale-105 transition duration-300 ease-in-out"
                        />
                        <p className="mt-2 text-xs sm:text-sm text-center line-clamp-1">{movie.title}</p>
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
