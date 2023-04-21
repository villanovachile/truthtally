import connectToDatabase from '@/utils/mongo-connection';
import xmlbuilder from 'xmlbuilder';

let sitemapCache = {
  sitemap: '',
  timestamp: null
};

const cacheDuration = 24 * 60 * 60 * 1000;

async function fetchListsFromDatabase() {
  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const lists = await collection.find({ unlisted: false }, { projection: { _id: 0, uri: 1 } }).toArray();
    return lists;
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
}

async function generateSitemap() {
  const baseUrl = 'https://truthtallyranker.com';

  const staticPages = [
    '/',
    '/lists/',
    '/lists/unranked/',
    '/lists/ranked/',
    '/privacy/',
    '/contact/',
    '/about/',
    '/list/'
  ];

  const lists = await fetchListsFromDatabase();

  const urlset = xmlbuilder.create('urlset', { encoding: 'UTF-8' });
  urlset.attribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  staticPages.forEach((page) => {
    const url = urlset.ele('url');
    url.ele('loc', `${baseUrl}${page}`);
    url.ele('changefreq', 'weekly');
    url.ele('priority', 0.8);
  });

  lists.forEach((list) => {
    const url = urlset.ele('url');
    url.ele('loc', `${baseUrl}/list/${list.uri}`);
    url.ele('changefreq', 'weekly');
    url.ele('priority', 0.8);
  });

  const sitemap = urlset.end({ pretty: true });
  return sitemap;
}

export default async function handler(req, res) {
  const now = new Date().getTime();
  const isCacheValid = sitemapCache.timestamp && now - sitemapCache.timestamp < cacheDuration;

  if (!isCacheValid) {
    sitemapCache.sitemap = await generateSitemap();
    sitemapCache.timestamp = now;
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapCache.sitemap);
  res.end();
}
