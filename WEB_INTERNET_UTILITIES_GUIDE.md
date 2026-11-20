# LifeTools — Web & Internet Utilities Guide

**Project:** LifeTools (`https://lifetools.app/`)  
**Lead Developer:** [@officialhazim42](https://github.com/officialhazim42) (Hazim Bashir)  
**Category:** Web & Internet Utilities (`web`)  
**Total Tools in Category:** 65  
**Platform Total:** 321 Tools across 15 Categories  

---

## 🌐 Overview & Philosophy

The **Web & Internet Utilities** category expands LifeTools with 65 production-grade client-side tools designed for web developers, SEO specialists, network engineers, digital creators, and everyday web users.

In strict adherence to the LifeTools privacy-first manifesto:
- **100% Client-Side Computation:** Network calculations (CIDR subnetting, bandwidth conversions, latency math), code generation (.htaccess, robots.txt, web manifest, UTM links), SEO analysis (meta tags, sitemaps, headings, keyword density), and sandboxed previews run entirely within your local browser.
- **Zero Intermediary Proxies:** No proprietary backend servers proxy your queries or log your IP address.
- **Zero Paid API Keys:** Public queries leverage open standard protocols: Google Public DNS-over-HTTPS (DoH) for DNS records and ICANN RDAP for domain registration metadata.
- **Strict Security Sandboxing:** All live HTML and JavaScript execution environments are isolated inside sandboxed `<iframe>` contexts with omitted `allow-same-origin`, preventing script access to local storage, cookies, or IndexedDB.

---

## 🛡️ Technical Architecture & Browser Security Boundaries

### 1. Same-Origin Policy (SOP) & CORS Transparency
Modern web browsers enforce strict security boundaries through the **Same-Origin Policy (SOP)**. When a web application running at origin `A` initiates a client-side `fetch()` or `XMLHttpRequest` to origin `B`, the browser blocks the response unless origin `B` responds with permissive CORS headers:
```http
Access-Control-Allow-Origin: *
```
LifeTools adheres to strict transparency:
- **No False Positives:** When testing external websites in the *Website Status Checker* or *HTTP Header Checker*, if a cross-origin request is blocked by browser CORS, LifeTools **never claims the target website is offline or down**.
- **Transparent Diagnosis:** The UI clearly distinguishes between:
  1. *Network Unreachable:* DNS failure or connection refused.
  2. *CORS Restricted:* Website is operational, but browser security prevents reading response headers directly.
  3. *Raw Header Mode:* Allows users to paste response headers copied from Chrome DevTools or curl for instant analysis.

### 2. Client-Side Sandboxing vs Remote Execution
- **HTML Live Preview & Responsive Screen Tester:** Rendered inside `<iframe sandbox="allow-scripts">`. Omission of `allow-same-origin` ensures that user-tested scripts cannot access `window.parent`, `localStorage`, `IndexedDB`, session tokens, or parent DOM elements.
- **JavaScript Playground:** Executes user code inside isolated `Function` constructors with wrapped `console.log`, `console.info`, `console.warn`, and `console.error` handlers. Output is captured directly into an in-app visual terminal without polluting the browser's developer console.

### 3. Open Standard Network Endpoints
- **DNS Lookup & Website IP:** Queries Google Public DNS-over-HTTPS (`https://dns.google/resolve?name=<host>&type=<type>`), returning standard RFC 8427 JSON payloads for A, AAAA, MX, TXT, NS, and CNAME records without exposing user queries to tracking.
- **Domain Information (RDAP):** Queries the open ICANN Registration Data Access Protocol (`https://rdap.org/domain/<name>`), providing official registrar, status, and nameserver data.

---

## 🗂️ Catalog: 65 Tools Across 5 Sections

### Section 1: Website Analysis Tools (10 Tools)

| Tool Name | Tool ID | Offline Capable | Primary Functionality |
| :--- | :--- | :---: | :--- |
| **Website Status Checker** | `website-status-checker` | ❌ (Online) | Tests HTTP/HTTPS reachability with latency timers and CORS boundary diagnostics. |
| **HTTP Header Checker** | `http-header-checker` | ❌ / ✅ (Paste) | Inspects Cache-Control, Content-Type, CORS, and HSTS security headers. |
| **Redirect Checker** | `redirect-checker` | ❌ (Online) | Traces 301 Permanent / 302 Temporary URL hops and protocol transitions. |
| **URL Expander** | `url-expander` | ❌ (Online) | Expands short links (bit.ly, t.co, tinyurl) to verify target safety before visiting. |
| **Website IP Lookup** | `website-ip-lookup` | ❌ (Online) | Resolves hostname IPv4 and IPv6 addresses via Google Public DoH. |
| **DNS Lookup** | `dns-lookup` | ❌ (Online) | Queries A, AAAA, MX, TXT, NS, and CNAME resource records via Google DoH. |
| **Domain Information (RDAP)** | `domain-info-checker` | ❌ (Online) | Fetches ICANN RDAP registration metadata, registrar name, and nameservers. |
| **SSL Certificate Checker** | `ssl-cert-checker` | ❌ (Online) | Verifies HTTPS transport security, certificate validity, and TLS encryption. |
| **Website Response Time** | `website-response-time` | ❌ (Online) | Measures browser-to-server HTTP round-trip latency and TTFB metrics. |
| **User Agent Checker** | `user-agent-checker` | ✅ (Offline) | Inspects browser engine, client hints, OS platform, and screen metrics locally. |

---

### Section 2: SEO & Website Tools (15 Tools)

| Tool Name | Tool ID | Offline Capable | Primary Functionality |
| :--- | :--- | :---: | :--- |
| **Meta Tag Analyzer** | `meta-tag-analyzer` | ✅ (Offline) | Parses `<head>` HTML for title, description, viewport, robots, and canonical tags. |
| **Meta Tag Preview** | `meta-tag-preview` | ✅ (Offline) | Live Google SERP desktop and mobile snippet simulator with pixel length validation. |
| **Open Graph Preview** | `og-preview` | ✅ (Offline) | Simulates Facebook, LinkedIn, and Slack social preview cards from `og:*` tags. |
| **Twitter Card Preview** | `twitter-card-preview` | ✅ (Offline) | Previews Summary and Summary Large Image cards for Twitter/X sharing. |
| **Robots.txt Tester** | `robots-txt-tester` | ✅ (Offline) | Evaluates crawler user-agents against Disallow/Allow directives in real time. |
| **Sitemap Validator** | `sitemap-validator` | ✅ (Offline) | Validates XML sitemap markup, `<loc>` URLs, `<lastmod>` dates, and namespace tags. |
| **Canonical URL Checker** | `canonical-url-checker` | ✅ (Offline) | Audits canonical link tags to prevent SEO duplicate content penalties. |
| **Heading Structure Analyzer** | `heading-structure-analyzer` | ✅ (Offline) | Visualizes H1-H6 outline hierarchy and flags skipped levels (e.g. H1 directly to H3). |
| **Keyword Density Checker** | `keyword-density-checker` | ✅ (Offline) | Calculates single, double, and triple word n-gram frequencies and percentages. |
| **Word Frequency Analyzer** | `word-frequency-analyzer` | ✅ (Offline) | Detailed lexical analysis: word count, unique terms, syllable distribution, reading time. |
| **Broken Link Checker** | `broken-link-checker` | ✅ (Offline) | Extracts all anchor tags from HTML source and audits protocols and formats. |
| **Website Title Extractor** | `website-title-extractor` | ✅ (Offline) | Extracts `<title>` tag and verifies optimal 50-60 character length threshold. |
| **Favicon Preview Generator** | `favicon-preview-generator` | ✅ (Offline) | Previews uploaded favicons across browser tabs, bookmarks bar, and mobile home screens. |
| **Schema Markup Validator** | `schema-markup-validator` | ✅ (Offline) | Validates JSON-LD structured data syntax for Article, Product, Organization, and FAQ. |
| **URL Slug Checker** | `url-slug-checker` | ✅ (Offline) | Audits web slugs against SEO readability (lowercase, hyphen-separated, stop-words). |

---

### Section 3: Internet & Network Tools (15 Tools)

| Tool Name | Tool ID | Offline Capable | Primary Functionality |
| :--- | :--- | :---: | :--- |
| **Public IP Checker** | `public-ip-checker` | ❌ (Online) | Detects public IP address, organization, and connection details via ipify/ipapi. |
| **IPv4 Validator** | `ipv4-validator` | ✅ (Offline) | Validates 32-bit dot-decimal notation, classifies Private/Loopback/Public/Multicast. |
| **IPv6 Validator** | `ipv6-validator` | ✅ (Offline) | Validates 128-bit hexadecimal IPv6 addresses with RFC 5952 compression/expansion. |
| **Subnet Calculator (CIDR)** | `subnet-calculator` | ✅ (Offline) | Computes netmask, wildcard mask, network IP, broadcast IP, and usable host count. |
| **MAC Address Formatter** | `mac-address-formatter` | ✅ (Offline) | Converts 48-bit MAC addresses across colon (`:`), hyphen (`-`), dot (`.`), and bare formats. |
| **Port Number Reference** | `port-number-reference` | ✅ (Offline) | Searchable directory of standard IANA TCP/UDP port assignments (80, 443, 22, 3306, etc.). |
| **User Agent Parser** | `user-agent-parser` | ✅ (Offline) | Deconstructs custom user agent strings into browser engine, OS version, and device type. |
| **HTTP Status Code Reference** | `http-status-code-reference` | ✅ (Offline) | Searchable RFC 9110 status directory: 1xx Informational, 2xx Success, 3xx, 4xx, 5xx. |
| **MIME Type Lookup** | `mime-type-lookup` | ✅ (Offline) | Maps common file extensions (.pdf, .webp, .json, .wasm) to standard MIME types. |
| **Network Information Viewer** | `network-info-viewer` | ✅ (Offline) | Live browser Network Information API inspecting effectiveType, downlink, and rtt. |
| **Bandwidth Calculator** | `bandwidth-calculator` | ✅ (Offline) | Converts throughput between bps, Kbps, Mbps, Gbps, KB/s, MB/s, and GB/s. |
| **Download Time Calculator** | `download-time-calculator` | ✅ (Offline) | Computes file transfer duration across 4G, 5G, Gigabit Fiber, and broadband speeds. |
| **Upload Time Calculator** | `upload-time-calculator` | ✅ (Offline) | Calculates file upload duration taking symmetric and asymmetric limits into account. |
| **Latency Calculator** | `latency-calculator` | ✅ (Offline) | Calculates theoretical minimum RTT based on fiber optic speed of light over distance. |
| **Data Transfer Calculator** | `data-transfer-calculator` | ✅ (Offline) | Computes cumulative data transfer volume over hours, days, or months from fixed bitrates. |

---

### Section 4: Web Development Utilities (15 Tools)

| Tool Name | Tool ID | Offline Capable | Primary Functionality |
| :--- | :--- | :---: | :--- |
| **HTML Live Preview** | `html-live-preview` | ✅ (Offline) | Real-time HTML renderer with sandboxed iframe (`sandbox="allow-scripts"`). |
| **CSS Live Playground** | `css-live-playground` | ✅ (Offline) | Live CSS sandbox styling customizable HTML components with zero latency. |
| **JavaScript Playground** | `javascript-playground` | ✅ (Offline) | Isolated JavaScript execution sandbox with an in-app visual terminal. |
| **Markdown Live Preview** | `markdown-live-preview` | ✅ (Offline) | Live GitHub Flavored Markdown editor with instant side-by-side HTML preview. |
| **SVG Viewer** | `svg-viewer` | ✅ (Offline) | Previews SVG vector markup on transparency checkerboards with zoom scaling. |
| **SVG Optimizer** | `svg-optimizer` | ✅ (Offline) | Cleans SVG files by stripping metadata, doctypes, comments, and whitespace. |
| **HTML Email Preview** | `html-email-preview` | ✅ (Offline) | Previews HTML email templates with desktop/mobile viewport toggles. |
| **Responsive Screen Tester** | `responsive-screen-tester` | ✅ (Offline) | Tests website rendering across Mobile (375px), Tablet (768px), Laptop, Desktop. |
| **URL Builder** | `url-builder` | ✅ (Offline) | Assembles parameterized URLs with key-value pairs, encoding, and hash anchors. |
| **UTM Link Generator** | `utm-link-generator` | ✅ (Offline) | Generates Google Analytics campaign URLs with source, medium, campaign, and content. |
| **Robots.txt Generator** | `robots-txt-generator` | ✅ (Offline) | Visual builder for crawler policies, Disallow rules, and XML sitemap references. |
| **.htaccess Generator** | `htaccess-generator` | ✅ (Offline) | Generates Apache directives for HTTPS redirect, Gzip compression, and browser cache. |
| **Web App Manifest Generator** | `web-manifest-generator` | ✅ (Offline) | Builds W3C `manifest.json` configurations with PWA display modes, icons, and theme color. |
| **Browser Compatibility Reference** | `browser-compatibility-checker` | ✅ (Offline) | Evaluates modern Web API support across Chromium, Gecko, and WebKit engines. |
| **CSS Unit Converter** | `css-unit-converter` | ✅ (Offline) | Converts px, rem, em, %, pt, vw, and vh dimensions with configurable root base. |

---

### Section 5: Internet Content Utilities (10 Tools)

| Tool Name | Tool ID | Offline Capable | Primary Functionality |
| :--- | :--- | :---: | :--- |
| **YouTube Thumbnail Viewer** | `youtube-thumbnail-viewer` | ✅ (Offline) | Extracts MaxRes (1080p), High, Medium, and Default thumbnail image URLs. |
| **YouTube Video Info Extractor** | `youtube-info-extractor` | ✅ (Offline) | Parses video IDs, creates clean canonical watch URLs, and short youtu.be links. |
| **YouTube Timestamp Generator** | `youtube-timestamp-generator` | ✅ (Offline) | Generates jump-to timestamp URLs (`?t=MMmSSs` / `?t=120s`) for precise video sharing. |
| **YouTube Embed Generator** | `youtube-embed-generator` | ✅ (Offline) | Creates responsive privacy-enhanced `youtube-nocookie.com` iframe embed code. |
| **Social Media Link Generator** | `social-media-link-generator` | ✅ (Offline) | One-click share intents for Twitter/X, LinkedIn, Facebook, Pinterest, Telegram, Reddit. |
| **Instagram Profile Link Generator** | `instagram-link-generator` | ✅ (Offline) | Formats usernames into clean Instagram web profile URLs and direct message links. |
| **WhatsApp Link Generator** | `whatsapp-link-generator` | ✅ (Offline) | Creates direct `wa.me` click-to-chat links with country codes and pre-filled messages. |
| **Email Link Generator (mailto:)** | `email-link-generator` | ✅ (Offline) | Builds RFC 6068 `mailto:` links with CC, BCC, subject line, and multi-line message body. |
| **Telephone Link Generator** | `telephone-link-generator` | ✅ (Offline) | Generates RFC 3966 `tel:` phone call links and mobile `sms:` text message links. |
| **Google Maps Link Generator** | `google-maps-link-generator` | ✅ (Offline) | Creates direct navigation, coordinates drop-pin, and business search map URLs. |

---

## 🔒 Security & Privacy Guarantees

1. **No External Script Ingestion:** No third-party CDN scripts or tracking SDKs are loaded during tool execution.
2. **Zero Ingestion of User Code:** All code entered into the HTML, CSS, JavaScript, and Markdown playgrounds is executed or rendered purely within the local browser sandbox.
3. **No Keylogging or Telemetry:** No user-entered URLs, domains, headers, or parameters are logged or transmitted to any server.
4. **PWA Offline Resilience:** 56 of the 65 tools function completely offline without internet connectivity via Service Worker caching.
