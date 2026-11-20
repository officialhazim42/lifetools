/**
 * Email syntax validation, header analysis, and readability metrics
 */

import {
  EmailSyntaxResult,
  EmailHeaderAnalysis,
  EmailHeaderHop,
  EmailReadabilityMetrics
} from '../../types/communication';

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'zoho.com',
  'mail.com',
  'gmx.com'
];

const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'icoud.com': 'icloud.com'
};

const ROLE_BASED_PREFIXES = [
  'admin',
  'support',
  'info',
  'contact',
  'sales',
  'billing',
  'marketing',
  'team',
  'help',
  'office',
  'noreply',
  'no-reply',
  'service',
  'press',
  'hr',
  'careers'
];

/**
 * Validates email address syntax according to RFC 5322 guidelines.
 */
export function validateEmailSyntax(emailInput: string): EmailSyntaxResult {
  const email = emailInput.trim();
  const issues: string[] = [];

  if (!email) {
    return {
      email,
      isValid: false,
      userPart: '',
      domainPart: '',
      tld: '',
      issues: ['Email address cannot be empty.'],
      isRoleBased: false,
      isFreeProvider: false
    };
  }

  if (email.length > 254) {
    issues.push('Email length exceeds 254 character RFC limit.');
  }

  const atCount = (email.match(/@/g) || []).length;
  if (atCount === 0) {
    issues.push('Missing "@" symbol.');
  } else if (atCount > 1) {
    issues.push('Contains multiple "@" symbols.');
  }

  if (issues.length > 0) {
    return {
      email,
      isValid: false,
      userPart: '',
      domainPart: '',
      tld: '',
      issues,
      isRoleBased: false,
      isFreeProvider: false
    };
  }

  const [userPart, domainPart] = email.split('@');

  // Validate local / user part
  if (!userPart) {
    issues.push('User/local part cannot be empty.');
  } else if (userPart.length > 64) {
    issues.push('Local part exceeds 64 characters.');
  } else {
    if (userPart.startsWith('.') || userPart.endsWith('.')) {
      issues.push('Local part cannot start or end with a period.');
    }
    if (userPart.includes('..')) {
      issues.push('Local part contains consecutive periods (..).');
    }
    if (/[^\w.!#$%&'*+/=?^_`{|}~-]/.test(userPart)) {
      issues.push('Local part contains illegal characters.');
    }
  }

  // Validate domain part
  let tld = '';
  if (!domainPart) {
    issues.push('Domain part cannot be empty.');
  } else {
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      issues.push('Domain cannot start or end with a period.');
    }
    if (domainPart.includes('..')) {
      issues.push('Domain contains consecutive periods (..).');
    }
    if (domainPart.length > 253) {
      issues.push('Domain exceeds 253 characters.');
    }

    const domainLabels = domainPart.split('.');
    if (domainLabels.length < 2) {
      issues.push('Domain must have at least one period and a top-level domain (e.g., .com).');
    } else {
      tld = domainLabels[domainLabels.length - 1];
      if (tld.length < 2) {
        issues.push('Top-level domain (TLD) must be at least 2 characters.');
      }
      if (!/^[a-zA-Z]+$/.test(tld)) {
        issues.push('TLD should only contain alphabet characters.');
      }
      for (const label of domainLabels) {
        if (!label) {
          issues.push('Domain contains empty label between dots.');
        } else if (label.startsWith('-') || label.endsWith('-')) {
          issues.push('Domain labels cannot start or end with a hyphen.');
        } else if (!/^[a-zA-Z0-9-]+$/.test(label)) {
          issues.push(`Domain label "${label}" contains illegal characters.`);
        }
      }
    }
  }

  // Suggest typo correction
  let suggestions: string | undefined;
  if (domainPart && DOMAIN_TYPOS[domainPart.toLowerCase()]) {
    const fixedDomain = DOMAIN_TYPOS[domainPart.toLowerCase()];
    suggestions = `Did you mean ${userPart}@${fixedDomain}?`;
  }

  const isRoleBased = ROLE_BASED_PREFIXES.includes(userPart.toLowerCase());
  const isFreeProvider = COMMON_DOMAINS.includes(domainPart.toLowerCase());

  return {
    email,
    isValid: issues.length === 0,
    userPart,
    domainPart,
    tld,
    issues,
    suggestions,
    isRoleBased,
    isFreeProvider
  };
}

