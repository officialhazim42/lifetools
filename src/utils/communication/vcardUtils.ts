/**
 * vCard 3.0 & 4.0 generation, parsing, CSV conversion, and deduplication
 */

import { VCardContact, ContactDuplicateMatch } from '../../types/communication';

/**
 * Escapes special characters for vCard property values.
 */
function escapeVCardValue(val: string): string {
  if (!val) return '';
  return val
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function unescapeVCardValue(val: string): string {
  if (!val) return '';
  return val
    .replace(/\\n/gi, '\n')
    .replace(/\\;/g, ';')
    .replace(/\\,/g, ',')
    .replace(/\\\\/g, '\\');
}

/**
 * Generates standard vCard 3.0 text string.
 */
export function generateVCard(contact: VCardContact): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fn = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim() || 'Contact';
  lines.push(`FN:${escapeVCardValue(fn)}`);
  lines.push(
    `N:${escapeVCardValue(contact.lastName)};${escapeVCardValue(contact.firstName)};;;`
  );

  if (contact.organization) {
    lines.push(`ORG:${escapeVCardValue(contact.organization)}`);
  }
  if (contact.jobTitle) {
    lines.push(`TITLE:${escapeVCardValue(contact.jobTitle)}`);
  }
  if (contact.mobile) {
    lines.push(`TEL;TYPE=CELL,VOICE:${contact.mobile.trim()}`);
  }
  if (contact.phone && contact.phone !== contact.mobile) {
    lines.push(`TEL;TYPE=HOME,VOICE:${contact.phone.trim()}`);
  }
  if (contact.workPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${contact.workPhone.trim()}`);
  }
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET,HOME:${contact.email.trim()}`);
  }
  if (contact.workEmail) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${contact.workEmail.trim()}`);
  }
  if (contact.website) {
    lines.push(`URL:${contact.website.trim()}`);
  }
  if (contact.street || contact.city || contact.state || contact.zip || contact.country) {
    const street = escapeVCardValue(contact.street || '');
    const city = escapeVCardValue(contact.city || '');
    const state = escapeVCardValue(contact.state || '');
    const zip = escapeVCardValue(contact.zip || '');
    const country = escapeVCardValue(contact.country || '');
    lines.push(`ADR;TYPE=HOME:;;${street};${city};${state};${zip};${country}`);
  }
  if (contact.notes) {
    lines.push(`NOTE:${escapeVCardValue(contact.notes)}`);
  }

  lines.push('REV:' + new Date().toISOString());
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

export function generateVCardBlob(contact: VCardContact): Blob {
  const text = generateVCard(contact);
  return new Blob([text], { type: 'text/vcard;charset=utf-8' });
}

export function generateMultipleVCards(contacts: VCardContact[]): string {
  return contacts.map(generateVCard).join('\r\n\r\n');
}

/**
 * Parses single or multi-record vCard text into VCardContact array.
 */
export function parseVCards(vcfText: string): VCardContact[] {
  const contacts: VCardContact[] = [];
  if (!vcfText || !vcfText.includes('BEGIN:VCARD')) return contacts;

  // Split into vcard blocks
  const blocks = vcfText.split(/BEGIN:VCARD/i).filter((b) => b.includes('END:VCARD'));

  blocks.forEach((block, idx) => {
    // Unfold multi-line folded headers (RFC 2425: CRLF followed by space or tab)
    const unfolded = block.replace(/\r?\n[ \t]/g, '');
    const lines = unfolded.split(/\r?\n/);

    const contact: VCardContact = {
      id: `vcard_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      firstName: '',
      lastName: ''
    };

    lines.forEach((line) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) return;

      const rawKey = line.substring(0, colonIdx).trim();
      const rawVal = line.substring(colonIdx + 1).trim();
      const upperKey = rawKey.toUpperCase();

      if (upperKey === 'FN') {
        const full = unescapeVCardValue(rawVal);
        if (!contact.firstName && !contact.lastName) {
          const parts = full.split(' ');
          contact.firstName = parts[0] || '';
          contact.lastName = parts.slice(1).join(' ') || '';
        }
      } else if (upperKey.startsWith('N') && !upperKey.startsWith('NOTE')) {
        const parts = rawVal.split(';').map(unescapeVCardValue);
        if (parts[1]) contact.firstName = parts[1];
        if (parts[0]) contact.lastName = parts[0];
      } else if (upperKey.startsWith('ORG')) {
        contact.organization = unescapeVCardValue(rawVal.split(';')[0]);
      } else if (upperKey.startsWith('TITLE')) {
        contact.jobTitle = unescapeVCardValue(rawVal);
      } else if (upperKey.startsWith('TEL')) {
        const cleanTel = unescapeVCardValue(rawVal);
        if (upperKey.includes('CELL') || upperKey.includes('MOBILE')) {
          contact.mobile = cleanTel;
        } else if (upperKey.includes('WORK')) {
          contact.workPhone = cleanTel;
        } else {
          if (!contact.phone) contact.phone = cleanTel;
          else if (!contact.mobile) contact.mobile = cleanTel;
        }
      } else if (upperKey.startsWith('EMAIL')) {
        const cleanEmail = unescapeVCardValue(rawVal);
        if (upperKey.includes('WORK')) {
          contact.workEmail = cleanEmail;
        } else {
          if (!contact.email) contact.email = cleanEmail;
          else if (!contact.workEmail) contact.workEmail = cleanEmail;
        }
      } else if (upperKey.startsWith('URL')) {
        contact.website = unescapeVCardValue(rawVal);
      } else if (upperKey.startsWith('ADR')) {
        const parts = rawVal.split(';').map(unescapeVCardValue);
        // ADR format: PO Box; Extended Address; Street; Locality (City); Region (State); Postal Code; Country
        if (parts[2]) contact.street = parts[2];
        if (parts[3]) contact.city = parts[3];
        if (parts[4]) contact.state = parts[4];
        if (parts[5]) contact.zip = parts[5];
        if (parts[6]) contact.country = parts[6];
      } else if (upperKey.startsWith('NOTE')) {
        contact.notes = unescapeVCardValue(rawVal);
      }
    });

    if (contact.firstName || contact.lastName || contact.phone || contact.mobile || contact.email || contact.organization) {
      contacts.push(contact);
    }
  });

  return contacts;
}

