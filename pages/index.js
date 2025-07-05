// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Header from '../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    const allMovies = data.results || [];

    // Get watched genre IDs from localStorage
    const watchedGenres = JSON.parse(localStorage.getItem('watchedGenres')) || [];

    // Prioritize movies that match the user's watched genres
    const prioritized = allMovies.filter(movie =>
      movie.genre_ids?.some(id => watchedGenres.includes(id))
    );

    // Final movie list: matching genres first, then the rest
    const sortedMovies = prioritized.length > 0
      ? [...prioritized, ...allMovies.filter(m => !prioritized.includes(m))]
      : allMovies;

    setMovies(sortedMovies);
  };

  fetchData();
}, []);


  return (
    <>
      <Head><title>StreamTobi • Home</title></Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero Slider */}
        <motion.div
          className="relative h-[70vh] w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
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
                  <h2 className="absolute bottom-10 left-10 text-4xl sm:text-6xl font-bold drop-shadow-xl">
                    {movie.title}
                  </h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Trending Content */}
        <motion.main
          className="max-w-7xl mx-auto px-6 py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link href={`/details/movie/${movie.id}`} legacyBehavior>
                  <a className="block">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition"
                    />
                    <p className="mt-2 text-sm text-center">{movie.title}</p>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.main>
      </div>
    </>
  );
}
