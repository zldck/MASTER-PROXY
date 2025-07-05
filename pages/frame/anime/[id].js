import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AnimeFrame() {
  const router = useRouter();
  const { id } = router.query;

  const [primarySrc, setPrimarySrc] = useState('');
  const [fallbackSrc, setFallbackSrc] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const [animeTitle, setAnimeTitle] = useState('');

  useEffect(() => {
    if (!id) return;

    const tmdbKey = 'b2b5c3479e0348c308499b783fb337b8';

    // Get anime info from TMDB
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbKey}`)
      .then(res => res.json())
      .then(data => {
        setAnimeTitle(data.name || data.original_name || 'Anime Player');
        const titleSlug = encodeURIComponent((data.name || '').toLowerCase().replace(/\s+/g, '-'));

        // Custom logic: assign rapid-cloud iframe manually or by title
        const rapidCloudEmbed = `https://rapid-cloud.co/embed-2/v2/e-1/sCc59zOX5Vdp?autoPlay=1&oa=0`;

        setPrimarySrc(rapidCloudEmbed);
        setFallbackSrc(`https://vidfast.pro/movie/${id}?autoPlay=true`);
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>{animeTitle} • Watch Anime</title>
        <meta name="description" content={`Watch ${animeTitle} streaming online.`} />
      </Head>

      <div className="w-full h-screen bg-black">
        <iframe
          src={useFallback ? fallbackSrc : primarySrc}
          onError={() => setUseFallback(true)}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </>
  );
}
