// pages/browse/movie.js
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Header from '../components/Header';


const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function BrowseMovie() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null);

  const fetchMoreMovies = useCallback(() => {
    if (loading) return;
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setMovies(prev => [...prev, ...(data.results || [])]);
        setPage(prev => prev + 1);
        setLoading(false);
      });
  }, [page, loading]);

  useEffect(() => {
    fetchMoreMovies();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      if (scrollTop + windowHeight >= fullHeight - 100) {
        fetchMoreMovies();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMoreMovies]);

  return (
    <>
      <Head><title>Browse Movies • StreamTobi</title></Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero Slider */}
        <div className="relative h-[60vh] w-full">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              let timer;
              const resetAutoplay = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                  if (swiper.autoplay?.start) swiper.autoplay.start();
                }, 7000);
              };
              swiper.el.addEventListener('touchstart', resetAutoplay);
              swiper.el.addEventListener('mousemove', resetAutoplay);
            }}
            className="h-full"
          >
            {movies.slice(0, 5).filter(movie => movie.backdrop_path).map(movie => (
              <SwiperSlide key={movie.id}>
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <h2 className="absolute bottom-10 left-10 text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
                    {movie.title}
                  </h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grid Content */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {movies.map(movie => (
              <Link key={movie.id} href={`/details/movie/${movie.id}`} legacyBehavior>
                <a className="block">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition"
                  />
                  <p className="mt-2 text-sm text-center">{movie.title}</p>
                </a>
              </Link>
            ))}
          </div>
          {loading && <p className="text-center text-gray-400 py-4">Loading more...</p>}
        </main>
      </div>
    </>
  );
}
