import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import xml2js from 'xml2js';

const rssFeeds = [
  'https://www.thecatniptimes.com/feed/',
  'https://www.goodnewsnetwork.org/feed/'
];

const catKeywords = [
  'cat', 'cats', 'feline', 'kitten', 'kittens',
  'stray cat', 'lost cat', 'rescue cat', 'pet cat'
];

function isCatRelated(item) {
  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  return catKeywords.some((kw) => text.includes(kw));
}

async function fetchFeed(rssUrl) {
  try {
    const res = await fetch(rssUrl);
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = await new Promise((resolve, reject) => {
      xml2js.parseString(xml, { explicitArray: false }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const items = parsed.rss?.channel?.item;
    if (!items) return [];

    const itemArr = Array.isArray(items) ? items : [items];

    return itemArr.map((item) => ({
      title: item.title || '',
      link: item.link || '',
      description: typeof item.description === 'string' ? item.description : (Array.isArray(item.description) ? item.description[0] : ''),
      pubDate: new Date(typeof item.pubDate === 'string' ? item.pubDate : '').getTime()
    })).filter((item) => !Number.isNaN(item.pubDate));
  } catch {
    return [];
  }
}

async function main() {
  const allItems = await Promise.all(rssFeeds.map(fetchFeed));
  let items = allItems.flat().filter(isCatRelated);

  items.sort((a, b) => b.pubDate - a.pubDate);

  const seen = new Set();
  const unique = [];
  for (const item of items) {
    if (!seen.has(item.link)) {
      seen.add(item.link);
      unique.push(item);
    }
  }

  const top10 = unique.slice(0, 10).map((item) => ({
    title: item.title,
    link: item.link
  }));
  const outputPath = join('data', 'cat-news.json');

  writeFileSync(outputPath, JSON.stringify(top10, null, 2));
  console.log(`Wrote ${top10.length} items to ${outputPath}`);
}

main();
