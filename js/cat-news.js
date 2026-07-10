async function loadCatNews() {
  const newsList = document.getElementById('cat-news-list');
  if (!newsList) return;

  newsList.innerHTML = '<li>Loading cat news…</li>';

  try {
    const res = await fetch('data/cat-news.json');
    if (!res.ok) throw new Error('Failed to load news data');
    const items = await res.json();

    newsList.innerHTML = '';
    document.querySelector('.top-cat-news h3').textContent = 'Top 10 Trending Cat News';

    if (items.length === 0) {
      newsList.innerHTML = '<li>No cat news available right now.</li>';
      return;
    }

    for (const item of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.title;
      li.appendChild(a);
      newsList.appendChild(li);
    }
  } catch {
    newsList.innerHTML = '<li>Unable to load cat news.</li>';
  }
}

document.addEventListener('DOMContentLoaded', loadCatNews);
