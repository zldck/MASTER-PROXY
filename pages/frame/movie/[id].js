import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function FrameMovie() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Fetch movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => setMovie(data));

    // Fetch movie logos
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
        style={{
          backgroundImage: `url(${backdrop})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />

        {/* Header Bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10">
          {/* Left: Nav Buttons */}
          <div className="text-sm space-x-4">
            <Link href="/" className="hover:text-red-400 transition">🏠 Home</Link>
            <Link href="/browse/movie" className="hover:text-red-400 transition">🎞 Browse</Link>
          </div>
          {/* Center: Logo Title */}
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-center">StreamTobi</h1>
          {/* Right: Empty space for balance */}
          <div className="w-24" />
        </header>

        {/* Content */}
        <div className="relative z-10">
          <main className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
            {/* Left: Video player */}
            <div className="lg:w-3/4 w-full">
              <iframe
                src={`https://vidfast.pro/movie/${id}?autoPlay=true&theme=red&title=false`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cast"
                allowFullScreen
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full aspect-video rounded-lg shadow-xl"
              />
            </div>

            {/* Right: Logo + Info */}
            <div className="lg:w-1/4 space-y-6 mb-8 text-gray-300">
              {/* Logo */}
              <div className="flex justify-center">
                {logo && (
                  <img
                    className="w-48 h-auto object-contain mx-auto sm:w-64"
                    src={logo}
                    alt={movie.title}
                  />
                )}
              </div>

              {/* Rating + Release Date */}
              <div className="flex items-center space-x-4 justify-center text-sm">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-red-600 mr-1"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  {movie.vote_average?.toFixed(2)}/10
                </span>
                <span>{movie.release_date}</span>
              </div>

              {/* Plot Summary */}
              <p className="text-sm text-center">
                {movie.overview}
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
