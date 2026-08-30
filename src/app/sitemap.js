export default function sitemap() {
  const baseUrl = 'https://www.ladynest.store';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Agar aapke paas aur pages hain (e.g. contact, about) to wo bhi yahan add kar sakte hain
  ];
}