/**
 * Parses raw RFC 822 email headers.
 */
export function parseEmailHeaders(headerText: string): EmailHeaderAnalysis {
  const lines = headerText.split(/\r?\n/);
  // Unfold multi-line headers
  const unfoldedLines: string[] = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && unfoldedLines.length > 0) {
      unfoldedLines[unfoldedLines.length - 1] += ' ' + line.trim();
    } else if (line.trim()) {
      unfoldedLines.push(line.trim());
    }
  }

  const headers: Record<string, string[]> = {};
  for (const line of unfoldedLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const name = line.substring(0, colonIdx).trim().toLowerCase();
    const val = line.substring(colonIdx + 1).trim();
    if (!headers[name]) headers[name] = [];
    headers[name].push(val);
  }

  const getFirst = (key: string) => (headers[key] ? headers[key][0] : undefined);

  // Parse Received hops
  const receivedList = headers['received'] || [];
  const hops: EmailHeaderHop[] = [];
  let hopIndex = 1;

  for (let i = receivedList.length - 1; i >= 0; i--) {
    const rec = receivedList[i];
    let fromServer = 'Unknown';
    let byServer = 'Unknown';

    const fromMatch = rec.match(/from\s+([^\s;]+)/i);
    if (fromMatch) fromServer = fromMatch[1];

    const byMatch = rec.match(/by\s+([^\s;]+)/i);
    if (byMatch) byServer = byMatch[1];

    const dateMatch = rec.match(/;\s*([^;]+)$/);
    const timestamp = dateMatch ? dateMatch[1].trim() : undefined;

    hops.push({
      hopNumber: hopIndex++,
      fromServer,
      byServer,
      timestamp
    });
  }

  // Calculate delays between hops if timestamps are valid dates
  let totalDelaySeconds = 0;
  for (let i = 1; i < hops.length; i++) {
    const prevTime = hops[i - 1].timestamp ? Date.parse(hops[i - 1].timestamp!) : NaN;
    const currTime = hops[i].timestamp ? Date.parse(hops[i].timestamp!) : NaN;
    if (!isNaN(prevTime) && !isNaN(currTime)) {
      const diffSec = Math.max(0, Math.round((currTime - prevTime) / 1000));
      hops[i].delaySeconds = diffSec;
      totalDelaySeconds += diffSec;
    }
  }

  const authResults = getFirst('authentication-results') || '';
  const receivedSpf = getFirst('received-spf') || '';
  const dkimSignature = getFirst('dkim-signature') || '';

  const spfPass =
    receivedSpf.toLowerCase().includes('pass') ||
    authResults.toLowerCase().includes('spf=pass')
      ? true
      : receivedSpf.toLowerCase().includes('fail')
      ? false
      : null;

  const dkimPass =
    authResults.toLowerCase().includes('dkim=pass') || dkimSignature.length > 0
      ? true
      : authResults.toLowerCase().includes('dkim=fail')
      ? false
      : null;

  const dmarcPass = authResults.toLowerCase().includes('dmarc=pass')
    ? true
    : authResults.toLowerCase().includes('dmarc=fail')
    ? false
    : null;

  return {
    from: getFirst('from'),
    to: getFirst('to'),
    subject: getFirst('subject'),
    date: getFirst('date'),
    messageId: getFirst('message-id'),
    replyTo: getFirst('reply-to'),
    returnPath: getFirst('return-path'),
    spf: receivedSpf || (authResults.match(/spf=[^;\s]+/i) || [])[0],
    dkim: dkimSignature ? 'Present' : undefined,
    dmarc: (authResults.match(/dmarc=[^;\s]+/i) || [])[0],
    mailer: getFirst('x-mailer') || getFirst('user-agent'),
    hops,
    totalHops: hops.length,
    totalDelaySeconds,
    securityFlags: {
      spfPass,
      dkimPass,
      dmarcPass
    }
  };
}

/**
 * Counts syllables in an English word using phonetic heuristic.
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Calculates Flesch-Kincaid Grade Level and Reading Ease for email copy.
 */
