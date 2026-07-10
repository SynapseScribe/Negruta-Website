import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import xml2js from 'xml2js';

const rssFeeds = [
  'https://www.thecatniptimes.com/feed/',
  'https://www.goodnewsnetwork.org/feed/'
];

const catPatterns = [
  /\bcat\b/i, /\bcats\b/i, /\bfeline\b/i, /\bfelines\b/i,
  /\bkitten\b/i, /\bkittens\b/i,
  /\bstray\s+cats?\b/i, /\blost\s+cats?\b/i,
  /\brescue\s+cats?\b/i, /\bpet\s+cats?\b/i,
  /\bcats?\s+care\b/i, /\bcats?\s+food\b/i,
  /\bcats?\s+health\b/i, /\bcats?\s+behavior\b/i
];

function extractText(val) {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] || '';
  if (val && typeof val._ === 'string') return val._;
  return '';
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&#\d+;/g, ' ');
}

function isCatRelated(item) {
  const text = `${item.title} ${stripHtml(extractText(item.description))}`;
  return catPatterns.some((p) => p.test(text));
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
      description: extractText(item.description),
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
