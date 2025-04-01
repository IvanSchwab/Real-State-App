import { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!apiUrl || !apiKey || !siteUrl) {
  throw new Error('Missing API configuration');
}

const getProperties = async () => {
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

    const data = await response.json();
    return data.properties.map((property: any) => ({
      slug: property.slug || property.id, 
      updatedAt: property.updatedAt || new Date().toISOString().split('T')[0], 
    }));
  } catch (err) {
    console.error('Error fetching properties:', err);
    return [];
  }
};

const generateSitemap = (properties: { slug: string; updatedAt: string }[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${properties
    .map(
      (property) => `
  <url>
    <loc>${siteUrl}/propiedades/${property.slug}</loc>
    <lastmod>${property.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const properties = await getProperties(); 

  const sitemap = generateSitemap(properties);

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
