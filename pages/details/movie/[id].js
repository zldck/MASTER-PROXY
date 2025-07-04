// pages/details/movie/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';

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

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setPoster(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
      });

    fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const logoImage = data.logos?.[0]?.file_path;
        if (logoImage) setLogo(`https://image.tmdb.org/t/p/original${logoImage}`);
      });

    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast(data.cast || []));

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
      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero Backdrop */}
        <motion.div
          className="relative h-[60vh] w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <motion.h1
            className="absolute bottom-20 left-10 text-4xl sm:text-6xl font-bold drop-shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {movie.title}
          </motion.h1>
        </motion.div>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {logo && (
            <motion.img
              src={logo}
              alt="Logo"
              className="h-16 sm:h-24 w-auto mx-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
          )}

          <p className="text-sm text-gray-300 mb-4 text-center">
            {movie.release_date} • ⭐ {movie.vote_average?.toFixed(1)}/10
          </p>

          <AnimatePresence>
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a
                href={`/frame/movie/${id}`}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white font-semibold shadow transition"
              >
                Watch Now
              </a>
            </motion.div>
          </AnimatePresence>

          <motion.p
            className="mb-8 text-gray-300 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {movie.overview}
          </motion.p>

          {trailer && (
            <motion.div
              className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <iframe
                src={trailer}
                title="Trailer"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </motion.div>
          )}

          {/* Cast */}
          <motion.h3
            className="text-2xl font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Cast
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            {cast.slice(0, 12).map(actor => (
              <div key={actor.id} className="flex flex-col items-center">
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <p className="mt-2 text-sm font-medium text-center">{actor.name}</p>
                <p className="text-xs text-gray-400 text-center">as {actor.character}</p>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </>
  );
}
