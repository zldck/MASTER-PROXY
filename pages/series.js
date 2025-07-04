// pages/series.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Header from '../components/Header';



const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function Series() {
  const [series, setSeries] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setSeries(data.results || []));
  }, []);

  return (
    <>
      <Head><title>StreamTobi • Series</title></Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero Slider */}
        <div className="relative h-[70vh] w-full">
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
            {series.slice(0, 5).filter(tv => tv.backdrop_path).map(tv => (
              <SwiperSlide key={tv.id}>
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
                    alt={tv.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <h2 className="absolute bottom-10 left-10 text-4xl sm:text-6xl font-bold drop-shadow-xl">
                    {tv.name}
                  </h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Body Content */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6">Trending TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {series.map(tv => (
              <Link key={tv.id} href={`/details/series/${tv.id}`} legacyBehavior>
                <a className="block">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                    alt={tv.name}
                    className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition"
                  />
                  <p className="mt-2 text-sm text-center">{tv.name}</p>
                </a>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
