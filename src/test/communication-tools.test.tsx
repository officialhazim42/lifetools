import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  validateEmailSyntax,
  parseEmailHeaders,
  calculateReadability,
  formatEmailText
} from '../utils/communication/emailUtils';
import {
  generateVCard,
  parseVCards,
  vCardsToCsv,
  csvToVCards,
  detectDuplicates,
  mergeContacts
} from '../utils/communication/vcardUtils';
import {
  analyzeSms,
  sanitizeToGsm7,
  isGsm7Character
} from '../utils/communication/smsUtils';
import {
  validateAndFormatPhone,
  cleanPhoneNumber,
  matchCountry
} from '../utils/communication/phoneUtils';
import { communicationDB } from '../utils/communicationDB';
import { VCardContact } from '../types/communication';

// Component imports
import { EmailSignatureGenerator } from '../components/tools/communication/EmailTools';
import { VCardViewer } from '../components/tools/communication/ContactTools';
import { WhatsAppMessageFormatter } from '../components/tools/communication/MessagingTools';
import { ImportantContactsOrganizer } from '../components/tools/communication/OrganizerTools';

describe('LifeTools Communication & Social Utilities Suite', () => {
  // ==========================================
  // 1. Email Utilities Tests
  // ==========================================
  describe('Email Utilities', () => {
    it('validates RFC 5322 email syntax accurately', () => {
      const valid1 = validateEmailSyntax('alex.morgan@example.com');
      expect(valid1.isValid).toBe(true);
      expect(valid1.userPart).toBe('alex.morgan');
      expect(valid1.domainPart).toBe('example.com');
      expect(valid1.tld).toBe('com');
      expect(valid1.issues.length).toBe(0);

      const invalidNoAt = validateEmailSyntax('invalid-address.com');
      expect(invalidNoAt.isValid).toBe(false);
      expect(invalidNoAt.issues).toContain('Missing "@" symbol.');

      const invalidDoubleDot = validateEmailSyntax('user..name@example.com');
      expect(invalidDoubleDot.isValid).toBe(false);
      expect(invalidDoubleDot.issues).toContain('Local part contains consecutive periods (..).');
    });

    it('suggests domain typo corrections for common providers', () => {
      const typoResult = validateEmailSyntax('user@gmial.com');
      expect(typoResult.suggestions).toBe('Did you mean user@gmail.com?');

      const yahooTypo = validateEmailSyntax('user@yaho.com');
      expect(yahooTypo.suggestions).toBe('Did you mean user@yahoo.com?');
    });

    it('identifies role-based addresses correctly', () => {
      const admin = validateEmailSyntax('admin@company.com');
      expect(admin.isRoleBased).toBe(true);

      const support = validateEmailSyntax('support@company.com');
      expect(support.isRoleBased).toBe(true);

      const personal = validateEmailSyntax('hazim.bashir@company.com');
      expect(personal.isRoleBased).toBe(false);
    });

    it('parses raw RFC 822 email headers and relay hops', () => {
      const sampleHeaders = `From: sender@example.com\nTo: recipient@example.com\nSubject: Test Email\nReceived: from relay.example.com by mx.google.com; Tue, 19 Nov 2026 12:00:00 +0000\nAuthentication-Results: mx.google.com; spf=pass; dkim=pass\nReceived-SPF: pass`;
      const parsed = parseEmailHeaders(sampleHeaders);

      expect(parsed.from).toBe('sender@example.com');
      expect(parsed.subject).toBe('Test Email');
      expect(parsed.totalHops).toBe(1);
      expect(parsed.securityFlags.spfPass).toBe(true);
      expect(parsed.securityFlags.dkimPass).toBe(true);
    });

    it('calculates Flesch-Kincaid readability metrics for email text', () => {
      const text = 'This is a clear, concise email. Please let me know your thoughts tomorrow.';
      const metrics = calculateReadability(text);

      expect(metrics.wordCount).toBeGreaterThan(0);
      expect(metrics.sentenceCount).toBe(2);
      expect(metrics.readingEaseScore).toBeGreaterThanOrEqual(60);
      expect(metrics.gradeLevel).toBeLessThan(12);
    });

    it('formats email plain text with 72-column wrapping and clean quotes', () => {
      const text = '>   Old quoted message text\n* Item 1\n* Item 2\nThis is a rather long line of text that should be wrapped around standard column boundary width for clean email rendering.';
      const formatted = formatEmailText(text, { wrapWidth: 40 });

      expect(formatted).toContain('> Old quoted message text');
      expect(formatted).toContain('• Item 1');
      expect(formatted.split('\n').length).toBeGreaterThan(3);
    });
  });

  // ==========================================
  // 2. Contact & vCard Utilities Tests
  // ==========================================
  describe('Contact & vCard Utilities', () => {
    const sampleContact: VCardContact = {
      id: 'c_1',
      firstName: 'Jordan',
      lastName: 'Hayes',
      organization: 'Acme Corp',
      jobTitle: 'Lead Engineer',
      phone: '+1 555-0100',
      email: 'jordan@example.com',
      city: 'San Francisco',
      country: 'USA'
    };

    it('generates standard vCard 3.0 string with correct formatting', () => {
      const vcard = generateVCard(sampleContact);
      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('VERSION:3.0');
      expect(vcard).toContain('FN:Jordan Hayes');
      expect(vcard).toContain('N:Hayes;Jordan;;;');
      expect(vcard).toContain('ORG:Acme Corp');
      expect(vcard).toContain('TITLE:Lead Engineer');
      expect(vcard).toContain('TEL;TYPE=HOME,VOICE:+1 555-0100');
      expect(vcard).toContain('EMAIL;TYPE=INTERNET,HOME:jordan@example.com');
      expect(vcard).toContain('END:VCARD');
    });

    it('parses vCard 3.0 records accurately', () => {
      const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:Elena Rostova\nN:Rostova;Elena;;;\nORG:BioTech\nTEL:+44 7911 123456\nEMAIL:elena@example.com\nEND:VCARD`;
      const contacts = parseVCards(vcf);

      expect(contacts.length).toBe(1);
      expect(contacts[0].firstName).toBe('Elena');
      expect(contacts[0].lastName).toBe('Rostova');
      expect(contacts[0].organization).toBe('BioTech');
      expect(contacts[0].phone).toBe('+44 7911 123456');
      expect(contacts[0].email).toBe('elena@example.com');
    });

    it('converts vCards to CSV spreadsheet format', () => {
      const contacts: VCardContact[] = [
        sampleContact,
        { id: 'c_2', firstName: 'Bob', lastName: 'Lee', phone: '555-0200', email: 'bob@example.com' }
      ];
      const csv = vCardsToCsv(contacts);
      expect(csv).toContain('First Name,Last Name');
      expect(csv).toContain('"Jordan","Hayes"');
      expect(csv).toContain('"Bob","Lee"');
    });

    it('converts CSV text to structured vCard contacts', () => {
      const csv = `"First Name","Last Name","Phone","Email"\n"Sarah","Connor","+1 555-9876","sarah@example.com"`;
      const contacts = csvToVCards(csv);

      expect(contacts.length).toBe(1);
      expect(contacts[0].firstName).toBe('Sarah');
      expect(contacts[0].lastName).toBe('Connor');
      expect(contacts[0].phone).toBe('+1 555-9876');
      expect(contacts[0].email).toBe('sarah@example.com');
    });

    it('detects duplicate contacts with confidence scoring', () => {
      const contacts: VCardContact[] = [
        { id: '1', firstName: 'David', lastName: 'Miller', phone: '+1 555-0101', email: 'david@example.com' },
        { id: '2', firstName: 'David', lastName: 'Miller', phone: '5550101', email: 'dmiller@work.com' },
        { id: '3', firstName: 'Jessica', lastName: 'Lee', phone: '555-9999', email: 'jessica@example.com' }
      ];

      const duplicates = detectDuplicates(contacts);
      expect(duplicates.length).toBe(1);
      expect(duplicates[0].confidenceScore).toBeGreaterThanOrEqual(60);
      expect(duplicates[0].matchReasons).toContain('Identical or matching phone number');
    });

    it('merges two contacts combining non-conflicting fields safely', () => {
      const a: VCardContact = { id: '1', firstName: 'David', lastName: 'Miller', phone: '+1 555-0101' };
      const b: VCardContact = { id: '2', firstName: 'David', lastName: 'Miller', email: 'david@example.com', organization: 'Acme' };

      const merged = mergeContacts(a, b);
      expect(merged.firstName).toBe('David');
      expect(merged.phone).toBe('+1 555-0101');
      expect(merged.email).toBe('david@example.com');
      expect(merged.organization).toBe('Acme');
    });
  });

  // ==========================================
  // 3. SMS & Messaging Utilities Tests
  // ==========================================
  describe('SMS & Messaging Utilities', () => {
    it('accurately identifies GSM-7 characters vs Unicode UCS-2', () => {
      expect(isGsm7Character('A')).toBe(true);
      expect(isGsm7Character('9')).toBe(true);
      expect(isGsm7Character('@')).toBe(true);
      expect(isGsm7Character('€')).toBe(true); // Extension character
      expect(isGsm7Character('🚀')).toBe(false); // Emoji is non-GSM
      expect(isGsm7Character('“')).toBe(false); // Smart quote is non-GSM
    });

    it('calculates GSM-7 SMS segments with 160/153 limits', () => {
      const shortMsg = 'Hello, this is a standard GSM-7 message.';
      const shortAnalysis = analyzeSms(shortMsg);
      expect(shortAnalysis.encoding).toBe('GSM-7');
      expect(shortAnalysis.segmentCount).toBe(1);
      expect(shortAnalysis.hasNonGsmCharacters).toBe(false);

      const longMsg = 'A'.repeat(161);
      const longAnalysis = analyzeSms(longMsg);
      expect(longAnalysis.segmentCount).toBe(2);
      expect(longAnalysis.maxCharsPerSegment).toBe(153);
    });

    it('detects Unicode characters and reduces segment capacity to 70/67', () => {
      const emojiMsg = 'Hello! Package has arrived 📦';
      const analysis = analyzeSms(emojiMsg);
      expect(analysis.encoding).toBe('UCS-2 (Unicode)');
      expect(analysis.hasNonGsmCharacters).toBe(true);
      expect(analysis.nonGsmCharacters).toContain('📦');
      expect(analysis.maxCharsPerSegment).toBe(70);
    });

    it('sanitizes smart quotes and accents to pure GSM-7', () => {
      const fancyText = '“Hello”—it’s ready…';
      const clean = sanitizeToGsm7(fancyText);
      expect(clean).toBe('"Hello"-it\'s ready...');
    });
  });

  // ==========================================
  // 4. Phone Number Utilities Tests
  // ==========================================
  describe('Phone Number Utilities', () => {
    it('cleans phone number strings preserving leading plus', () => {
      expect(cleanPhoneNumber('+1 (555) 123-4567')).toBe('+15551234567');
      expect(cleanPhoneNumber('07911 123456')).toBe('07911123456');
    });

    it('formats US/Canada numbers to E.164, National, and RFC 3966', () => {
      const res = validateAndFormatPhone('5551234567', 'US');
      expect(res.isValid).toBe(true);
      expect(res.formattedE164).toBe('+15551234567');
      expect(res.formattedNational).toBe('(555) 123-4567');
      expect(res.formattedRfc3966).toBe('tel:+15551234567');
    });

    it('validates Indian 10-digit mobile numbers offline', () => {
      const res = validateAndFormatPhone('+91 98765 43210', 'IN');
      expect(res.isValid).toBe(true);
      expect(res.countryCode).toBe('IN');
      expect(res.possibleType).toBe('mobile');
      expect(res.disclaimer).toContain('Offline Structural Validation');
    });
  });

  // ==========================================
  // 5. Communication IndexedDB Engine Tests
  // ==========================================
  describe('communicationDB IndexedDB Storage Engine', () => {
    it('performs CRUD operations for important contacts', async () => {
      const contact = {
        id: 'test_vip_1',
        fullName: 'Jordan Hayes',
        phone: '+1 555-0199',
        relationship: 'Work',
        isVip: true,
        isEmergency: false,
        createdAt: new Date().toISOString()
      };

      await communicationDB.saveContact(contact);
      let list = await communicationDB.getContacts();
      expect(list.some(c => c.id === 'test_vip_1')).toBe(true);

      await communicationDB.deleteContact('test_vip_1');
      list = await communicationDB.getContacts();
      expect(list.some(c => c.id === 'test_vip_1')).toBe(false);
    });

    it('performs CRUD operations for message drafts', async () => {
      const draft = {
        id: 'test_draft_1',
        title: 'Launch Pitch',
        content: 'Excited to share LifeTools with your team.',
        channel: 'email' as const,
        tags: ['pitch'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await communicationDB.saveDraft(draft);
      let drafts = await communicationDB.getDrafts();
      expect(drafts.some(d => d.id === 'test_draft_1')).toBe(true);

      await communicationDB.deleteDraft('test_draft_1');
      drafts = await communicationDB.getDrafts();
      expect(drafts.some(d => d.id === 'test_draft_1')).toBe(false);
    });

    it('exports all communication entities and aggregates stats', async () => {
      const stats = await communicationDB.getStats();
      expect(typeof stats.totalContacts).toBe('number');
      expect(typeof stats.totalDrafts).toBe('number');
      expect(typeof stats.totalReminders).toBe('number');

      const all = await communicationDB.exportAll();
      expect(Array.isArray(all.contacts)).toBe(true);
      expect(Array.isArray(all.drafts)).toBe(true);
    });
  });

  // ==========================================
  // 6. React UI Components Rendering Tests
  // ==========================================
  describe('React UI Components Rendering', () => {
    it('renders EmailSignatureGenerator with interactive layout controls', () => {
      render(<EmailSignatureGenerator />);
      expect(screen.getByText('Full Name')).toBeDefined();
      expect(screen.getByText('Job Title')).toBeDefined();
      expect(screen.getByText('Copy HTML Signature')).toBeDefined();
    });

    it('renders VCardViewer with file dropzone and paste input', () => {
      render(<VCardViewer />);
      expect(screen.getByText('Upload or Paste .VCF File Content')).toBeDefined();
      expect(screen.getByText('Upload .VCF File')).toBeDefined();
    });

    it('renders WhatsAppMessageFormatter with live preview', () => {
      render(<WhatsAppMessageFormatter />);
      expect(screen.getByText('Recipient Phone Number (with Country Code)')).toBeDefined();
      expect(screen.getByText('Open in WhatsApp Web / App')).toBeDefined();
    });

    it('renders ImportantContactsOrganizer with search bar', () => {
      render(<ImportantContactsOrganizer />);
      expect(screen.getByPlaceholderText('Search important contacts...')).toBeDefined();
      expect(screen.getByText('Add Important Contact')).toBeDefined();
    });
  });
});
