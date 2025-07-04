import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

const genreList = [
  { id: 28, name: 'Action' },
  { id: 16, name: 'Animation' },
  { id: 27, name: 'Horror' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 12, name: 'Adventure' },
  { id: 53, name: 'Thriller' },
  { id: 9648, name: 'Mystery' },
  { id: 10751, name: 'Family' },
];

const prioritizedGenres = ['Action', 'Animation', 'Horror'];

function shuffleAndLimitGenres(allGenres, limit) {
  const remaining = allGenres.filter(g => !prioritizedGenres.includes(g.name));
  const shuffled = remaining.sort(() => 0.5 - Math.random()).slice(0, limit - prioritizedGenres.length);
  return [...prioritizedGenres.map(name => allGenres.find(g => g.name === name)), ...shuffled];
}

export default function BrowseMovie() {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [heroMovie, setHeroMovie] = useState(null);
  const containerRefs = useRef({});

  useEffect(() => {
    const selectedGenres = shuffleAndLimitGenres(genreList, 5);
    setGenres(selectedGenres);

    selectedGenres.forEach((genre) => {
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`)
        .then(res => res.json())
        .then(data => {
          setMoviesByGenre(prev => ({
            ...prev,
            [genre.name]: data.results.slice(0, 15),
          }));
        });
    });
  }, []);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const random = data.results[Math.floor(Math.random() * data.results.length)];
        setHeroMovie(random);
      });
  }, []);

  return (
    <>
      <Head>
        <title>StreamTobi • Browse Movies</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <div className="w-full h-[60vh] relative mb-8">
          {heroMovie && (
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
                alt={heroMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="absolute bottom-10 left-10 text-3xl sm:text-5xl font-bold max-w-xl drop-shadow-xl">
                {heroMovie.title}
              </div>
            </div>
          )}
        </div>

        <main className="max-w-7xl mx-auto px-6 space-y-12 pb-20">
          {genres.map((genre) => (
            <section key={genre.id}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{genre.name}</h2>
              <div
                className="overflow-x-auto hide-scrollbar"
                ref={el => containerRefs.current[genre.name] = el}
              >
                <div className="flex gap-4 min-w-max">
                  {(moviesByGenre[genre.name] || []).slice(0, 15).map(movie => (
                    <Link key={movie.id} href={`/details/movie/${movie.id}`} legacyBehavior>
                      <a className="w-40 flex-shrink-0">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition"
                        />
                        <p className="mt-2 text-sm text-center line-clamp-1">{movie.title}</p>
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
