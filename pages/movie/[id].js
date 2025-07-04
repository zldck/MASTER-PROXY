import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query;

  const [movieTitle, setMovieTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMovieTitle = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=b2b5c3479e0348c308499b783fb337b8`);
        const data = await res.json();
        setMovieTitle(data.title || 'Unknown Title');
      } catch (err) {
        console.error('Failed to fetch title:', err);
        setMovieTitle('Unknown Title');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieTitle();
  }, [id]);

  const streamUrl = id ? `https://vidfast.pro/movie/${id}?autoPlay=true` : '';

  if (!id || loading) {
    return (
      <div style={styles.loadingScreen}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Now Playing: {movieTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="https://www.themoviedb.org/assets/2/favicon-ec6b9fcd6c8c7f0d3b1329c0e7c7b3ad.ico" />
      </Head>

      <div style={styles.wrapper}>
        <div style={styles.header}>
          🎬 <strong>Now Playing:</strong> {movieTitle} • TMDB ID: {id}
        </div>

        <div style={styles.playerWrapper}>
          <iframe
            src={streamUrl}
            allow="autoplay; fullscreen"
            allowFullScreen
            style={styles.iframe}
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: '18px',
    marginBottom: '20px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  playerWrapper: {
    width: '95%',
    maxWidth: '900px',
    aspectRatio: '16 / 9',
    boxShadow: '0 0 20px rgba(255,255,255,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loadingScreen: {
    background: '#000',
    color: '#fff',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
  }
};
