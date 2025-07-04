// pages/frame/movie/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function FrameMovie() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => setMovie(data));

    fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&include_image_language=en,null`)
      .then(res => res.json())
      .then(data => {
        const logos = data.logos || [];
        if (logos.length > 0) {
          setLogo(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
        }
      });
  }, [id]);

  if (!movie) return <div className="text-white p-6">Loading...</div>;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`;

  return (
    <>
      <Head>
        <title>{movie.title} • StreamTobi</title>
      </Head>

      <div
        className="relative min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />

        <Header />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 w-full">
            <iframe
              key={id}
              src={`https://vidfast.pro/movie/${id}?autoPlay=true&theme=red&title=false`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cast"
              allowFullScreen
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full aspect-video rounded-lg shadow-xl"
            />
          </div>

          <div className="lg:w-1/4 space-y-6 mb-8 text-gray-300">
            <div className="flex justify-center">
              {logo && (
                <img
                  className="w-48 h-auto object-contain mx-auto sm:w-64"
                  src={logo}
                  alt={movie.title}
                />
              )}
            </div>
            <div className="flex items-center space-x-4 justify-center text-sm">
              <span className="flex items-center text-red-400">⭐ {movie.vote_average?.toFixed(2)} / 10</span>
              <span>{movie.release_date}</span>
            </div>
            <p className="text-sm text-center">{movie.overview}</p>
          </div>
        </main>
      </div>
    </>
  );
}
