import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function FrameSeries() {
  const router = useRouter();
  const { id, season = '1', episode = '1' } = router.query;

  const [show, setShow] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isAnime, setIsAnime] = useState(false);
  const [checked, setChecked] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [seasonList, setSeasonList] = useState([]);
  const [episodeList, setEpisodeList] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropUpSeason, setDropUpSeason] = useState(false);
  const [dropUpEpisode, setDropUpEpisode] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const seasonRef = useRef();
  const episodeRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        seasonRef.current && !seasonRef.current.contains(e.target) &&
        episodeRef.current && !episodeRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setShow(data);
        const animeFlag = data.genres?.some(g =>
          g.id === 16 || g.name.toLowerCase().includes('animation') || g.name.toLowerCase().includes('anime')
        );
        setIsAnime(animeFlag);
        setChecked(true);
        setSeasonList(data.seasons || []);
      });

    fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}&include_image_language=en,null`)
      .then(res => res.json())
      .then(data => {
        const logos = data.logos || [];
        if (logos.length > 0) {
          setLogo(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!id || !season) return;

    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setEpisodeList(data.episodes || []);
      });
  }, [id, season]);

  const handleIframeError = () => {
    setFallback(true);
    setHasError(true);
  };

  const checkDropDirection = (ref, setter) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setter(spaceBelow < 200);
  };

  const src = isAnime && !fallback && !hasError
    ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
    : `https://vidfast.pro/tv/${id}/${season}/${episode}`;

  const backdrop = `https://image.tmdb.org/t/p/original${show?.backdrop_path || show?.poster_path}`;

  const dropdownClass = (isOpen, dropUp) =>
    `absolute ${dropUp ? 'bottom-full mb-2' : 'top-full mt-1'} w-44 max-h-64 overflow-y-auto scroll-hide bg-black border border-white/10 rounded-md shadow-xl text-white text-sm transform transition-all duration-300 ease-in-out origin-top z-50 ` +
    (isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible');

  return (
    <>
      <Head>
        <title>{show?.name} • StreamTobi</title>
        <style>{`
          .scroll-hide::-webkit-scrollbar { display: none; }
          .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </Head>

      <div className="relative h-screen w-screen bg-cover bg-center text-white" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />
        <Header />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-80px)] overflow-hidden">
          <div className="lg:w-3/4 w-full flex flex-col space-y-6">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <iframe
                key={`${id}-${season}-${episode}-${fallback}`}
                src={src}
                frameBorder="0"
                scrolling="no"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full aspect-video"
                onError={handleIframeError}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-white text-sm relative z-50 overflow-visible">
              <div
                ref={seasonRef}
                className="relative"
                onMouseEnter={() => { if (!isMobile) setOpenDropdown('season'); checkDropDirection(seasonRef, setDropUpSeason); }}
                onMouseLeave={() => !isMobile && setOpenDropdown(null)}
              >
                <button
                  className="bg-black border border-white/20 px-4 py-2 rounded-lg transition hover:border-white hover:text-red-400"
                  onClick={() => {
                    if (isMobile) {
                      setOpenDropdown(openDropdown === 'season' ? null : 'season');
                      checkDropDirection(seasonRef, setDropUpSeason);
                    }
                  }}
                >
                  Season {season}
                </button>
                <div className={dropdownClass(openDropdown === 'season', dropUpSeason)}>
                  {seasonList.map((s) => (
                    <button
                      key={s.season_number}
                      onClick={() => {
                        setOpenDropdown(null);
                        router.push(`/frame/series/${id}?season=${s.season_number}&episode=1`);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-red-600 transition ${
                        s.season_number === parseInt(season) ? 'text-red-400' : ''
                      }`}
                    >
                      Season {s.season_number}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={episodeRef}
                className="relative"
                onMouseEnter={() => { if (!isMobile) setOpenDropdown('episode'); checkDropDirection(episodeRef, setDropUpEpisode); }}
                onMouseLeave={() => !isMobile && setOpenDropdown(null)}
              >
                <button
                  className="bg-black border border-white/20 px-4 py-2 rounded-lg transition hover:border-white hover:text-red-400"
                  onClick={() => {
                    if (isMobile) {
                      setOpenDropdown(openDropdown === 'episode' ? null : 'episode');
                      checkDropDirection(episodeRef, setDropUpEpisode);
                    }
                  }}
                >
                  Episode {episode}
                </button>
                <div className={dropdownClass(openDropdown === 'episode', dropUpEpisode)}>
                  {episodeList.map((ep) => (
                    <button
                      key={ep.episode_number}
                      onClick={() => {
                        setOpenDropdown(null);
                        router.push(`/frame/series/${id}?season=${season}&episode=${ep.episode_number}`);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-red-600 transition ${
                        ep.episode_number === parseInt(episode) ? 'text-red-400' : ''
                      }`}
                    >
                      Ep {ep.episode_number} — {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4 w-full space-y-6 overflow-hidden">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl transition-all duration-300 ease-in-out">
              {logo && (
                <div className="flex justify-center mb-4">
                  <img className="w-48 h-auto object-contain transition duration-500 ease-in-out" src={logo} alt={show?.name} />
                </div>
              )}
              {show && (
                <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                  <span className="text-red-400">
                    ⭐ {typeof show.vote_average === 'number' ? show.vote_average.toFixed(2) : 'N/A'} / 10
                  </span>
                  <span>{show.first_air_date || 'Unknown'}</span>
                </div>
              )}
              <p className="text-sm text-gray-300 mt-4 text-center leading-relaxed">
                {show?.overview}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}