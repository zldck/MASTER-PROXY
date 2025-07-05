import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function SeriesDetail() {
  const { id } = useRouter().query;
  const [series, setSeries] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);

  const seasonRef = useRef(null);
  const episodeRef = useRef(null);
  const [dropUpSeason, setDropUpSeason] = useState(false);
  const [dropUpEpisode, setDropUpEpisode] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkDropDirection = (ref, setter) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setter(spaceBelow < 200);
  };

  const handleToggle = (type) => {
    if (type === 'season') {
      setShowSeasonDropdown(prev => !prev);
      checkDropDirection(seasonRef, setDropUpSeason);
    } else {
      setShowEpisodeDropdown(prev => !prev);
      checkDropDirection(episodeRef, setDropUpEpisode);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setSeries(data);
        const first = data.seasons.find(s => s.season_number > 0);
        setSelectedSeason(first?.season_number || 1);
      });
  }, [id]);

  useEffect(() => {
    if (!id || selectedSeason == null) return;
    setLoadingEpisodes(true);
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setSeasonData(data.episodes || []);
        setSelectedEpisode(data.episodes?.[0]?.episode_number || 1);
        setLoadingEpisodes(false);
      });
  }, [id, selectedSeason]);

  const watchLink = selectedSeason && selectedEpisode
    ? `/frame/series/${id}?season=${selectedSeason}&episode=${selectedEpisode}`
    : null;

  if (!series) return <div className="text-white p-6">Loading...</div>;

  return (
    <>
      <Head><title>{series.name} • StreamTobi</title></Head>

      <div className="min-h-screen bg-black text-white">
        <Header />

        {series.backdrop_path && (
          <motion.div
            className="relative h-[60vh] w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
              alt={series.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <motion.h1
              className="absolute bottom-10 left-10 text-4xl sm:text-6xl font-bold drop-shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {series.name}
            </motion.h1>
          </motion.div>
        )}

        <main className="max-w-5xl mx-auto px-6 py-10">
          <motion.p
            className="mb-6 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {series.overview}
          </motion.p>

          {/* Season Dropdown */}
          <div
            className="relative inline-block mb-6 z-20"
            ref={seasonRef}
            onMouseEnter={() => !isMobile && (setShowSeasonDropdown(true), checkDropDirection(seasonRef, setDropUpSeason))}
            onMouseLeave={() => !isMobile && setShowSeasonDropdown(false)}
            onClick={() => isMobile && handleToggle('season')}
          >
            <button className="bg-gray-900 text-white px-4 py-2 rounded-full shadow hover:bg-gray-800 transition-all duration-200 flex items-center gap-2">
              Season {selectedSeason} ▾
            </button>

            <AnimatePresence>
              {showSeasonDropdown && (
                <motion.ul
                  className={`absolute left-0 ${dropUpSeason ? 'bottom-full mb-2' : 'top-full mt-2'} w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden`}
                  style={{ scrollbarWidth: 'none' }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {series.seasons.filter(s => s.season_number > 0).map(season => (
                    <li
                      key={season.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-red-600 transition-all duration-150 ${season.season_number === selectedSeason ? 'bg-red-600' : ''}`}
                      onClick={() => setSelectedSeason(season.season_number)}
                    >
                      Season {season.season_number}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Episode Dropdown */}
          {seasonData.length > 0 && (
            <div
              className="relative inline-block mb-8 z-10"
              ref={episodeRef}
              onMouseEnter={() => !isMobile && (setShowEpisodeDropdown(true), checkDropDirection(episodeRef, setDropUpEpisode))}
              onMouseLeave={() => !isMobile && setShowEpisodeDropdown(false)}
              onClick={() => isMobile && handleToggle('episode')}
            >
              <button className="bg-gray-900 text-white px-4 py-2 rounded-full shadow hover:bg-gray-800 transition-all duration-200 flex items-center gap-2">
                Episode {selectedEpisode} ▾
              </button>

              <AnimatePresence>
                {showEpisodeDropdown && (
                  <motion.ul
                    className={`absolute left-0 ${dropUpEpisode ? 'bottom-full mb-2' : 'top-full mt-2'} w-64 max-h-[200px] overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg`}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <style jsx>{`
                      ::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {seasonData.map(ep => (
                      <li
                        key={ep.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-red-600 transition-all duration-150 ${ep.episode_number === selectedEpisode ? 'bg-red-600' : ''}`}
                        onClick={() => setSelectedEpisode(ep.episode_number)}
                      >
                        Ep {ep.episode_number}: {ep.name}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {watchLink && (
              <motion.a
                href={watchLink}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white inline-block font-semibold shadow transition"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Watch Now (S{selectedSeason} • E{selectedEpisode})
              </motion.a>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}