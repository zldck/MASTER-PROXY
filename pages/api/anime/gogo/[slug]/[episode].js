import { ANIME } from '@consumet/extensions';

export default async function handler(req, res) {
  const { slug, episode } = req.query;

  if (!slug || !episode) {
    return res.status(400).json({ error: 'Missing slug or episode' });
  }

  try {
    const gogo = new ANIME.Gogoanime();
    const servers = await gogo.fetchEpisodeServers(slug.toString(), Number(episode));

    if (!servers?.length) {
      return res.status(404).json({ error: 'No streaming sources found' });
    }

    const best = servers.find(s => s.name.toLowerCase().includes('gogo')) || servers[0];
    return res.status(200).json({ url: best.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch episode embed' });
  }
}
