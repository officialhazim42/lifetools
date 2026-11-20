/**
 * Types & Domain Models for Communication & Social Utilities
 */

export interface VCardContact {
  id: string;
  firstName: string;
  lastName: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  mobile?: string;
  workPhone?: string;
  email?: string;
  workEmail?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  avatarUrl?: string;
}

export interface EmailSyntaxResult {
  email: string;
  isValid: boolean;
  userPart: string;
  domainPart: string;
  tld: string;
  issues: string[];
  suggestions?: string;
  isRoleBased: boolean;
  isFreeProvider: boolean;
}

export interface EmailHeaderHop {
  hopNumber: number;
  fromServer: string;
  byServer: string;
  timestamp?: string;
  protocol?: string;
  delaySeconds?: number;
}

export interface EmailHeaderAnalysis {
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  messageId?: string;
  replyTo?: string;
  returnPath?: string;
  spf?: string;
  dkim?: string;
  dmarc?: string;
  mailer?: string;
  hops: EmailHeaderHop[];
  totalHops: number;
  totalDelaySeconds: number;
  securityFlags: {
    spfPass: boolean | null;
    dkimPass: boolean | null;
    dmarcPass: boolean | null;
  };
}

export interface EmailReadabilityMetrics {
  characterCount: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  syllableCount: number;
  complexWordsCount: number;
  readingEaseScore: number;
  readingEaseLevel: string;
  gradeLevel: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  suggestions: string[];
}

export interface SmsEncodingAnalysis {
  text: string;
  characterCount: number;
  encoding: 'GSM-7' | 'UCS-2 (Unicode)';
  segmentCount: number;
  maxCharsPerSegment: number;
  charsRemainingInSegment: number;
  hasNonGsmCharacters: boolean;
  nonGsmCharacters: string[];
  estimatedCostMultiplier: number;
}

export interface PhoneValidationResult {
  rawInput: string;
  isValid: boolean;
  countryCode?: string;
  countryName?: string;
  nationalNumber?: string;
  formattedE164?: string;
  formattedInternational?: string;
  formattedNational?: string;
  formattedRfc3966?: string;
  possibleType?: 'mobile' | 'fixed_line' | 'toll_free' | 'unknown';
  disclaimer: string;
}

export interface ContactDuplicateMatch {
  contactA: VCardContact;
  contactB: VCardContact;
  confidenceScore: number; // 0-100
  matchReasons: string[];
}

export interface ImportantContact {
  id: string;
  fullName: string;
  relationship: string; // Family, Work, Medical, Emergency, Friend, Client
  phone: string;
  email?: string;
  isVip: boolean;
  isEmergency: boolean;
  notes?: string;
  createdAt: string;
}

export interface MessageDraft {
  id: string;
  title: string;
  content: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'social' | 'other';
  recipient?: string;
  tags: string[];
  updatedAt: string;
  createdAt: string;
}

export interface CommunicationReminder {
  id: string;
  type: 'birthday' | 'anniversary' | 'follow_up';
  personName: string;
  targetDate: string; // YYYY-MM-DD
  annualRecurring: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'dismissed';
  notes?: string;
  createdAt: string;
}

export interface CommunicationNote {
  id: string;
  personName: string;
  interactionType: 'call' | 'meeting' | 'email' | 'in_person';
  date: string;
  summary: string;
  actionItems: string[];
  createdAt: string;
}

export interface MeetingFollowUp {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  attendees: string;
  discussionSummary: string;
  actionItems: { id: string; task: string; owner: string; done: boolean }[];
  draftFollowUpEmail?: string;
  createdAt: string;
}

export interface QuickReplyTemplate {
  id: string;
  title: string;
  category: 'general' | 'customer_support' | 'sales' | 'appointment' | 'apology' | 'social';
  content: string;
  shortcut?: string;
  tags: string[];
  createdAt: string;
}
