import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TOOLS_REGISTRY, getToolsByCategory, getToolById } from '../data/toolsRegistry';
import { normalizeUrl, WebsiteStatusChecker, HttpHeaderChecker, UserAgentChecker } from '../components/tools/web/WebsiteAnalysisTools';
import { MetaTagAnalyzer, MetaTagPreview, RobotsTxtTester, SitemapValidator, UrlSlugChecker, SchemaMarkupValidator } from '../components/tools/web/SeoWebsiteTools';
import { Ipv4Validator, Ipv6Validator, SubnetCalculator, MacAddressFormatter, BandwidthCalculator, DownloadTimeCalculator } from '../components/tools/web/NetworkTools';
import { HtmlLivePreview, JavascriptPlayground, SvgOptimizer, CssUnitConverter } from '../components/tools/web/WebDevUtilities';
import { extractYoutubeId, YoutubeThumbnailViewer, YoutubeTimestampGenerator, WhatsappLinkGenerator, SocialMediaLinkGenerator } from '../components/tools/web/ContentUtilities';

describe('Web & Internet Utilities Suite (65 Tools)', () => {
  describe('1. Registry & Category Integrity', () => {
    it('should have exactly 65 registered tools under the web category', () => {
      const webTools = getToolsByCategory('web');
      expect(webTools.length).toBe(65);
    });

    it('should have unique IDs and defined components for all 65 web tools', () => {
      const webTools = getToolsByCategory('web');
      const ids = new Set(webTools.map((t) => t.id));
      expect(ids.size).toBe(65);

      webTools.forEach((tool) => {
        expect(tool.id).toBeTruthy();
        expect(tool.name).toBeTruthy();
        expect(tool.shortDescription).toBeTruthy();
        expect(tool.category).toBe('web');
        expect(tool.component).toBeDefined();
        expect(Array.isArray(tool.keywords)).toBe(true);
        expect(tool.keywords.length).toBeGreaterThan(0);
      });
    });
  });

  describe('2. Website Analysis Tools', () => {
    it('normalizes URLs prepending https:// protocol when omitted', () => {
      expect(normalizeUrl('github.com')).toBe('https://github.com');
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
      expect(normalizeUrl('https://lifetools.app/tools')).toBe('https://lifetools.app/tools');
    });

    it('renders UserAgentChecker with platform and screen dimensions', () => {
      render(<UserAgentChecker />);
      expect(screen.getByText(/Active Browser User Agent/i)).toBeDefined();
      expect(screen.getByText(/Browser Language/i)).toBeDefined();
    });

    it('parses and classifies security headers in HttpHeaderChecker', () => {
      render(<HttpHeaderChecker />);
      expect(screen.getByText(/Status Line/i)).toBeDefined();
      expect(screen.getAllByText(/strict-transport-security/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Security Header/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. SEO & Website Tools', () => {
    it('analyzes title and description character lengths in MetaTagAnalyzer', () => {
      render(<MetaTagAnalyzer />);
      expect(screen.getByText(/Page Title/i)).toBeDefined();
      expect(screen.getByText(/Meta Description/i)).toBeDefined();
      expect(screen.getAllByText(/LifeTools — 100% Free & Open Client-Side Digital Utilities/i).length).toBeGreaterThanOrEqual(1);
    });

    it('validates allowed and disallowed rules in RobotsTxtTester', () => {
      render(<RobotsTxtTester />);
      expect(screen.getByText(/Crawler Verdict/i)).toBeDefined();
      // Default test path is /admin/dashboard which is Disallowed in default rules
      expect(screen.getByText(/DISALLOWED/i)).toBeDefined();
    });

    it('checks XML sitemap structure and counts in SitemapValidator', () => {
      render(<SitemapValidator />);
      expect(screen.getByText(/Valid XML Sitemap/i)).toBeDefined();
      expect(screen.getByText(/2 URLs Found/i)).toBeDefined();
    });

    it('validates kebab-case syntax in UrlSlugChecker', () => {
      render(<UrlSlugChecker />);
      expect(screen.getByText(/SEO Friendly Format/i)).toBeDefined();
    });

    it('validates JSON-LD schema syntax in SchemaMarkupValidator', () => {
      render(<SchemaMarkupValidator />);
      expect(screen.getByText(/PASSED/i)).toBeDefined();
    });
  });

  describe('4. Internet & Network Tools', () => {
    it('validates private and loopback IPv4 addresses', () => {
      render(<Ipv4Validator />);
      expect(screen.getByText(/Valid IPv4/i)).toBeDefined();
      expect(screen.getByText(/Private \/ LAN/i)).toBeDefined();
    });

    it('validates RFC 4291 IPv6 addresses', () => {
      render(<Ipv6Validator />);
      expect(screen.getByText(/Valid IPv6/i)).toBeDefined();
    });

    it('computes exact subnet masks and usable host counts in SubnetCalculator', () => {
      render(<SubnetCalculator />);
      expect(screen.getByText('255.255.255.0')).toBeDefined();
      expect(screen.getByText('192.168.1.0')).toBeDefined();
      expect(screen.getByText('192.168.1.255')).toBeDefined();
      expect(screen.getByText('254')).toBeDefined(); // 254 usable hosts for /24
    });

    it('formats MAC addresses into colon, hyphen, and Cisco notations', () => {
      render(<MacAddressFormatter />);
      expect(screen.getByText('00:1A:2B:3C:4D:5E')).toBeDefined();
      expect(screen.getByText('00-1A-2B-3C-4D-5E')).toBeDefined();
      expect(screen.getByText('001A.2B3C.4D5E')).toBeDefined();
    });

    it('calculates bandwidth transfer rates accurately', () => {
      render(<BandwidthCalculator />);
      // 100 Mbps / 8 = 12.50 MB/s
      expect(screen.getByText('12.50 MB/s')).toBeDefined();
    });

    it('calculates download duration factoring in TCP protocol overhead', () => {
      render(<DownloadTimeCalculator />);
      expect(screen.getByText(/Estimated Duration/i)).toBeDefined();
    });
  });

  describe('5. Web Development Utilities', () => {
    it('renders HTML Live Preview inside a sandboxed iframe', () => {
      render(<HtmlLivePreview />);
      const iframe = screen.getByTitle('HTML Sandbox');
      expect(iframe).toBeDefined();
      expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
    });

    it('executes client JavaScript and captures console logs in JavascriptPlayground', () => {
      render(<JavascriptPlayground />);
      const runBtn = screen.getByRole('button', { name: /Run Code/i });
      fireEvent.click(runBtn);
      expect(screen.getByText(/Array sum: 15/i)).toBeDefined();
    });

    it('optimizes SVG markup and computes byte savings', () => {
      render(<SvgOptimizer />);
      expect(screen.getByText(/Payload Size Reduced by/i)).toBeDefined();
    });

    it('converts pixels to rem, em, and pt in CssUnitConverter', () => {
      render(<CssUnitConverter />);
      // 16px = 1.000 rem, 1.000 em, 12.00 pt
      expect(screen.getByText('1.000 rem')).toBeDefined();
      expect(screen.getByText('1.000 em')).toBeDefined();
      expect(screen.getByText('12.00 pt')).toBeDefined();
    });
  });

  describe('6. Internet Content Utilities', () => {
    it('extracts YouTube video IDs accurately from watch, short, and embed URLs', () => {
      expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYoutubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('generates YouTube thumbnail URLs for multiple resolutions', () => {
      render(<YoutubeThumbnailViewer />);
      expect(screen.getByText(/HD 1080p \(maxresdefault\)/i)).toBeDefined();
      expect(screen.getByText(/High Quality \(hqdefault\)/i)).toBeDefined();
    });

    it('generates timestamped URLs with minutes and seconds', () => {
      render(<YoutubeTimestampGenerator />);
      const input = screen.getByPlaceholderText('11-character ID');
      fireEvent.change(input, { target: { value: 'dQw4w9WgXcQ' } });
      // 1 min 30 sec = 90 sec -> ?t=90
      expect(screen.getByText('https://youtu.be/dQw4w9WgXcQ?t=90')).toBeDefined();
    });

    it('generates valid WhatsApp click-to-chat links with country codes', () => {
      render(<WhatsappLinkGenerator />);
      const input = screen.getByPlaceholderText(/Enter phone with country code/i);
      fireEvent.change(input, { target: { value: '919876543210' } });
      expect(screen.getByText(/https:\/\/wa\.me\/919876543210/i)).toBeDefined();
    });

    it('renders social media share links for Twitter, LinkedIn, and WhatsApp', () => {
      render(<SocialMediaLinkGenerator />);
      expect(screen.getByText(/X \/ Twitter Share/i)).toBeDefined();
      expect(screen.getByText(/LinkedIn Share/i)).toBeDefined();
      expect(screen.getByText(/WhatsApp Share/i)).toBeDefined();
    });
  });
});
