// pages/frame/series/[id].js
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const API_KEY = 'b2b5c3479e0348c308499b783fb337b8';

export default function FrameSeries() {
  const router = useRouter();
  const { id, season, episode } = router.query;

  const [series, setSeries] = useState(null);
  const [logo, setLogo] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [dropdownUp, setDropdownUp] = useState({ season: false, episode: false });

  const seasonBtnRef = useRef(null);
  const episodeBtnRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setSeries(data);
        setSeasons(data.seasons || []);
      });

    fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const logos = data.logos || [];
        if (logos.length > 0) {
          setLogo(`https://image.tmdb.org/t/p/original${logos[0].file_path}`);
        }
      });
  }, [id]);

  useEffect(() => {
    if (season) setSelectedSeason(parseInt(season));
    if (episode) setSelectedEpisode(parseInt(episode));
  }, [season, episode]);

  useEffect(() => {
    if (!id || selectedSeason === null) return;
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setEpisodes(data.episodes || []);
      });
  }, [id, selectedSeason]);

  useEffect(() => {
    const checkDropdown = () => {
      if (seasonBtnRef.current) {
        const rect = seasonBtnRef.current.getBoundingClientRect();
        setDropdownUp(prev => ({ ...prev, season: rect.bottom + 250 > window.innerHeight }));
      }
      if (episodeBtnRef.current) {
        const rect = episodeBtnRef.current.getBoundingClientRect();
        setDropdownUp(prev => ({ ...prev, episode: rect.bottom + 250 > window.innerHeight }));
      }
    };
    window.addEventListener('resize', checkDropdown);
    checkDropdown();
    return () => window.removeEventListener('resize', checkDropdown);
  }, [episodes, seasons]);

  const backdrop = series?.backdrop_path || series?.poster_path;
  const streamUrl = selectedSeason && selectedEpisode
    ? `https://vidfast.pro/tv/${id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&theme=red&title=false`
    : '';

  return (
    <>
      <Head>
        <title>{series?.name} • StreamTobi</title>
      </Head>

      <div
        className="relative min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />

        <Header />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 w-full">
            {series && selectedSeason && selectedEpisode && episodes.length > 0 ? (
              <iframe
                key={streamUrl}
                src={streamUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cast"
                allowFullScreen
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full aspect-video rounded-lg shadow-xl"
              />
            ) : (
              <div className="aspect-video w-full flex items-center justify-center text-gray-500 border border-gray-700 rounded-lg">
                Select a season and episode.
              </div>
            )}

            <div
              className={`flex flex-col sm:flex-row gap-4 mt-4 p-4 rounded transition-all duration-300 ease-in-out ${hovered ? 'bg-black/60' : 'bg-black/30'}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Listbox value={selectedSeason} onChange={val => {
                setSelectedSeason(val);
                setSelectedEpisode(null);
                router.push(`/frame/series/${id}?season=${val}`);
              }}>
                <div ref={seasonBtnRef} className="relative w-full sm:w-1/2">
                  <Listbox.Button className="w-full bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition">
                    {selectedSeason ? `Season ${selectedSeason}` : 'Select Season'}
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in-out duration-200 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Listbox.Options className={`absolute ${dropdownUp.season ? 'bottom-full mb-2' : 'top-full mt-1'} max-h-60 w-full overflow-hidden rounded-md bg-black/80 text-white shadow-lg ring-1 ring-white/10 z-50 backdrop-blur-sm overflow-y-auto no-scrollbar`}>
                      {seasons.map(season => (
                        <Listbox.Option
                          key={season.id}
                          value={season.season_number}
                          className={({ active }) => `px-4 py-2 cursor-pointer ${active ? 'bg-red-600' : ''}`}
                        >
                          Season {season.season_number}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              <Listbox value={selectedEpisode} onChange={val => {
                setSelectedEpisode(val);
                router.push(`/frame/series/${id}?season=${selectedSeason}&episode=${val}`);
              }}>
                <div ref={episodeBtnRef} className="relative w-full sm:w-1/2">
                  <Listbox.Button className="w-full bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition">
                    {selectedEpisode ? `Episode ${selectedEpisode}` : 'Select Episode'}
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in-out duration-200 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Listbox.Options className={`absolute ${dropdownUp.episode ? 'bottom-full mb-2' : 'top-full mt-1'} max-h-60 w-full overflow-hidden rounded-md bg-black/80 text-white shadow-lg ring-1 ring-white/10 z-50 backdrop-blur-sm overflow-y-auto no-scrollbar`}>
                      {episodes.map(ep => (
                        <Listbox.Option
                          key={ep.id}
                          value={ep.episode_number}
                          className={({ active }) => `px-4 py-2 cursor-pointer ${active ? 'bg-red-600' : ''}`}
                        >
                          Episode {ep.episode_number}: {ep.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          <div className="lg:w-1/4 space-y-6 mb-8 text-gray-300">
            <div className="flex justify-center">
              {logo && (
                <img
                  className="w-48 h-auto object-contain mx-auto sm:w-64"
                  src={logo}
                  alt={series?.name}
                />
              )}
            </div>
            <div className="flex items-center space-x-4 justify-center text-sm">
              <span className="flex items-center text-red-400">⭐ {series?.vote_average?.toFixed(2)} / 10</span>
              <span>{series?.first_air_date}</span>
            </div>
            <p className="text-sm text-center">{series?.overview}</p>
          </div>
        </main>
      </div>
    </>
  );
}
