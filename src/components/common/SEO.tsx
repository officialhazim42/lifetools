import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'LifeTools — Everything You Need. All in One Place.',
  description = 'Free, privacy-first digital utility tools for calculations, conversions, developer workflows, image editing, text formatting, and QR codes. 100% client-side.',
  image = 'https://lifetools.app/og-preview.png',
  imageAlt = 'LifeTools — Everything You Need. All in One Place.',
  url,
  type = 'website'
}) => {
  useEffect(() => {
    const formattedTitle = title.includes('LifeTools') ? title : `${title} — LifeTools`;
    document.title = formattedTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('property', 'og:type', type);

    const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://lifetools.app/');
    setMeta('property', 'og:url', fullUrl);

    // Twitter Card
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);
  }, [title, description, image, imageAlt, url, type]);

  return null;
};
export default SEO;
