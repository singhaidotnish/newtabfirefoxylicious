async function pexelsUrl() {
  const topics = ['nature','technology','abstract'];
  const q = topics[Math.floor(Math.random()*topics.length)];
  const page = Math.floor(Math.random()*900)+1;
  const resp = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=1&page=${page}`, {
    headers: { Authorization: 'lUsXk5MnrrEQOoEUMJ2Om2nHFrkLvgDWGtFaegJA77RKQPXRHYevtOgp' }
  });
  const data = await resp.json();
  return data.photos[0].src.landscape;
}

window.addEventListener('DOMContentLoaded', async () => {
  try { setBackground(await pexelsUrl()); }
  catch(e){ console.warn(e); }
});