/**
 * Converts array of VCardContacts to RFC 4180 CSV string.
 */
export function vCardsToCsv(contacts: VCardContact[]): string {
  const headers = [
    'First Name',
    'Last Name',
    'Organization',
    'Job Title',
    'Mobile',
    'Phone',
    'Work Phone',
    'Email',
    'Work Email',
    'Website',
    'Street',
    'City',
    'State',
    'Zip',
    'Country',
    'Notes'
  ];

  const escapeCsv = (val?: string) => {
    if (!val) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = contacts.map((c) => [
    escapeCsv(c.firstName),
    escapeCsv(c.lastName),
    escapeCsv(c.organization),
    escapeCsv(c.jobTitle),
    escapeCsv(c.mobile),
    escapeCsv(c.phone),
    escapeCsv(c.workPhone),
    escapeCsv(c.email),
    escapeCsv(c.workEmail),
    escapeCsv(c.website),
    escapeCsv(c.street),
    escapeCsv(c.city),
    escapeCsv(c.state),
    escapeCsv(c.zip),
    escapeCsv(c.country),
    escapeCsv(c.notes)
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Parses CSV text to VCardContact array with smart column header auto-detection.
 */
export function csvToVCards(csvText: string): VCardContact[] {
  if (!csvText || !csvText.trim()) return [];

  const lines: string[] = [];
  let currentLine = '';
  let insideQuote = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !insideQuote) {
      if (char === '\r' && csvText[i + 1] === '\n') {
        i++;
      }
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  if (lines.length < 2) return [];

  // Parse row into tokens
  const parseRow = (line: string): string[] => {
    const tokens: string[] = [];
    let token = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          token += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        tokens.push(token.trim());
        token = '';
      } else {
        token += c;
      }
    }
    tokens.push(token.trim());
    return tokens;
  };

  const rawHeaders = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const findIdx = (candidates: string[]): number => {
    for (const cand of candidates) {
      const idx = rawHeaders.findIndex((h) => h === cand || h.includes(cand));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const fnIdx = findIdx(['firstname', 'first', 'givenname', 'name']);
  const lnIdx = findIdx(['lastname', 'last', 'surname', 'familyname']);
  const orgIdx = findIdx(['organization', 'company', 'org', 'business']);
  const titleIdx = findIdx(['jobtitle', 'title', 'role', 'position']);
  const mobileIdx = findIdx(['mobile', 'cell', 'cellular', 'mobilephone']);
  const phoneIdx = findIdx(['phone', 'telephone', 'tel', 'homephone']);
  const emailIdx = findIdx(['email', 'mail', 'emailaddress']);
  const webIdx = findIdx(['website', 'url', 'web', 'link']);
  const streetIdx = findIdx(['street', 'address', 'address1']);
  const cityIdx = findIdx(['city', 'locality', 'town']);
  const stateIdx = findIdx(['state', 'region', 'province']);
  const zipIdx = findIdx(['zip', 'postalcode', 'postcode']);
  const countryIdx = findIdx(['country']);
  const notesIdx = findIdx(['notes', 'note', 'comments', 'description']);

  const contacts: VCardContact[] = [];

  for (let r = 1; r < lines.length; r++) {
    const cols = parseRow(lines[r]);
    if (cols.every((c) => !c)) continue;

    let firstName = fnIdx >= 0 ? cols[fnIdx] || '' : '';
    let lastName = lnIdx >= 0 ? cols[lnIdx] || '' : '';

    // If only one full name column exists, split it
    if (fnIdx >= 0 && lnIdx === -1 && firstName.includes(' ')) {
      const parts = firstName.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const contact: VCardContact = {
      id: `csv_contact_${Date.now()}_${r}`,
      firstName,
      lastName,
      organization: orgIdx >= 0 ? cols[orgIdx] : undefined,
      jobTitle: titleIdx >= 0 ? cols[titleIdx] : undefined,
      mobile: mobileIdx >= 0 ? cols[mobileIdx] : undefined,
      phone: phoneIdx >= 0 ? cols[phoneIdx] : undefined,
      email: emailIdx >= 0 ? cols[emailIdx] : undefined,
      website: webIdx >= 0 ? cols[webIdx] : undefined,
      street: streetIdx >= 0 ? cols[streetIdx] : undefined,
      city: cityIdx >= 0 ? cols[cityIdx] : undefined,
      state: stateIdx >= 0 ? cols[stateIdx] : undefined,
      zip: zipIdx >= 0 ? cols[zipIdx] : undefined,
      country: countryIdx >= 0 ? cols[countryIdx] : undefined,
      notes: notesIdx >= 0 ? cols[notesIdx] : undefined
    };

    if (contact.firstName || contact.lastName || contact.phone || contact.mobile || contact.email || contact.organization) {
      contacts.push(contact);
    }
  }

  return contacts;
}

/**
 * Normalizes phone string for fuzzy deduplication comparison.
 */
function normalizePhone(p?: string): string {
  if (!p) return '';
  return p.replace(/[^0-9]/g, '');
}

/**
 * Contact Deduplication Algorithm with match scoring.
 */
export function detectDuplicates(contacts: VCardContact[]): ContactDuplicateMatch[] {
  const duplicates: ContactDuplicateMatch[] = [];

  for (let i = 0; i < contacts.length; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      const a = contacts[i];
      const b = contacts[j];

      let score = 0;
      const reasons: string[] = [];

      // 1. Phone number match
      const aPhones = [normalizePhone(a.phone), normalizePhone(a.mobile), normalizePhone(a.workPhone)].filter((p) => p.length >= 7);
      const bPhones = [normalizePhone(b.phone), normalizePhone(b.mobile), normalizePhone(b.workPhone)].filter((p) => p.length >= 7);
      const phoneMatch = aPhones.some((ap) => bPhones.some((bp) => ap === bp || (ap.length >= 7 && bp.length >= 7 && (ap.endsWith(bp) || bp.endsWith(ap)))));
      if (phoneMatch) {
        score += 60;
        reasons.push('Identical or matching phone number');
      }

      // 2. Email match
      const aEmails = [a.email?.toLowerCase().trim(), a.workEmail?.toLowerCase().trim()].filter(Boolean);
      const bEmails = [b.email?.toLowerCase().trim(), b.workEmail?.toLowerCase().trim()].filter(Boolean);
      const emailMatch = aEmails.some((ae) => bEmails.some((be) => ae === be));
      if (emailMatch) {
        score += 65;
        reasons.push('Exact email address match');
      }

      // 3. Name match
      const aName = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
      const bName = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      if (aName && bName && aName === bName) {
        score += 45;
        reasons.push('Exact full name match');
      } else if (a.lastName && b.lastName && a.lastName.toLowerCase() === b.lastName.toLowerCase() && a.firstName && b.firstName && (a.firstName[0].toLowerCase() === b.firstName[0].toLowerCase())) {
        score += 20;
        reasons.push('Same last name & first initial');
      }

      // 4. Organization match bonus
      if (a.organization && b.organization && a.organization.toLowerCase() === b.organization.toLowerCase() && score > 0) {
        score += 15;
        reasons.push('Same organization');
      }

      if (score >= 50) {
        duplicates.push({
          contactA: a,
          contactB: b,
          confidenceScore: Math.min(score, 100),
          matchReasons: reasons
        });
      }
    }
  }

  return duplicates;
}

/**
 * Safely merges two contacts, combining non-conflicting fields.
 */
export function mergeContacts(primary: VCardContact, secondary: VCardContact): VCardContact {
  return {
    id: primary.id,
    firstName: primary.firstName || secondary.firstName,
    lastName: primary.lastName || secondary.lastName,
    organization: primary.organization || secondary.organization,
    jobTitle: primary.jobTitle || secondary.jobTitle,
    phone: primary.phone || secondary.phone,
    mobile: primary.mobile || secondary.mobile,
    workPhone: primary.workPhone || secondary.workPhone,
    email: primary.email || secondary.email,
    workEmail: primary.workEmail || secondary.workEmail,
    website: primary.website || secondary.website,
    street: primary.street || secondary.street,
    city: primary.city || secondary.city,
    state: primary.state || secondary.state,
    zip: primary.zip || secondary.zip,
    country: primary.country || secondary.country,
    notes: [primary.notes, secondary.notes].filter(Boolean).join('\n---\n')
  };
}