export function calculateReadability(text: string): EmailReadabilityMetrics {
  const rawText = text.trim();
  if (!rawText) {
    return {
      characterCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      syllableCount: 0,
      complexWordsCount: 0,
      readingEaseScore: 100,
      readingEaseLevel: 'Very Easy',
      gradeLevel: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      suggestions: ['Write or paste your email copy to analyze readability.']
    };
  }

  const characterCount = rawText.length;
  const paragraphs = rawText.split(/\r?\n\s*\r?\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);

  // Split into sentences (by . ! ? followed by space or newline)
  const sentences = rawText.split(/[.!?]+(?:\s+|\r?\n|$)/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Words
  const words = rawText.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w));
  const wordCount = Math.max(1, words.length);

  let syllableCount = 0;
  let complexWordsCount = 0;

  for (const word of words) {
    const syl = countSyllables(word);
    syllableCount += syl;
    if (syl >= 3) complexWordsCount++;
  }

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  let readingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  readingEase = Math.max(0, Math.min(100, Math.round(readingEase * 10) / 10));

  let readingEaseLevel = 'Standard';
  if (readingEase >= 90) readingEaseLevel = 'Very Easy (5th grade)';
  else if (readingEase >= 80) readingEaseLevel = 'Easy (6th grade)';
  else if (readingEase >= 70) readingEaseLevel = 'Fairly Easy (7th grade)';
  else if (readingEase >= 60) readingEaseLevel = 'Standard (8th-9th grade)';
  else if (readingEase >= 50) readingEaseLevel = 'Fairly Difficult (10th-12th grade)';
  else if (readingEase >= 30) readingEaseLevel = 'Difficult (College level)';
  else readingEaseLevel = 'Very Difficult (Academic/Technical)';

  // Flesch-Kincaid Grade Level: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
  let gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  gradeLevel = Math.max(1, Math.round(gradeLevel * 10) / 10);

  const readingTimeMinutes = Math.round((wordCount / 200) * 10) / 10;
  const speakingTimeMinutes = Math.round((wordCount / 130) * 10) / 10;

  const suggestions: string[] = [];
  if (wordsPerSentence > 20) {
    suggestions.push(`Average sentence length is high (${Math.round(wordsPerSentence)} words). Aim for 12–15 words per sentence in emails.`);
  }
  if (complexWordsCount / wordCount > 0.15) {
    suggestions.push(`High density of complex words (${Math.round((complexWordsCount / wordCount) * 100)}%). Replace polysyllabic jargon with direct words.`);
  }
  if (wordCount > 300) {
    suggestions.push(`Email is long (${wordCount} words). Professional emails have higher response rates under 150 words.`);
  }
  if (readingEase < 60) {
    suggestions.push('Reading ease is lower than recommended for quick business emails. Simplify sentence structures.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Great readability! Your email is concise, clear, and easy to skim.');
  }

  return {
    characterCount,
    wordCount,
    sentenceCount,
    paragraphCount,
    syllableCount,
    complexWordsCount,
    readingEaseScore: readingEase,
    readingEaseLevel,
    gradeLevel,
    readingTimeMinutes,
    speakingTimeMinutes,
    suggestions
  };
}

/**
 * Formats plain text for emails: wraps paragraphs at target width, normalizes bullet points and quotes.
 */
export function formatEmailText(
  text: string,
  options: {
    wrapWidth?: number;
    normalizeBullets?: boolean;
    cleanQuotes?: boolean;
    stripExtraBlankLines?: boolean;
  } = {}
): string {
  const {
    wrapWidth = 72,
    normalizeBullets = true,
    cleanQuotes = true,
    stripExtraBlankLines = true
  } = options;

  let lines = text.split(/\r?\n/);

  if (cleanQuotes) {
    lines = lines.map((l) => l.replace(/^[ \t]*>[ \t]*/, '> '));
  }

  if (normalizeBullets) {
    lines = lines.map((l) => l.replace(/^[ \t]*[\*\-\+•][ \t]+/, '• '));
  }

  // Paragraph wrapping
  const resultLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('>') || line.startsWith('•') || line.trim().length <= wrapWidth) {
      resultLines.push(line);
      continue;
    }

    const words = line.split(' ');
    let current = '';
    for (const w of words) {
      if (!current) {
        current = w;
      } else if (current.length + 1 + w.length <= wrapWidth) {
        current += ' ' + w;
      } else {
        resultLines.push(current);
        current = w;
      }
    }
    if (current) resultLines.push(current);
  }

  let output = resultLines.join('\n');
  if (stripExtraBlankLines) {
    output = output.replace(/\n{3,}/g, '\n\n');
  }

  return output.trim();
}
