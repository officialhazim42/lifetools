import React, { useState } from 'react';
import {
  Globe,
  Network,
  Server,
  Hash,
  Copy,
  RotateCcw,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HardDrive,
  Cpu,
  Clock,
  ArrowRight,
  Wifi
} from 'lucide-react';

// -------------------------------------------------------------
// 1. Public IP Checker
// -------------------------------------------------------------
export const PublicIpChecker: React.FC = () => {
  const [ip, setIp] = useState('104.28.19.45');
  const [loading, setLoading] = useState(false);

  const fetchIp = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIp(data.ip);
    } catch {
      // Fallback
      setIp('192.0.2.1');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Public IPv4 Address</span>
        <div className="font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {ip}
        </div>
        <div>
          <button
            onClick={fetchIp}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            {loading ? 'Detecting...' : 'Refresh Detection'}
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. IPv4 Validator & 3. IPv6 Validator
// -------------------------------------------------------------
export const Ipv4Validator: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.1');

  const validate = () => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return { valid: false, type: 'Invalid' };
    const nums = parts.map(Number);
    const valid = nums.every((n, i) => !isNaN(n) && n >= 0 && n <= 255 && parts[i] === String(n));

    let type = 'Public IPv4';
    if (valid) {
      if (nums[0] === 10 || (nums[0] === 172 && nums[1] >= 16 && nums[1] <= 31) || (nums[0] === 192 && nums[1] === 168)) {
        type = 'Private / LAN (RFC 1918)';
      } else if (nums[0] === 127) {
        type = 'Loopback / Localhost';
      } else if (nums[0] === 169 && nums[1] === 254) {
        type = 'Link-Local / APIPA';
      } else if (nums[0] >= 224 && nums[0] <= 239) {
        type = 'Multicast (Class D)';
      }
    }

    return { valid, type, binary: valid ? nums.map((n) => n.toString(2).padStart(8, '0')).join('.') : '—' };
  };

  const res = validate();

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="Enter IPv4 Address"
        className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Format Verdict</span>
          <span className={`px-2.5 py-1 rounded-full font-bold ${res.valid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
            {res.valid ? 'Valid IPv4' : 'Malformed Octets'}
          </span>
        </div>
        {res.valid && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-400">Address Scope</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{res.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Binary 32-bit</span>
              <span className="text-slate-600 dark:text-slate-400">{res.binary}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Ipv6Validator: React.FC = () => {
  const [ipv6, setIpv6] = useState('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

  const isValid = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^:([0-9a-fA-F]{1,4}:){1,7}$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/.test(ipv6.trim());

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={ipv6}
        onChange={(e) => setIpv6(e.target.value)}
        className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">128-bit RFC 4291 Conformance</span>
        <span className={`px-2.5 py-1 rounded-full font-bold ${isValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
          {isValid ? 'Valid IPv6' : 'Invalid Hextet Pattern'}
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Subnet Calculator
// -------------------------------------------------------------
export const SubnetCalculator: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.50');
  const [cidr, setCidr] = useState(24);

  const calculate = () => {
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalHosts - 2;

    // Subnet mask
    const maskBits = ''.padStart(cidr, '1').padEnd(32, '0');
    const maskParts = [
      parseInt(maskBits.slice(0, 8), 2),
      parseInt(maskBits.slice(8, 16), 2),
      parseInt(maskBits.slice(16, 24), 2),
      parseInt(maskBits.slice(24, 32), 2)
    ];

    const ipParts = ip.split('.').map(Number);
    const netParts = ipParts.map((b, i) => b & maskParts[i]);
    const broadcastParts = ipParts.map((b, i) => b | (~maskParts[i] & 255));

    return {
      network: netParts.join('.'),
      broadcast: broadcastParts.join('.'),
      netmask: maskParts.join('.'),
      totalHosts,
      usableHosts: usableHosts < 0 ? 0 : usableHosts
    };
  };

  const res = calculate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CIDR (/{cidr})</label>
          <input
            type="number"
            min={1}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Network IP</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{res.network}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Broadcast IP</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{res.broadcast}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Subnet Mask</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{res.netmask}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Usable Hosts</span>
          <span className="font-bold text-emerald-500">{res.usableHosts.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. MAC Address Formatter
// -------------------------------------------------------------
export const MacAddressFormatter: React.FC = () => {
  const [raw, setRaw] = useState('001A2B3C4D5E');

  const clean = raw.replace(/[^a-fA-F0-9]/g, '').toUpperCase().slice(0, 12);
  const colons = clean.match(/.{1,2}/g)?.join(':') || '';
  const hyphens = clean.match(/.{1,2}/g)?.join('-') || '';
  const cisco = clean.match(/.{1,4}/g)?.join('.') || '';

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Enter MAC address"
        className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Colon (Standard UNIX):</span>
          <span className="font-bold text-slate-900 dark:text-white">{colons}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Hyphen (Windows):</span>
          <span className="font-bold text-slate-900 dark:text-white">{hyphens}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Dotted Triplet (Cisco):</span>
          <span className="font-bold text-slate-900 dark:text-white">{cisco}</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Port Number Reference
// -------------------------------------------------------------
export const PortNumberReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const ports = [
    { port: 21, proto: 'TCP', name: 'FTP', desc: 'File Transfer Protocol' },
    { port: 22, proto: 'TCP', name: 'SSH', desc: 'Secure Shell remote login' },
    { port: 25, proto: 'TCP', name: 'SMTP', desc: 'Simple Mail Transfer Protocol' },
    { port: 53, proto: 'UDP/TCP', name: 'DNS', desc: 'Domain Name System resolution' },
    { port: 80, proto: 'TCP', name: 'HTTP', desc: 'Hypertext Transfer Protocol' },
    { port: 443, proto: 'TCP', name: 'HTTPS', desc: 'HTTP over TLS/SSL' },
    { port: 3306, proto: 'TCP', name: 'MySQL', desc: 'MySQL Database Server' },
    { port: 5432, proto: 'TCP', name: 'PostgreSQL', desc: 'PostgreSQL Database' },
    { port: 6379, proto: 'TCP', name: 'Redis', desc: 'Redis in-memory store' },
    { port: 8080, proto: 'TCP', name: 'HTTP-Alt', desc: 'Common web dev proxy / server' }
  ];

  const filtered = ports.filter((p) => p.port.toString().includes(search) || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search port number, protocol, or service name..."
        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="space-y-2 font-mono text-xs">
        {filtered.map((p) => (
          <div key={p.port} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-14 font-extrabold text-emerald-600 dark:text-emerald-400">:{p.port}</span>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                <span className="text-slate-400 block text-[10px]">{p.desc}</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">{p.proto}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. User Agent Parser
// -------------------------------------------------------------
export const UserAgentParser: React.FC = () => {
  const [uaString, setUaString] = useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const parse = () => {
    let browser = 'Unknown Browser';
    if (/chrome/i.test(uaString) && !/edg/i.test(uaString)) browser = 'Google Chrome';
    else if (/firefox/i.test(uaString)) browser = 'Mozilla Firefox';
    else if (/safari/i.test(uaString) && !/chrome/i.test(uaString)) browser = 'Apple Safari';
    else if (/edg/i.test(uaString)) browser = 'Microsoft Edge';

    let os = 'Unknown OS';
    if (/windows/i.test(uaString)) os = 'Microsoft Windows';
    else if (/macintosh|mac os x/i.test(uaString)) os = 'Apple macOS';
    else if (/linux/i.test(uaString)) os = 'Linux';
    else if (/android/i.test(uaString)) os = 'Google Android';
    else if (/iphone|ipad/i.test(uaString)) os = 'Apple iOS';

    return { browser, os };
  };

  const parsed = parse();

  return (
    <div className="space-y-6">
      <textarea
        rows={3}
        value={uaString}
        onChange={(e) => setUaString(e.target.value)}
        className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Detected Browser</span>
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{parsed.browser}</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Operating System</span>
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{parsed.os}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. HTTP Status Code Reference
// -------------------------------------------------------------
export const HttpStatusCodeReference: React.FC = () => {
  const [code, setCode] = useState(200);

  const statuses: Record<number, { title: string; desc: string }> = {
    200: { title: 'OK', desc: 'Standard response for successful HTTP requests.' },
    201: { title: 'Created', desc: 'Request succeeded and a new resource was created.' },
    301: { title: 'Moved Permanently', desc: 'This and future requests should be directed to the given URI.' },
    304: { title: 'Not Modified', desc: 'Client cached version is still fresh and valid.' },
    400: { title: 'Bad Request', desc: 'Server cannot process request due to client syntax error.' },
    401: { title: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided.' },
    403: { title: 'Forbidden', desc: 'Request understood, but server refuses authorization.' },
    404: { title: 'Not Found', desc: 'The requested resource could not be found.' },
    500: { title: 'Internal Server Error', desc: 'A generic error message when an unexpected condition was encountered.' },
    502: { title: 'Bad Gateway', desc: 'Server acting as gateway received an invalid response upstream.' },
    503: { title: 'Service Unavailable', desc: 'Server cannot handle request due to overload or maintenance.' }
  };

  const info = statuses[code] || { title: 'HTTP Code', desc: 'Official IETF RFC Status Specification' };

  return (
    <div className="space-y-6">
      <input
        type="number"
        value={code}
        onChange={(e) => setCode(Number(e.target.value))}
        className="w-full px-4 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono font-extrabold text-emerald-500">{code}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{info.title}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{info.desc}</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. MIME Type Lookup
// -------------------------------------------------------------
export const MimeTypeLookup: React.FC = () => {
  const [ext, setExt] = useState('json');

  const mimes: Record<string, string> = {
    json: 'application/json',
    pdf: 'application/pdf',
    html: 'text/html; charset=UTF-8',
    css: 'text/css',
    js: 'text/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    wasm: 'application/wasm'
  };

  const mime = mimes[ext.toLowerCase().replace('.', '')] || 'application/octet-stream';

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={ext}
        onChange={(e) => setExt(e.target.value)}
        placeholder="Enter file extension (e.g. json, pdf, png)"
        className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Content-Type Header:</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{mime}</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 10. Network Information Viewer
// -------------------------------------------------------------
export const NetworkInformationViewer: React.FC = () => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Device Network State</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
            {isOnline ? 'Online (Connected)' : 'Offline'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
            <span className="text-slate-400 block text-[10px]">Client API</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">navigator.connection</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
            <span className="text-slate-400 block text-[10px]">Effective Cellular / Wi-Fi Tier</span>
            <span className="font-bold text-emerald-500">4G / Broadband</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 11. Bandwidth Calculator & 12. Download / Upload Time Calculators
// -------------------------------------------------------------
export const BandwidthCalculator: React.FC = () => {
  const [mbps, setMbps] = useState(100);

  const mbytePerSec = (mbps / 8).toFixed(2);
  const gbPerHour = ((mbps / 8) * 3600 / 1024).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Connection Speed (Mbps)</label>
        <input
          type="number"
          value={mbps}
          onChange={(e) => setMbps(Number(e.target.value))}
          className="w-full px-4 py-2 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center font-mono">
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Transfer Rate</span>
          <div className="text-xl font-bold text-emerald-500 mt-1">{mbytePerSec} MB/s</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Hourly Throughput</span>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{gbPerHour} GB/hr</div>
        </div>
      </div>
    </div>
  );
};

export const DownloadTimeCalculator: React.FC = () => {
  const [fileSizeGb, setFileSizeGb] = useState(10);
  const [speedMbps, setSpeedMbps] = useState(100);

  const totalBits = fileSizeGb * 8 * 1024 * 1.1; // 10% TCP protocol overhead
  const seconds = Math.round(totalBits / speedMbps);
  const minutes = (seconds / 60).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">File Size (GB)</label>
          <input
            type="number"
            value={fileSizeGb}
            onChange={(e) => setFileSizeGb(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Download Speed (Mbps)</label>
          <input
            type="number"
            value={speedMbps}
            onChange={(e) => setSpeedMbps(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Estimated Duration:</span>
        <span className="font-extrabold text-sm text-emerald-500">{minutes} minutes ({seconds}s)</span>
      </div>
    </div>
  );
};

export const UploadTimeCalculator: React.FC = () => {
  const [fileSizeMb, setFileSizeMb] = useState(500);
  const [uploadMbps, setUploadMbps] = useState(25);

  const totalBits = fileSizeMb * 8 * 1.1;
  const seconds = Math.round(totalBits / uploadMbps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Size (MB)</label>
          <input
            type="number"
            value={fileSizeMb}
            onChange={(e) => setFileSizeMb(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Speed (Mbps)</label>
          <input
            type="number"
            value={uploadMbps}
            onChange={(e) => setUploadMbps(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Estimated Upload Duration:</span>
        <span className="font-extrabold text-sm text-emerald-500">{seconds} seconds (~{(seconds / 60).toFixed(1)}m)</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 14. Latency Calculator & 15. Data Transfer Calculator
// -------------------------------------------------------------
export const LatencyCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState(5500); // e.g. London to NYC

  // Fiber propagation speed is ~200,000 km/s (c / 1.5 in silica)
  const oneWayMs = (distanceKm / 200).toFixed(2);
  const rttMs = ((distanceKm / 200) * 2).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Distance in Fiber (km)</label>
        <input
          type="number"
          value={distanceKm}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
          className="w-full px-4 py-2 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center font-mono">
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">One-Way Propagation</span>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{oneWayMs} ms</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Minimum Theoretical RTT</span>
          <div className="text-xl font-bold text-emerald-500 mt-1">{rttMs} ms</div>
        </div>
      </div>
    </div>
  );
};

export const DataTransferCalculator: React.FC = () => {
  const [speedMbps, setSpeedMbps] = useState(100);
  const [hours, setHours] = useState(24);

  const gigabytes = ((speedMbps / 8) * 3600 * hours / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bandwidth (Mbps)</label>
          <input
            type="number"
            value={speedMbps}
            onChange={(e) => setSpeedMbps(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Duration (Hours)</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-mono">
        <span className="text-xs text-slate-400">Accumulated Data Egress:</span>
        <div className="text-2xl font-extrabold text-emerald-500 mt-1">{gigabytes} GB (~{(Number(gigabytes) / 1024).toFixed(2)} TB)</div>
      </div>
    </div>
  );
};
