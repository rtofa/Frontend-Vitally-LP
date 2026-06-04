import type { MetadataRoute } from 'next';

const BASE_URL = 'https://vitallyoficial.com.br';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vitallyoficial.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${API_URL}/api/v1/products/active`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const products: { id: string | number }[] = Array.isArray(data)
        ? data
        : data?.content ?? [];

      productRoutes = products.map((product) => ({
        url: `${BASE_URL}/shop/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // If API fails, return only static routes — don't break the sitemap
    console.warn('[sitemap] Could not fetch products from API.');
  }

  return [...staticRoutes, ...productRoutes];
}
