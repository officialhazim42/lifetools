import React, { useEffect } from 'react';

const BASE_DOMAIN = 'https://lifetools.surge.sh';

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
  image,
  imageAlt,
  url,
  type = 'website'
}) => {
  useEffect(() => {
    const formattedTitle = title.includes('LifeTools') ? title : `${title} — LifeTools`;
    document.title = formattedTitle;

    // Resolve URL
    let fullUrl = url;
    if (!fullUrl && typeof window !== 'undefined') {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      if (hash && hash !== '#' && hash !== '#/') {
        fullUrl = `${BASE_DOMAIN}/${hash.replace(/^#\/?/, '')}`;
      } else if (pathname && pathname !== '/' && pathname !== '/index.html' && pathname !== '/200.html') {
        fullUrl = `${BASE_DOMAIN}${pathname.replace(/\/index\.html$/, '')}`;
      } else {
        fullUrl = `${BASE_DOMAIN}/`;
      }
    } else if (!fullUrl) {
      fullUrl = `${BASE_DOMAIN}/`;
    }

    // Resolve image if not explicitly provided
    let resolvedImage = image;
    if (!resolvedImage) {
      if (fullUrl.includes('/tool/')) {
        const toolId = fullUrl.split('/tool/')[1]?.split(/[?#]/)[0];
        if (toolId) resolvedImage = `${BASE_DOMAIN}/og-previews/tools/${toolId}.png`;
      } else if (fullUrl.includes('/categories/')) {
        const catId = fullUrl.split('/categories/')[1]?.split(/[?#]/)[0];
        if (catId) resolvedImage = `${BASE_DOMAIN}/og-previews/categories/${catId}.png`;
      }
    }
    if (!resolvedImage) {
      resolvedImage = `${BASE_DOMAIN}/og-preview.png`;
    }

    // Force HTTPS on image
    resolvedImage = resolvedImage.replace(/^http:\/\//, 'https://');
    const resolvedAlt = imageAlt || formattedTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Description
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:site_name', 'LifeTools');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', resolvedImage);
    setMeta('property', 'og:image:secure_url', resolvedImage);
    setMeta('property', 'og:image:type', 'image/png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', resolvedAlt);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedImage);
    setMeta('name', 'twitter:image:alt', resolvedAlt);

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
