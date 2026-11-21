import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  RotateCcw,
  Download,
  AlertCircle,
  Sparkles,
  FileText,
  Eye,
  CheckCircle2,
  Code
} from 'lucide-react';
import {
  validateEmailSyntax,
  parseEmailHeaders,
  calculateReadability,
  formatEmailText
} from '../../../utils/communication/emailUtils';

// ==========================================
// 1. Email Signature Generator
// ==========================================
export const EmailSignatureGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [layout, setLayout] = useState<'classic' | 'modern' | 'minimal'>('modern');
  const [copied, setCopied] = useState(false);

  const getSignatureHtml = () => {
    if (layout === 'minimal') {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;line-height:1.4;">
  <tr>
    <td style="font-weight:bold;font-size:15px;color:${themeColor};">${name}</td>
  </tr>
  <tr>
    <td style="color:#666666;">${title} · ${company}</td>
  </tr>
  <tr>
    <td style="padding-top:4px;">
      <a href="mailto:${email}" style="color:${themeColor};text-decoration:none;">${email}</a> · ${phone} · <a href="${website}" style="color:${themeColor};text-decoration:none;">${website.replace(/^https?:\/\//, '')}</a>
    </td>
  </tr>
</table>`;
    }

    if (layout === 'classic') {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;border-top:2px solid ${themeColor};padding-top:8px;line-height:1.5;">
  <tr>
    <td style="font-weight:bold;font-size:16px;color:#111827;">${name}</td>
  </tr>
  <tr>
    <td style="color:#4b5563;font-size:13px;">${title} | <strong>${company}</strong></td>
  </tr>
  <tr>
    <td style="padding-top:6px;font-size:12px;color:#6b7280;">
      Email: <a href="mailto:${email}" style="color:${themeColor};">${email}</a> | Tel: ${phone} | Web: <a href="${website}" style="color:${themeColor};">${website.replace(/^https?:\/\//, '')}</a>
    </td>
  </tr>
</table>`;
    }

    // Modern (side-border)
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;line-height:1.5;">
  <tr>
    <td style="padding-right:12px;border-right:3px solid ${themeColor};vertical-align:middle;">
      <div style="font-size:16px;font-weight:bold;color:#111827;">${name}</div>
      <div style="font-size:13px;color:#4b5563;">${title}</div>
      <div style="font-size:13px;font-weight:600;color:${themeColor};">${company}</div>
    </td>
    <td style="padding-left:12px;vertical-align:middle;font-size:12px;color:#4b5563;">
      <div>✉️ <a href="mailto:${email}" style="color:#374151;text-decoration:none;">${email}</a></div>
      <div>📞 <span style="color:#374151;">${phone}</span></div>
      <div>🌐 <a href="${website}" style="color:${themeColor};text-decoration:none;">${website.replace(/^https?:\/\//, '')}</a></div>
    </td>
  </tr>
</table>`;
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(getSignatureHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter company or organization"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Enter website URL"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Layout Style</label>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-900 text-xs">
            {(['modern', 'classic', 'minimal'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
                  layout === l ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Theme Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{themeColor}</span>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
          <button
            onClick={copyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML!' : 'Copy HTML Signature'}
          </button>
        </div>
        <div
          className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: getSignatureHtml() }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 2. Professional Email Writer
// ==========================================
export const ProfessionalEmailWriter: React.FC = () => {
  const [recipientName, setRecipientName] = useState('');
  const [tone, setTone] = useState<'formal' | 'assertive' | 'polite' | 'concise' | 'urgent'>('formal');
  const [purpose, setPurpose] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [senderName, setSenderName] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmail = () => {
    let greeting = `Dear ${recipientName || 'Colleague'},`;
    if (tone === 'polite' || tone === 'concise') greeting = `Hi ${recipientName || 'there'},`;
    if (tone === 'urgent') greeting = `Urgent: Hi ${recipientName || 'Team'},`;

    let opening = `I hope this email finds you well. I am writing regarding ${purpose.toLowerCase()}.`;
    if (tone === 'assertive') {
      opening = `I am reaching out regarding ${purpose.toLowerCase()}.`;
    } else if (tone === 'concise') {
      opening = `Quick note on ${purpose.toLowerCase()}.`;
    } else if (tone === 'urgent') {
      opening = `I am writing with urgent priority regarding ${purpose.toLowerCase()}.`;
    }

    const pointsList = keyPoints
      .split('\n')
      .filter((p) => p.trim())
      .map((p) => `• ${p.trim()}`)
      .join('\n');

    let closing = 'Looking forward to hearing from you.';
    if (tone === 'assertive') closing = 'Please review and confirm next steps by tomorrow EOD.';
    if (tone === 'urgent') closing = 'Your prompt response today is greatly appreciated.';
    if (tone === 'concise') closing = 'Let me know if this works.';

    let signOff = 'Best regards,';
    if (tone === 'formal') signOff = 'Sincerely,';
    if (tone === 'polite') signOff = 'Warmly,';
    if (tone === 'concise') signOff = 'Thanks,';

    return `${greeting}\n\n${opening}\n\n${pointsList}\n\n${closing}\n\n${signOff}\n${senderName}`;
  };

  const emailText = generateEmail();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter recipient name"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
          >
            <option value="formal">Formal & Corporate</option>
            <option value="assertive">Assertive & Direct</option>
            <option value="polite">Polite & Friendly</option>
            <option value="concise">Concise & Minimal</option>
            <option value="urgent">Urgent & Time-Sensitive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Purpose / Context</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Enter email purpose or objective"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Key Points / Agenda (1 per line)</label>
        <textarea
          rows={3}
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="Enter key agenda or bullet points (one per line)..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Email Draft</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(emailText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Email'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
          {emailText}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 3. Email Subject Line Generator
// ==========================================
export const EmailSubjectLineGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<'business' | 'urgent' | 'curiosity' | 'followup' | 'newsletter'>('business');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getSubjectLines = () => {
    switch (category) {
      case 'urgent':
        return [
          `[Action Required] ${topic}`,
          `Urgent update regarding ${topic}`,
          `Time-sensitive: ${topic} decision needed by EOD`,
          `Immediate attention needed: ${topic}`,
          `[Final Notice] Regarding ${topic}`
        ];
      case 'curiosity':
        return [
          `Quick thought on ${topic}...`,
          `What do you think about this? (${topic})`,
          `Surprising insight regarding ${topic}`,
          `A fresh perspective on ${topic}`,
          `The missing piece in your ${topic}`
        ];
      case 'followup':
        return [
          `Following up on our conversation about ${topic}`,
          `Next steps: ${topic}`,
          `Any updates on ${topic}?`,
          `Re: Checking in on ${topic}`,
          `Recap & action items: ${topic}`
        ];
      case 'newsletter':
        return [
          `Weekly Digest: ${topic} & Top Highlights`,
          `How to master ${topic} this month`,
          `5 critical lessons about ${topic}`,
          `The definitive breakdown of ${topic}`,
          `Edition #42: Everything you need to know about ${topic}`
        ];
      default: // business
        return [
          `${topic} — Proposal & Key Next Steps`,
          `Discussion on ${topic}`,
          `Update: ${topic} Status & Timeline`,
          `Meeting Request: ${topic}`,
          `Draft strategy for ${topic}`
        ];
    }
  };

  const subjects = getSubjectLines();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Subject Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter core topic or announcement (e.g. Q3 Project Proposal)"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Style & Tone</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
          >
            <option value="business">Professional Business</option>
            <option value="urgent">Action Required / Urgent</option>
            <option value="curiosity">High Open Rate Curiosity</option>
            <option value="followup">Follow-Up & Check-In</option>
            <option value="newsletter">Newsletter & Content</option>
          </select>
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recommended Subject Lines</span>
        {subjects.map((sub, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-400 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{sub}</div>
              <div className="text-[11px] text-slate-500">{sub.length} characters (Optimal: 40–60 chars)</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sub);
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
              }}
              className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. Email Template Builder
// ==========================================
export const EmailTemplateBuilder: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaText, setCtaText] = useState('Get Started Free');
  const [ctaUrl, setCtaUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [copied, setCopied] = useState(false);

  const getTemplateHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px;background-color:#f8fafc;font-family:Arial,sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <tr>
      <td style="background-color:${accentColor};padding:32px 24px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">${headline}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;">
        <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;">${subheading}</h2>
        <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">${bodyText}</p>
        <table align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="border-radius:6px;background-color:${accentColor};">
              <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;">${ctaText}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px;background-color:#f1f5f9;text-align:center;font-size:12px;color:#64748b;">
        You received this email because you opted into updates. <br>
        <a href="#" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> | <a href="#" style="color:#64748b;text-decoration:underline;">Privacy Policy</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Header Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Enter header headline"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Accent Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{accentColor}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Subheading</label>
        <input
          type="text"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          placeholder="Enter subheading"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Body Text</label>
        <textarea
          rows={3}
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder="Enter email body text..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Call to Action (CTA) Button Text</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="Enter CTA button label"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">CTA Target Link</label>
          <input
            type="text"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="Enter destination link URL"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HTML Email Preview</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(getTemplateHtml());
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML!' : 'Copy HTML Template'}
          </button>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-100 dark:bg-slate-950">
          <iframe
            srcDoc={getTemplateHtml()}
            title="Email Template Preview"
            className="w-full h-80 rounded border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Email Text Formatter
// ==========================================
export const EmailTextFormatter: React.FC = () => {
  const [input, setInput] = useState(
    `Hello Team,\n\nHere is an update on the Q3 milestones. Please ensure you read through the action items carefully before Friday.\n\n* Prepare slides for client review\n* Verify cloud billing breakdown\n* Schedule design walkthrough\n\n> "Simplicity is the soul of efficiency."\n\nBest,\nAlex`
  );
  const [wrapWidth, setWrapWidth] = useState(72);
  const [normalizeBullets, setNormalizeBullets] = useState(true);
  const [cleanQuotes, setCleanQuotes] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatted = formatEmailText(input, {
    wrapWidth,
    normalizeBullets,
    cleanQuotes,
    stripExtraBlankLines: true
  });

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Raw Email Text</label>
        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={normalizeBullets}
            onChange={(e) => setNormalizeBullets(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Standardize bullets (•)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={cleanQuotes}
            onChange={(e) => setCleanQuotes(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Format quote marks (&gt;)</span>
        </label>
        <div className="flex items-center gap-2">
          <span>Max line wrap width:</span>
          <select
            value={wrapWidth}
            onChange={(e) => setWrapWidth(Number(e.target.value))}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
          >
            <option value={60}>60 chars</option>
            <option value={72}>72 chars (Standard Email)</option>
            <option value={80}>80 chars</option>
            <option value={100}>100 chars</option>
          </select>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cleaned & Formatted Output</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(formatted);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Formatted Text'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {formatted}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 6. Email Address Syntax Validator
// ==========================================
export const EmailAddressSyntaxValidator: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const result = validateEmailSyntax(emailInput);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Enter Email Address</label>
        <div className="relative">
          <input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email address (e.g. name@domain.com)"
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-2.5">
            {result.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              result.isValid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {result.isValid ? 'RFC 5322 Syntax Valid' : 'Syntax Issues Detected'}
          </span>
          {result.isRoleBased && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Role-Based Address
            </span>
          )}
          {result.isFreeProvider && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Free Webmail Domain
            </span>
          )}
        </div>

        {result.suggestions && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{result.suggestions}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Local User Part</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{result.userPart || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Domain Part</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{result.domainPart || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Top-Level Domain (TLD)</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">.{result.tld || '—'}</span>
          </div>
        </div>

        {result.issues.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 block">Issues Found:</span>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
              {result.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[11px] text-slate-500 italic">
          Disclaimer: This checks RFC 5322 syntax structure locally. It does not ping mail exchangers (MX) or claim active mailbox delivery without an external mailbox verification service.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 7. Email Header Analyzer
// ==========================================
export const EmailHeaderAnalyzer: React.FC = () => {
  const [headerText, setHeaderText] = useState(
    `Received: from mail.server.example.com (mail.server.example.com [192.0.2.1])\n    by mx.google.com with ESMTPS id abc123\n    for <recipient@example.com>;\n    Tue, 19 Nov 2026 14:22:10 +0000\nFrom: sender@example.com\nTo: recipient@example.com\nSubject: Project Update\nDate: Tue, 19 Nov 2026 14:20:00 +0000\nMessage-ID: <unique-id-12345@example.com>\nAuthentication-Results: mx.google.com; spf=pass; dkim=pass\nReceived-SPF: pass (google.com: domain of sender@example.com designates 192.0.2.1 as permitted sender)`
  );

  const analysis = parseEmailHeaders(headerText);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Paste Raw Email Headers</label>
        <textarea
          rows={6}
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="Paste headers starting with Received:, From:, etc."
          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Summary</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">From</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">{analysis.from || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Subject</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{analysis.subject || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Transmission Hops</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{analysis.totalHops} server hop(s)</span>
          </div>
        </div>

        {/* Security checks */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              analysis.securityFlags.spfPass
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            SPF: {analysis.securityFlags.spfPass ? 'PASS' : 'UNVERIFIED / NONE'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              analysis.securityFlags.dkimPass
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            DKIM: {analysis.securityFlags.dkimPass ? 'PASS' : 'UNVERIFIED / NONE'}
          </span>
        </div>

        {/* Hops table */}
        {analysis.hops.length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">Relay Hops Route</span>
            <div className="space-y-2">
              {analysis.hops.map((hop) => (
                <div
                  key={hop.hopNumber}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Hop #{hop.hopNumber}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">
                      {hop.fromServer} → {hop.byServer}
                    </span>
                  </div>
                  {hop.delaySeconds !== undefined && (
                    <span className="text-slate-500 font-mono">+{hop.delaySeconds}s delay</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 8. Email-to-HTML Converter
// ==========================================
export const EmailToHtmlConverter: React.FC = () => {
  const [plainText, setPlainText] = useState(
    `Welcome to the Team!\n\nWe are excited to have you on board. Here are your onboarding links:\n\n* Employee Handbook: https://acme.example.com/handbook\n* IT Setup Guide: https://acme.example.com/it\n* Team Slack Channel: #welcome\n\nPlease reach out if you have any questions.\n\nBest regards,\nPeople Team`
  );
  const [copied, setCopied] = useState(false);

  const convertToHtml = () => {
    const paragraphs = plainText.split(/\n\s*\n/);
    const htmlBody = paragraphs
      .map((para) => {
        const lines = para.split('\n');
        const isBulletList = lines.every((l) => l.trim().startsWith('* ') || l.trim().startsWith('- ') || l.trim().startsWith('• '));
        if (isBulletList) {
          const items = lines.map((l) => `<li style="margin-bottom:6px;">${l.replace(/^[\*\-•]\s*/, '')}</li>`).join('');
          return `<ul style="padding-left:20px;color:#334155;margin:12px 0;">${items}</ul>`;
        }
        return `<p style="margin:0 0 16px;line-height:1.6;color:#334155;">${para.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family:Arial,sans-serif;font-size:15px;color:#334155;background:#ffffff;margin:0;padding:20px;">
  ${htmlBody}
</body>
</html>`;
  };

  const htmlOutput = convertToHtml();

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Plain Text Email Body</label>
        <textarea
          rows={6}
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Converted Inline HTML Email</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(htmlOutput);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML!' : 'Copy HTML Code'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-60">
          {htmlOutput}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 9. Email Readability Checker
// ==========================================
export const EmailReadabilityChecker: React.FC = () => {
  const [copy, setCopy] = useState(
    `Hi Team,\n\nI wanted to share a brief update on our progress for the website redesign. Over the past two weeks, we finalized the responsive layout and improved user navigation across mobile devices.\n\nWe would appreciate your feedback on the staging link by this Thursday afternoon.\n\nThanks,\nAlex`
  );

  const metrics = calculateReadability(copy);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Content</label>
        <textarea
          rows={5}
          value={copy}
          onChange={(e) => setCopy(e.target.value)}
          placeholder="Paste or type your email message here..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Reading Ease</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{metrics.readingEaseScore} / 100</span>
          <span className="text-[11px] text-slate-500 block truncate">{metrics.readingEaseLevel}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Grade Level</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Grade {metrics.gradeLevel}</span>
          <span className="text-[11px] text-slate-500 block">Flesch-Kincaid</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Word Count</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{metrics.wordCount} words</span>
          <span className="text-[11px] text-slate-500 block">{metrics.sentenceCount} sentence(s)</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Read Time</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">~{metrics.readingTimeMinutes}m</span>
          <span className="text-[11px] text-slate-500 block">Quick skim</span>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Optimization Recommendations</span>
        <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
          {metrics.suggestions.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 10. Email Disclaimer Generator
// ==========================================
export const EmailDisclaimerGenerator: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<'confidentiality' | 'legal' | 'healthcare' | 'financial'>('confidentiality');
  const [copied, setCopied] = useState(false);

  const getDisclaimer = () => {
    switch (category) {
      case 'legal':
        return `IMPORTANT LEGAL NOTICE: The information contained in this communication from ${companyName} is privileged and strictly confidential. It is intended solely for the use of the individual or entity named above. If you are not the intended recipient, please be aware that any review, disclosure, copying, distribution, or action taken in reliance on the contents of this information is strictly prohibited. If you have received this transmission in error, please immediately notify the sender and delete this email and all attached files.`;
      case 'healthcare':
        return `CONFIDENTIAL HEALTHCARE INFORMATION (HIPAA NOTICE): This transmission from ${companyName} contains confidential medical and protected health information. This information is intended solely for the use of the intended recipient. Federal regulations strictly prohibit unauthorized disclosure. If you are not the intended recipient, any dissemination, distribution, or copying is strictly prohibited. Please notify the sender immediately and destroy all copies.`;
      case 'financial':
        return `FINANCIAL DISCLAIMER: This communication is provided by ${companyName} for informational purposes only and does not constitute financial, investment, tax, or legal advice. Any market data or securities mentioned are illustrative. Please consult a qualified financial advisor before executing financial decisions.`;
      default: // confidentiality
        return `CONFIDENTIALITY NOTICE: This email and any attachments are confidential and intended solely for the recipient named above. If you have received this transmission in error, please notify the sender immediately and delete this message from your system. Any unauthorized copying, distribution, or retention is strictly prohibited. Copyright © ${companyName}.`;
    }
  };

  const disclaimerText = getDisclaimer();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company or organization name"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Disclaimer Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
          >
            <option value="confidentiality">General Corporate Confidentiality</option>
            <option value="legal">Legal & Attorney-Client Privilege</option>
            <option value="healthcare">Healthcare & HIPAA Protected</option>
            <option value="financial">Financial & Investment Advisory</option>
          </select>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Disclaimer Notice</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(disclaimerText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Disclaimer'}
          </button>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          {disclaimerText}
        </div>
      </div>
    </div>
  );
};
