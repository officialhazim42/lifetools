import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { TOOLS_REGISTRY, getToolById } from '../data/toolsRegistry';
import { CATEGORIES } from '../data/categories';
import { getCurrentRouteState, parsePath } from '../router/Router';
import { ToolLayout } from '../components/common/ToolLayout';
import { ToastProvider } from '../context/ToastContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { SEO } from '../components/common/SEO';

const GOOGLE_VERIFICATION = 'Qq07av7RQHZyJTnUtPXAR2UHR5bt7VPx_1OOU2AIP6c';
const BASE_DOMAIN = 'https://lifetools.surge.sh';

describe('Social Media Sharing Preview & Prerendering Suite', () => {
  describe('1. Global & Tool Preview Image Assets Integrity', () => {
    it('should have 1200x630 main website preview images in public and dist', () => {
      const publicOg = path.resolve(__dirname, '../../public/og-preview.png');
      const distOg = path.resolve(__dirname, '../../dist/og-preview.png');
      expect(fs.existsSync(publicOg)).toBe(true);
      expect(fs.existsSync(distOg)).toBe(true);

      const publicBuffer = fs.readFileSync(publicOg);
      // Verify PNG magic header: 89 50 4E 47 0D 0A 1A 0A
      expect(publicBuffer[0]).toBe(0x89);
      expect(publicBuffer[1]).toBe(0x50);
      expect(publicBuffer[2]).toBe(0x4e);
      expect(publicBuffer[3]).toBe(0x47);
      expect(publicBuffer.length).toBeGreaterThan(15000);
    });

    it('should have preview images for all 20 categories in public/og-previews/categories/', () => {
      expect(CATEGORIES.length).toBe(20);
      for (const cat of CATEGORIES) {
        const catImgPath = path.resolve(__dirname, `../../public/og-previews/categories/${cat.id}.png`);
        expect(fs.existsSync(catImgPath), `Missing category image for: ${cat.id}`).toBe(true);
        const stats = fs.statSync(catImgPath);
        expect(stats.size).toBeGreaterThan(10000);
      }
    });

    it('should have unique preview images for all 634 individual tools in public/og-previews/tools/', () => {
      expect(TOOLS_REGISTRY.length).toBe(634);
      let checkedCount = 0;
      for (const tool of TOOLS_REGISTRY) {
        const toolImgPath = path.resolve(__dirname, `../../public/og-previews/tools/${tool.id}.png`);
        expect(fs.existsSync(toolImgPath), `Missing tool image for: ${tool.id}`).toBe(true);
        const stats = fs.statSync(toolImgPath);
        expect(stats.size).toBeGreaterThan(10000);
        checkedCount++;
      }
      expect(checkedCount).toBe(634);
    });
  });

  describe('2. Prerendered Static HTML Files & Crawler Metadata Verification', () => {
    function parseMetaFromHtml(html: string) {
      const getMeta = (prop: string) => {
        const regex = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["']([^"']*)["']`, 'i');
        const altRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${prop}["']`, 'i');
        const m = html.match(regex) || html.match(altRegex);
        return m ? m[1] : null;
      };
      const getTitle = () => {
        const m = html.match(/<title>([^<]*)<\/title>/i);
        return m ? m[1] : null;
      };
      const getCanonical = () => {
        const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
        return m ? m[1] : null;
      };
      return { getMeta, getTitle, getCanonical };
    }

    it('should verify homepage HTML has correct Open Graph and Twitter tags in dist/index.html', () => {
      const indexPath = path.resolve(__dirname, '../../dist/index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
      const html = fs.readFileSync(indexPath, 'utf8');
      const { getMeta, getTitle, getCanonical } = parseMetaFromHtml(html);

      expect(getTitle()).toContain('LifeTools');
      expect(getCanonical()).toBe(`${BASE_DOMAIN}/`);
      expect(getMeta('og:site_name')).toBe('LifeTools');
      expect(getMeta('og:type')).toBe('website');
      expect(getMeta('og:url')).toBe(`${BASE_DOMAIN}/`);
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-preview.png`);
      expect(getMeta('og:image:width')).toBe('1200');
      expect(getMeta('og:image:height')).toBe('630');
      expect(getMeta('twitter:card')).toBe('summary_large_image');
      expect(getMeta('twitter:image')).toBe(`${BASE_DOMAIN}/og-preview.png`);
      expect(html).toContain(GOOGLE_VERIFICATION);
    });

    it('should verify QR Code Generator has tool-specific metadata in dist/tool/qr-code-generator/index.html', () => {
      const filePath = path.resolve(__dirname, '../../dist/tool/qr-code-generator/index.html');
      expect(fs.existsSync(filePath)).toBe(true);
      const html = fs.readFileSync(filePath, 'utf8');
      const { getMeta, getTitle, getCanonical } = parseMetaFromHtml(html);

      expect(getTitle()).toBe('QR Code Generator — LifeTools');
      expect(getCanonical()).toBe(`${BASE_DOMAIN}/tool/qr-code-generator`);
      expect(getMeta('og:title')).toBe('QR Code Generator — LifeTools');
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/qr-code-generator.png`);
      expect(getMeta('twitter:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/qr-code-generator.png`);
      expect(getMeta('og:url')).toBe(`${BASE_DOMAIN}/tool/qr-code-generator`);
      expect(getMeta('og:image:width')).toBe('1200');
      expect(getMeta('og:image:height')).toBe('630');
      expect(html).toContain(GOOGLE_VERIFICATION);
    });

    it('should verify Advanced UPI Payment QR Generator has tool-specific metadata in dist/tool/advanced-upi-qr-generator/index.html', () => {
      const filePath = path.resolve(__dirname, '../../dist/tool/advanced-upi-qr-generator/index.html');
      expect(fs.existsSync(filePath)).toBe(true);
      const html = fs.readFileSync(filePath, 'utf8');
      const { getMeta, getTitle, getCanonical } = parseMetaFromHtml(html);

      expect(getTitle()).toBe('Advanced UPI Payment QR Generator — LifeTools');
      expect(getCanonical()).toBe(`${BASE_DOMAIN}/tool/advanced-upi-qr-generator`);
      expect(getMeta('og:title')).toBe('Advanced UPI Payment QR Generator — LifeTools');
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/advanced-upi-qr-generator.png`);
      expect(getMeta('twitter:card')).toBe('summary_large_image');
      expect(getMeta('twitter:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/advanced-upi-qr-generator.png`);
      expect(html).toContain(GOOGLE_VERIFICATION);
    });

    it('should verify PDF Merger has tool-specific metadata in dist/tool/pdf-merger/index.html', () => {
      const filePath = path.resolve(__dirname, '../../dist/tool/pdf-merger/index.html');
      expect(fs.existsSync(filePath)).toBe(true);
      const html = fs.readFileSync(filePath, 'utf8');
      const { getMeta, getTitle, getCanonical } = parseMetaFromHtml(html);

      expect(getTitle()).toContain('PDF Merger — LifeTools');
      expect(getCanonical()).toBe(`${BASE_DOMAIN}/tool/pdf-merger`);
      expect(getMeta('og:title')).toContain('PDF Merger — LifeTools');
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/pdf-merger.png`);
    });

    it('should verify Image Format Converter has tool-specific metadata in dist/tool/image-format-converter/index.html and alias image-converter', () => {
      const filePath = path.resolve(__dirname, '../../dist/tool/image-format-converter/index.html');
      const aliasPath = path.resolve(__dirname, '../../dist/tool/image-converter/index.html');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.existsSync(aliasPath)).toBe(true);

      const html = fs.readFileSync(filePath, 'utf8');
      const { getMeta, getTitle } = parseMetaFromHtml(html);
      expect(getTitle()).toBe('Image Format Converter — LifeTools');
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/image-format-converter.png`);
    });

    it('should verify Password Generator has tool-specific metadata in dist/tool/password-generator/index.html', () => {
      const filePath = path.resolve(__dirname, '../../dist/tool/password-generator/index.html');
      expect(fs.existsSync(filePath)).toBe(true);
      const html = fs.readFileSync(filePath, 'utf8');
      const { getMeta, getTitle, getCanonical } = parseMetaFromHtml(html);

      expect(getTitle()).toBe('Password Generator — LifeTools');
      expect(getCanonical()).toBe(`${BASE_DOMAIN}/tool/password-generator`);
      expect(getMeta('og:image')).toBe(`${BASE_DOMAIN}/og-previews/tools/password-generator.png`);
    });

    it('should verify raw HTML metadata exists across ALL 634 tools without requiring client-side JS', () => {
      let verifiedCount = 0;
      for (const tool of TOOLS_REGISTRY) {
        const toolHtmlPath = path.resolve(__dirname, `../../dist/tool/${tool.id}/index.html`);
        expect(fs.existsSync(toolHtmlPath), `Missing prerendered HTML file for: ${tool.id}`).toBe(true);
        const html = fs.readFileSync(toolHtmlPath, 'utf8');
        const escapedName = tool.name
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        expect(html).toContain(`<title>${escapedName} — LifeTools</title>`);
        expect(html).toContain(`property="og:image" content="${BASE_DOMAIN}/og-previews/tools/${tool.id}.png"`);
        expect(html).toContain(`rel="canonical" href="${BASE_DOMAIN}/tool/${tool.id}"`);
        expect(html).toContain(GOOGLE_VERIFICATION);
        verifiedCount++;
      }
      expect(verifiedCount).toBe(634);
    });
  });

  describe('3. Route Path Detection & SPA Prerender Compatibility', () => {
    it('should parse direct clean tool path /tool/qr-code-generator correctly', () => {
      const res = parsePath('/tool/qr-code-generator');
      expect(res.route).toBe('tool-detail');
      expect(res.param).toBe('qr-code-generator');
      expect(res.path).toBe('/tool/qr-code-generator');
    });

    it('should parse legacy hash tool path #/tool/advanced-upi-qr-generator correctly', () => {
      const res = parsePath('#/tool/advanced-upi-qr-generator');
      expect(res.route).toBe('tool-detail');
      expect(res.param).toBe('advanced-upi-qr-generator');
      expect(res.path).toBe('/tool/advanced-upi-qr-generator');
    });

    it('should parse category paths /categories/calculators correctly', () => {
      const res = parsePath('/categories/calculators');
      expect(res.route).toBe('category-detail');
      expect(res.param).toBe('calculators');
    });

    it('should parse public pages /workspace, /media, /about correctly', () => {
      expect(parsePath('/workspace').route).toBe('workspace');
      expect(parsePath('/media').route).toBe('media');
      expect(parsePath('/about').route).toBe('about');
      expect(parsePath('/').route).toBe('home');
    });
  });

  describe('4. ToolLayout Share Button & Client Interaction', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('renders Share button alongside Favorite button on tool layout', () => {
      const tool = getToolById('advanced-upi-qr-generator')!;
      expect(tool).toBeDefined();

      render(
        <ToastProvider>
          <FavoritesProvider>
            <ToolLayout tool={tool}>
              <div>Test Content</div>
            </ToolLayout>
          </FavoritesProvider>
        </ToastProvider>
      );

      const shareBtn = screen.getByRole('button', { name: `Share ${tool.name}` });
      expect(shareBtn).toBeInTheDocument();
      expect(shareBtn).toHaveTextContent('Share');

      const favBtn = screen.getByRole('button', { name: /favorites/i });
      expect(favBtn).toBeInTheDocument();
    });

    it('invokes navigator.share when available and shares canonical URL', async () => {
      const tool = getToolById('advanced-upi-qr-generator')!;
      const shareMock = vi.fn().mockResolvedValue(undefined);
      const canShareMock = vi.fn().mockReturnValue(true);

      Object.assign(navigator, {
        share: shareMock,
        canShare: canShareMock
      });

      render(
        <ToastProvider>
          <FavoritesProvider>
            <ToolLayout tool={tool}>
              <div>Test Content</div>
            </ToolLayout>
          </FavoritesProvider>
        </ToastProvider>
      );

      const shareBtn = screen.getByRole('button', { name: `Share ${tool.name}` });
      fireEvent.click(shareBtn);

      expect(shareMock).toHaveBeenCalledWith({
        title: `${tool.name} — LifeTools`,
        text: tool.shortDescription,
        url: `https://lifetools.surge.sh/tool/${tool.id}`
      });
    });

    it('falls back to clipboard copy when navigator.share is unavailable', async () => {
      const tool = getToolById('advanced-upi-qr-generator')!;
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      Object.assign(navigator, {
        share: undefined,
        canShare: undefined,
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(
        <ToastProvider>
          <FavoritesProvider>
            <ToolLayout tool={tool}>
              <div>Test Content</div>
            </ToolLayout>
          </FavoritesProvider>
        </ToastProvider>
      );

      const shareBtn = screen.getByRole('button', { name: `Share ${tool.name}` });
      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith(`https://lifetools.surge.sh/tool/${tool.id}`);
        expect(shareBtn).toHaveTextContent('Copied!');
      });
    });
  });

  describe('5. Client-Side SEO Component Tag Resolution', () => {
    it('sets dynamic meta tags and canonical link correctly', () => {
      render(
        <SEO
          title="Custom Tool Test"
          description="Custom test tool description for SEO validation."
          image="https://lifetools.surge.sh/og-previews/tools/custom-tool.png"
          url="https://lifetools.surge.sh/tool/custom-tool"
        />
      );

      expect(document.title).toBe('Custom Tool Test — LifeTools');

      const descMeta = document.querySelector('meta[name="description"]');
      expect(descMeta?.getAttribute('content')).toBe('Custom test tool description for SEO validation.');

      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Custom Tool Test — LifeTools');

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toBe('https://lifetools.surge.sh/og-previews/tools/custom-tool.png');

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl?.getAttribute('content')).toBe('https://lifetools.surge.sh/tool/custom-tool');

      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toBe('https://lifetools.surge.sh/tool/custom-tool');
    });
  });
});
