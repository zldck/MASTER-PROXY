import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function BrowseSeries() {
  const [genres, setGenres] = useState([]);
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [heroSeries, setHeroSeries] = useState(null);
  const containerRefs = useRef({});

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setGenres(data.genres || []));
  }, []);

  useEffect(() => {
    if (genres.length === 0) return;
    genres.forEach(genre => {
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genre.id}`)
        .then(res => res.json())
        .then(data => {
          setSeriesByGenre(prev => ({ ...prev, [genre.name]: data.results || [] }));
          if (!heroSeries && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            setHeroSeries(data.results[randomIndex]);
          }
        });
    });
  }, [genres]);

  return (
    <>
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

        <main className="max-w-7xl mx-auto px-6 space-y-12 pb-20">
          {genres.map((genre) => (
            <section key={genre.id}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{genre.name}</h2>
              <div
                className="overflow-x-auto hide-scrollbar"
                ref={el => containerRefs.current[genre.name] = el}
              >
                <div className="flex gap-4 min-w-max">
                  {(seriesByGenre[genre.name] || []).slice(0, 15).map(series => (
                    <Link key={series.id} href={`/details/series/${series.id}`} legacyBehavior>
                      <a className="w-40 flex-shrink-0">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                          alt={series.name}
                          className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition"
                        />
                        <p className="mt-2 text-sm text-center line-clamp-1">{series.name}</p>
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
