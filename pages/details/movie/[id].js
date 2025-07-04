// pages/details/movie/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function MovieDetails() {
  const { id } = useRouter().query;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [logo, setLogo] = useState(null);
  const [poster, setPoster] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Get movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setPoster(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
      });

    // Get logo image
    fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const logoImage = data.logos?.[0]?.file_path;
        if (logoImage) setLogo(`https://image.tmdb.org/t/p/original${logoImage}`);
      });

    // Get cast
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast(data.cast || []));

    // Get trailer
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const yt =
          data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
          data.results.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
          data.results.find(v => v.site === 'YouTube');

        if (yt) setTrailer(`https://www.youtube.com/embed/${yt.key}`);
      });
  }, [id]);

  if (!movie) return <div className="text-white p-6">Loading...</div>;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`;

  return (
    <>
      <Head><title>{movie.title} • StreamTobi</title></Head>

      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10">
          <div className="space-x-4 text-sm">
            <Link href="/" className="hover:text-red-400">🏠 Home</Link>
            <Link href="/browse/movie" className="hover:text-red-400">🎞 Browse</Link>
          </div>
          <h1 className="text-xl font-bold italic tracking-wide">StreamTobi</h1>
          <div className="w-24" />
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 text-white text-center">
          {/* Title Logo */}
          {logo && <img src={logo} alt={movie.title} className="h-16 sm:h-24 w-auto mx-auto mb-4" />}

          {/* Poster */}
          {poster && <img src={poster} alt={movie.title} className="w-full md:w-1/3 rounded-lg shadow-md object-cover mx-auto hidden sm:block mb-6" />}

          <h2 className="text-4xl font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{movie.release_date} • ⭐ {movie.vote_average?.toFixed(1)}/10</p>

          {/* Play Button */}
          <div className="flex justify-center mt-4 mb-6">
            <Link href={`/frame/movie/${id}`}>
              <button className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 transition-transform hover:scale-105">
                ▶ WATCH NOW
              </button>
            </Link>
          </div>

          <p className="text-sm leading-relaxed pb-6 max-w-3xl mx-auto">{movie.overview}</p>

          {/* Trailer */}
          {trailer && (
            <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={trailer}
                title="Trailer"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          )}

          {/* Cast */}
          <h3 className="text-2xl font-semibold mt-10">Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-6 px-4">
            {cast.slice(0, 12).map(actor => (
              <div key={actor.id} className="flex flex-col items-center">
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <p className="mt-2 text-sm font-medium">{actor.name}</p>
                <p className="text-xs text-gray-400">as {actor.character}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
