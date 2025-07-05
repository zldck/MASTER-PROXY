import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';
const GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 9648, name: 'Mystery' },
  { id: 10762, name: 'Kids' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

export default function BrowseSeries() {
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [heroSeries, setHeroSeries] = useState(null);
  const containerRefs = useRef({});
  const [visibleGenres, setVisibleGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always include NEW, ACTION & ANIMATION, then randomize the rest
    const priorityGenres = ['Action & Adventure', 'Animation'];
    const filtered = GENRES.filter(g => !priorityGenres.includes(g.name));
    const randomGenres = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
    const selected = [...priorityGenres.map(name => GENRES.find(g => g.name === name)), ...randomGenres];
    setVisibleGenres(selected);
  }, []);

  useEffect(() => {
    visibleGenres.forEach(genre => {
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genre.id}`)
        .then(res => res.json())
        .then(data => {
          setSeriesByGenre(prev => ({ ...prev, [genre.name]: data.results }));
          // Pick a hero backdrop randomly from first genre
          if (!heroSeries && data.results.length > 0 && genre.name === visibleGenres[0].name) {
            const random = data.results[Math.floor(Math.random() * data.results.length)];
            setHeroSeries(random);
          }
        });
    });
  }, [visibleGenres]);

  return (
    <>
      <Head><title>Browse Series • StreamTobi</title></Head>

      <div className="min-h-screen bg-black text-white overflow-y-auto">
        <Header />

        {/* Hero Section */}
        <div className="w-full h-[60vh] relative mb-8">
          {heroSeries && (
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${heroSeries.backdrop_path}`}
                alt={heroSeries.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="absolute bottom-10 left-10 text-3xl sm:text-5xl font-bold max-w-xl drop-shadow-xl">
                {heroSeries.name}
              </div>
            </div>
          )}
        </div>





        <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
          {visibleGenres.map(genre => (
            <section key={genre.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">{genre.name}</h2>
              <div
                className="overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
                ref={el => containerRefs.current[genre.name] = el}
              >
                <div className="flex gap-4 transition-transform duration-300 ease-in-out">
                  {(seriesByGenre[genre.name] || []).map(tv => (
                    <Link key={tv.id} href={`/details/series/${tv.id}`} legacyBehavior>
                      <a className="flex-shrink-0 w-[130px] sm:w-[140px] md:w-[150px]">
                        <img
                          loading="lazy"
                          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                          alt={tv.name}
                          className="rounded-lg shadow-md hover:scale-105 transition"
                        />
                        <p className="mt-2 text-sm text-center">{tv.name}</p>
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
