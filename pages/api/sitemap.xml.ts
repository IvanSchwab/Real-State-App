import { NextApiRequest, NextApiResponse } from 'next';

interface Property {
  propertyHash: string;
  lastUpdate?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!apiUrl || !apiKey || !siteUrl) {
  throw new Error('Missing API configuration');
}

const getProperties = async (): Promise<{ hash: string; updatedAt: string }[]> => {
  try {
    const response = await fetch(`${apiUrl}properties?oauth_token=${apiKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }

    const data = (await response.json()) as { properties: Property[] };

    return data.properties.map((property): { hash: string; updatedAt: string } => ({
      hash: property.propertyHash,
      updatedAt: property.lastUpdate
        ? new Date(property.lastUpdate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('Error fetching properties:', err);
    return [];
  }
};

const staticPages = [
  { slug: '', updatedAt: new Date().toISOString().split('T')[0] } 
];

const generateSitemap = (properties: { hash: string; updatedAt: string }[]) => {
  const allUrls = [...staticPages, ...properties.map(property => ({
    slug: `properties/${property.hash}`,
    updatedAt: property.updatedAt
  }))];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (item) => `
  <url>
    <loc>${siteUrl}/${item.slug}</loc>
    <lastmod>${item.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const properties = await getProperties();
  const sitemap = generateSitemap(properties);
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
