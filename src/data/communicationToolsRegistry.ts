import { lazy } from 'react';
import { ToolItem } from '../types';

// Lazy load communication tool groups
const EmailSignatureGenerator = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailSignatureGenerator })));
const ProfessionalEmailWriter = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.ProfessionalEmailWriter })));
const EmailSubjectLineGenerator = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailSubjectLineGenerator })));
const EmailTemplateBuilder = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailTemplateBuilder })));
const EmailTextFormatter = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailTextFormatter })));
const EmailAddressSyntaxValidator = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailAddressSyntaxValidator })));
const EmailHeaderAnalyzer = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailHeaderAnalyzer })));
const EmailToHtmlConverter = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailToHtmlConverter })));
const EmailReadabilityChecker = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailReadabilityChecker })));
const EmailDisclaimerGenerator = lazy(() => import('../components/tools/communication/EmailTools').then(m => ({ default: m.EmailDisclaimerGenerator })));

const ContactCardGenerator = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.ContactCardGenerator })));
const VCardViewer = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.VCardViewer })));
const VCardEditor = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.VCardEditor })));
const VCardToCsvConverter = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.VCardToCsvConverter })));
const CsvToVCardConverter = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.CsvToVCardConverter })));
const ContactDeduplicator = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.ContactDeduplicator })));
const ContactListFormatter = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.ContactListFormatter })));
const AddressFormatter = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.AddressFormatter })));
const PhoneNumberFormatter = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.PhoneNumberFormatter })));
const InternationalPhoneValidator = lazy(() => import('../components/tools/communication/ContactTools').then(m => ({ default: m.InternationalPhoneValidator })));

const SocialMediaBioFormatter = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.SocialMediaBioFormatter })));
const InstagramCaptionFormatter = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.InstagramCaptionFormatter })));
const HashtagOrganizer = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.HashtagOrganizer })));
const SocialMediaContentCalendar = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.SocialMediaContentCalendar })));
const CharacterLimitChecker = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.CharacterLimitChecker })));
const YouTubeDescriptionFormatter = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.YouTubeDescriptionFormatter })));
const YouTubeTagsOrganizer = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.YouTubeTagsOrganizer })));
const LinkedInPostFormatter = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.LinkedInPostFormatter })));
const SocialUsernameChecker = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.SocialUsernameChecker })));
const SocialMediaPostPreview = lazy(() => import('../components/tools/communication/SocialMediaTools').then(m => ({ default: m.SocialMediaPostPreview })));

const WhatsAppMessageFormatter = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.WhatsAppMessageFormatter })));
const WhatsAppBroadcastBuilder = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.WhatsAppBroadcastBuilder })));
const SmsCharacterCounter = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.SmsCharacterCounter })));
const SmsSegmentCalculator = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.SmsSegmentCalculator })));
const MessageTemplateLibrary = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.MessageTemplateLibrary })));
const MessageCaseFormatter = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.MessageCaseFormatter })));
const ClickToCallGenerator = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.ClickToCallGenerator })));
const ContactSharingQrGenerator = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.ContactSharingQrGenerator })));
const EmergencyContactCardGenerator = lazy(() => import('../components/tools/communication/MessagingTools').then(m => ({ default: m.EmergencyContactCardGenerator })));

const ImportantContactsOrganizer = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.ImportantContactsOrganizer })));
const MessageDraftSaver = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.MessageDraftSaver })));
const BirthdayAnniversaryReminder = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.BirthdayAnniversaryReminder })));
const FollowUpReminder = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.FollowUpReminder })));
const PersonalAddressBook = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.PersonalAddressBook })));
const CommunicationNotes = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.CommunicationNotes })));
const MeetingFollowUpTracker = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.MeetingFollowUpTracker })));
const QuickReplyTemplates = lazy(() => import('../components/tools/communication/OrganizerTools').then(m => ({ default: m.QuickReplyTemplates })));

export const COMMUNICATION_TOOLS_REGISTRY: ToolItem[] = [
  // --- Section 1: Email Utilities (10) ---
  {
    id: 'email-signature-generator',
    name: 'Email Signature Generator',
    shortDescription: 'Design professional, responsive HTML email signatures with contact details, links, and themes.',
    category: 'communication',
    iconName: 'Mail',
    keywords: ['email signature', 'html signature', 'email footer', 'business signature', 'outlook signature'],
    isPopular: true,
    instructions: ['Enter your name, job title, and company.', 'Add phone, email, and social links.', 'Choose a layout style and copy the HTML signature.'],
    component: EmailSignatureGenerator
  },
  {
    id: 'professional-email-writer',
    name: 'Professional Email Writer',
    shortDescription: 'Compose polished business emails with custom tone selection, key bullet points, and instant copy.',
    category: 'communication',
    iconName: 'FileText',
    keywords: ['email writer', 'business email', 'formal email', 'email generator', 'draft email'],
    isPopular: true,
    instructions: ['Select your preferred tone (formal, assertive, polite, concise, urgent).', 'Specify recipient and core agenda points.', 'Copy the generated professional email draft.'],
    component: ProfessionalEmailWriter
  },
  {
    id: 'email-subject-line-generator',
    name: 'Email Subject Line Generator',
    shortDescription: 'Generate high-open-rate email subject lines across professional, urgent, and newsletter styles.',
    category: 'communication',
    iconName: 'Sparkles',
    keywords: ['subject lines', 'email subjects', 'open rates', 'email marketing', 'catchy titles'],
    instructions: ['Enter the core topic of your email.', 'Select your desired audience tone.', 'Pick and copy the most engaging subject line.'],
    component: EmailSubjectLineGenerator
  },
  {
    id: 'email-template-builder',
    name: 'Email Template Builder',
    shortDescription: 'Build clean, mobile-responsive HTML email templates with headers, body blocks, and call-to-action buttons.',
    category: 'communication',
    iconName: 'LayoutGrid',
    keywords: ['email template', 'newsletter builder', 'html email', 'responsive email', 'cta button'],
    instructions: ['Customize headline, body copy, and button text.', 'Pick your brand accent color.', 'Copy the inline-styled HTML email code.'],
    component: EmailTemplateBuilder
  },
  {
    id: 'email-text-formatter',
    name: 'Email Text Formatter',
    shortDescription: 'Format plain text emails with standard 72-character line wrapping, clean quote marks, and bullet indentation.',
    category: 'communication',
    iconName: 'AlignLeft',
    keywords: ['email text formatter', '72 column wrap', 'clean quotes', 'plain text email', 'strip whitespace'],
    instructions: ['Paste your unformatted email draft.', 'Choose max line width (60, 72, or 80 characters).', 'Copy the cleanly formatted plain text.'],
    component: EmailTextFormatter
  },
  {
    id: 'email-address-syntax-validator',
    name: 'Email Address Syntax Validator',
    shortDescription: 'Validate RFC 5322 email syntax, check domain structures, and catch common domain typos without sending mail.',
    category: 'communication',
    iconName: 'CheckCircle2',
    keywords: ['email syntax validator', 'rfc 5322', 'verify email format', 'domain typo check', 'email validator'],
    instructions: ['Enter any email address to inspect.', 'Review RFC 5322 compliance, local part, domain labels, and typo suggestions.'],
    component: EmailAddressSyntaxValidator
  },
  {
    id: 'email-header-analyzer',
    name: 'Email Header Analyzer',
    shortDescription: 'Parse RFC 822 email headers, inspect transmission hops, calculate delivery delays, and verify SPF/DKIM flags.',
    category: 'communication',
    iconName: 'Search',
    keywords: ['email header analyzer', 'dkim check', 'spf header', 'email hops', 'mail tracer'],
    instructions: ['Paste the raw email header text.', 'Inspect relay hops, server hops route, transmission delay, and security flags.'],
    component: EmailHeaderAnalyzer
  },
  {
    id: 'email-to-html-converter',
    name: 'Email-to-HTML Converter',
    shortDescription: 'Convert plain text and bulleted email messages into clean, universal inline-styled HTML emails.',
    category: 'communication',
    iconName: 'Code',
    keywords: ['email to html', 'text to email html', 'inline css email', 'convert email'],
    instructions: ['Paste your plain text message.', 'View the rendered HTML email output and copy the code.'],
    component: EmailToHtmlConverter
  },
  {
    id: 'email-readability-checker',
    name: 'Email Readability Checker',
    shortDescription: 'Analyze email readability with Flesch-Kincaid Grade Level, reading ease scores, and conciseness suggestions.',
    category: 'communication',
    iconName: 'BookOpen',
    keywords: ['email readability', 'flesch kincaid', 'reading ease', 'word count', 'email concise'],
    instructions: ['Paste your email draft.', 'Check reading ease score, grade level, and review conciseness recommendations.'],
    component: EmailReadabilityChecker
  },
  {
    id: 'email-disclaimer-generator',
    name: 'Email Disclaimer Generator',
    shortDescription: 'Generate customized legal, corporate confidentiality, HIPAA, and financial email disclaimers.',
    category: 'communication',
    iconName: 'Shield',
    keywords: ['email disclaimer', 'confidentiality notice', 'hipaa disclaimer', 'legal email footer'],
    instructions: ['Enter your company name.', 'Select your industry or disclaimer type.', 'Copy the generated legal notice.'],
    component: EmailDisclaimerGenerator
  },

  // --- Section 2: Contact & Address Utilities (10) ---
  {
    id: 'contact-card-generator',
    name: 'Contact Card Generator (vCard)',
    shortDescription: 'Create standard vCard 3.0 (.vcf) contact files with phones, emails, organizations, and instant download.',
    category: 'communication',
    iconName: 'IdCard',
    keywords: ['vcard generator', 'vcf generator', 'contact card', 'address book export', 'create vcard'],
    isPopular: true,
    instructions: ['Fill in contact details (name, phone, email, organization, address).', 'Download the standardized .vcf file for any device.'],
    component: ContactCardGenerator
  },
  {
    id: 'vcard-viewer',
    name: 'vCard Viewer',
    shortDescription: 'Upload or paste .vcf contact files to parse and view structured contact records without uploading to a server.',
    category: 'communication',
    iconName: 'Eye',
    keywords: ['vcard viewer', 'vcf reader', 'open vcard', 'parse vcf', 'view contacts'],
    instructions: ['Upload a .vcf file or paste vCard text.', 'Inspect all extracted contact records, phones, and addresses.'],
    component: VCardViewer
  },
  {
    id: 'vcard-editor',
    name: 'vCard Editor',
    shortDescription: 'Edit contact fields in existing or newly created vCard records and export updated .vcf files.',
    category: 'communication',
    iconName: 'Edit',
    keywords: ['vcard editor', 'edit vcf', 'modify contact', 'update vcard'],
    instructions: ['Select a contact record.', 'Modify names, telephone numbers, emails, or job titles.', 'Export the updated .vcf archive.'],
    component: VCardEditor
  },
  {
    id: 'vcard-to-csv-converter',
    name: 'vCard to CSV Converter',
    shortDescription: 'Convert multi-contact vCard (.vcf) files into RFC 4180 CSV spreadsheets for Excel and Google Contacts.',
    category: 'communication',
    iconName: 'FileSpreadsheet',
    keywords: ['vcard to csv', 'vcf to csv', 'contacts to excel', 'export contacts spreadsheet'],
    instructions: ['Paste your .vcf content.', 'Review the parsed spreadsheet table and download as a CSV file.'],
    component: VCardToCsvConverter
  },
  {
    id: 'csv-to-vcard-converter',
    name: 'CSV to vCard Converter',
    shortDescription: 'Convert CSV spreadsheets of contacts into consolidated, import-ready vCard 3.0 (.vcf) archives.',
    category: 'communication',
    iconName: 'Users',
    keywords: ['csv to vcard', 'csv to vcf', 'import excel contacts to phone', 'batch vcard creator'],
    instructions: ['Paste CSV spreadsheet rows with headers (First Name, Last Name, Phone, Email).', 'Download the generated .vcf file.'],
    component: CsvToVCardConverter
  },
  {
    id: 'contact-deduplicator',
    name: 'Contact Deduplicator',
    shortDescription: 'Detect duplicate contact entries by matching normalized phones, emails, and names with safe merge reviews.',
    category: 'communication',
    iconName: 'Copy',
    keywords: ['contact deduplicator', 'merge duplicate contacts', 'clean contacts', 'dedupe vcards'],
    instructions: ['Review potential duplicate matches with confidence scores.', 'Safely merge non-conflicting contact details with 1-click.'],
    component: ContactDeduplicator
  },
  {
    id: 'contact-list-formatter',
    name: 'Contact List Formatter',
    shortDescription: 'Clean, normalize casing, and format messy contact lists into standardized, tab-separated tables.',
    category: 'communication',
    iconName: 'ListFilter',
    keywords: ['clean contact list', 'normalize contacts', 'format phone list', 'standardize names'],
    instructions: ['Paste raw contact lines separated by commas, dashes, or tabs.', 'Copy the cleaned, standardized contact table.'],
    component: ContactListFormatter
  },
  {
    id: 'address-formatter',
    name: 'Address Formatter',
    shortDescription: 'Standardize physical mailing addresses into standard multi-line, single-line, and postal envelope caps formats.',
    category: 'communication',
    iconName: 'MapPin',
    keywords: ['address formatter', 'mailing label', 'postal address', 'format address', 'standard address'],
    instructions: ['Enter recipient, street, city, state, zip, and country.', 'Choose standard multi-line, single-line, or postal caps convention.'],
    component: AddressFormatter
  },
  {
    id: 'phone-number-formatter',
    name: 'Phone Number Formatter',
    shortDescription: 'Format telephone numbers into E.164, National, International, and RFC 3966 HTML tel: link representations.',
    category: 'communication',
    iconName: 'Phone',
    keywords: ['phone formatter', 'e.164 phone', 'international phone format', 'tel uri', 'format mobile'],
    instructions: ['Enter any telephone number.', 'Copy in E.164, National, International, or RFC 3966 tel: format.'],
    component: PhoneNumberFormatter
  },
  {
    id: 'international-phone-validator',
    name: 'International Phone Number Validator',
    shortDescription: 'Verify international dial codes, valid digit lengths, and line types using an offline country database.',
    category: 'communication',
    iconName: 'Globe',
    keywords: ['phone validator', 'international phone check', 'validate mobile number', 'offline phone check'],
    instructions: ['Enter an international phone number with country code.', 'Inspect digit structure, national number, and likely line type.'],
    component: InternationalPhoneValidator
  },

  // --- Section 3: Social Media Utilities (10) ---
  {
    id: 'social-media-bio-formatter',
    name: 'Social Media Bio Formatter',
    shortDescription: 'Format bios for Instagram, Twitter/X, TikTok, and LinkedIn with character counters and spacing guides.',
    category: 'communication',
    iconName: 'Share2',
    keywords: ['social bio formatter', 'instagram bio', 'twitter bio', 'tiktok bio', 'bio character limit'],
    instructions: ['Select your target social platform.', 'Compose your bio and ensure it stays within platform limits.', 'Copy to clipboard.'],
    component: SocialMediaBioFormatter
  },
  {
    id: 'instagram-caption-formatter',
    name: 'Instagram Caption Formatter',
    shortDescription: 'Format Instagram captions with clean line breaks, anti-collapsing spacing, and live hashtag counters.',
    category: 'communication',
    iconName: 'Sparkles',
    keywords: ['instagram caption', 'ig caption spacer', 'clean line breaks instagram', 'hashtag counter'],
    instructions: ['Type your Instagram caption.', 'Click "Fix Clean Line Breaks" to prevent text collapsing.', 'Copy formatted caption.'],
    component: InstagramCaptionFormatter
  },
  {
    id: 'hashtag-organizer',
    name: 'Hashtag Organizer',
    shortDescription: 'Organize, deduplicate, and clean hashtag sets with lowercase normalization and 1-click copying.',
    category: 'communication',
    iconName: 'Hash',
    keywords: ['hashtag organizer', 'clean hashtags', 'deduplicate hashtags', 'instagram tags'],
    instructions: ['Paste raw keywords or hashtags.', 'View cleaned unique tags and copy all with one click.'],
    component: HashtagOrganizer
  },
  {
    id: 'social-media-content-calendar',
    name: 'Social Media Content Calendar',
    shortDescription: 'Interactive offline content calendar to schedule, plan, and organize social media posts by platform.',
    category: 'communication',
    iconName: 'Calendar',
    keywords: ['content calendar', 'social media planner', 'post scheduler', 'social queue'],
    instructions: ['Add scheduled post topics with dates and platforms.', 'Manage your local social content pipeline.'],
    component: SocialMediaContentCalendar
  },
  {
    id: 'character-limit-checker',
    name: 'Character Limit Checker',
    shortDescription: 'Check text character count against verified limits for X/Twitter, Threads, Instagram, LinkedIn, and YouTube.',
    category: 'communication',
    iconName: 'CheckCircle2',
    keywords: ['character limit checker', 'twitter 280', 'linkedin post limit', 'instagram 2200'],
    instructions: ['Type or paste any text.', 'Review progress bars and remaining character limits across all major social networks.'],
    component: CharacterLimitChecker
  },
  {
    id: 'youtube-description-formatter',
    name: 'YouTube Description Formatter',
    shortDescription: 'Format structured YouTube descriptions with video overviews, chapter timestamps, links, and tags.',
    category: 'communication',
    iconName: 'FileText',
    keywords: ['youtube description formatter', 'video chapters', 'youtube timestamps', 'video description builder'],
    instructions: ['Add summary, chapter timestamps (00:00 - Title), and resource links.', 'Copy the structured description.'],
    component: YouTubeDescriptionFormatter
  },
  {
    id: 'youtube-tags-organizer',
    name: 'YouTube Tags Organizer',
    shortDescription: 'Format and deduplicate YouTube video keyword tags up to the verified 500-character limit.',
    category: 'communication',
    iconName: 'Tag',
    keywords: ['youtube tags organizer', 'video tags', '500 char tags', 'comma separated tags'],
    instructions: ['Paste raw tags or keywords.', 'Copy the cleaned, deduplicated comma-separated tag string.'],
    component: YouTubeTagsOrganizer
  },
  {
    id: 'linkedin-post-formatter',
    name: 'LinkedIn Post Formatter',
    shortDescription: 'Format high-engagement LinkedIn posts with 140-char hook cutoff preview, bullet formatting, and CTA.',
    category: 'communication',
    iconName: 'Share2',
    keywords: ['linkedin post formatter', 'linkedin hook', 'linkedin preview', 'see more cutoff'],
    instructions: ['Write your hook (kept under 140 chars for "see more" preview), body, and CTA.', 'Copy the full formatted post.'],
    component: LinkedInPostFormatter
  },
  {
    id: 'social-username-checker',
    name: 'Social Media Username Availability Checklist',
    shortDescription: 'Check username character syntax rules and get direct verification links across 15+ major platforms.',
    category: 'communication',
    iconName: 'Users',
    keywords: ['social username checker', 'username availability', 'handle checker', 'check username rules'],
    instructions: ['Enter desired username or handle.', 'Review platform character rules and click direct links to verify profile status.'],
    component: SocialUsernameChecker
  },
  {
    id: 'social-media-post-preview',
    name: 'Social Media Post Preview',
    shortDescription: 'Simulate how your post will look across X/Twitter, LinkedIn, and Instagram before publishing.',
    category: 'communication',
    iconName: 'Eye',
    keywords: ['social post preview', 'twitter post simulator', 'linkedin post preview', 'instagram preview'],
    instructions: ['Enter author name, username, and post content.', 'Switch preview layouts to see desktop and mobile card appearances.'],
    component: SocialMediaPostPreview
  },

  // --- Section 4: Messaging Utilities (9) ---
  {
    id: 'whatsapp-message-formatter',
    name: 'WhatsApp Message Formatter',
    shortDescription: 'Format WhatsApp messages with bold, italics, strikethrough, monospace, and preview in a chat bubble.',
    category: 'communication',
    iconName: 'MessageSquare',
    keywords: ['whatsapp message formatter', 'whatsapp markdown', 'bold text whatsapp', 'chat bubble preview'],
    isPopular: true,
    instructions: ['Type message with WhatsApp markdown (*bold*, _italic_, ~strike~, ```code```).', 'Preview in chat bubble or open directly in WhatsApp.'],
    component: WhatsAppMessageFormatter
  },
  {
    id: 'whatsapp-broadcast-builder',
    name: 'WhatsApp Broadcast Text Builder',
    shortDescription: 'Create personalized broadcast templates with variables ({name}, {company}, {order_id}) and live preview.',
    category: 'communication',
    iconName: 'Sparkles',
    keywords: ['whatsapp broadcast builder', 'message template variables', 'bulk message builder'],
    instructions: ['Write your message template using {name}, {company}, {order_id} tags.', 'Test with sample values and copy the merged output.'],
    component: WhatsAppBroadcastBuilder
  },
  {
    id: 'sms-character-counter',
    name: 'SMS Character Counter',
    shortDescription: 'Count SMS characters in real-time with automatic GSM-7 vs UCS-2 Unicode detection and remaining segment counts.',
    category: 'communication',
    iconName: 'MessageSquare',
    keywords: ['sms character counter', 'gsm-7 counter', 'sms encoding checker', 'remaining characters sms'],
    instructions: ['Type your SMS message.', 'Check total characters, encoding standard, and remaining characters in the current segment.'],
    component: SmsCharacterCounter
  },
  {
    id: 'sms-segment-calculator',
    name: 'SMS Segment Calculator',
    shortDescription: 'Calculate exact SMS segments (160/153 for GSM-7; 70/67 for Unicode), billing multipliers, and convert emojis.',
    category: 'communication',
    iconName: 'Calculator',
    keywords: ['sms segment calculator', 'sms billing multiplier', 'convert emojis to gsm', 'udh header'],
    instructions: ['Enter SMS copy to calculate segment splits.', 'Review alerts if non-GSM characters reduce segment limits from 160 to 70.'],
    component: SmsSegmentCalculator
  },
  {
    id: 'message-template-library',
    name: 'Message Template Library',
    shortDescription: 'Ready-to-use professional messaging templates for customer support, appointments, sales, and confirmations.',
    category: 'communication',
    iconName: 'BookOpen',
    keywords: ['message template library', 'canned responses', 'customer service templates', 'sms templates'],
    instructions: ['Filter by category (Support, Appointment, Sales, Apology).', 'Copy any template with a single click.'],
    component: MessageTemplateLibrary
  },
  {
    id: 'message-case-formatter',
    name: 'Message Case Formatter',
    shortDescription: 'Convert messages between Sentence case, Title Case, UPPERCASE, lowercase, and Alternating case.',
    category: 'communication',
    iconName: 'Type',
    keywords: ['message case formatter', 'sentence case', 'title case', 'alternating case'],
    instructions: ['Type or paste your message text.', 'Copy in Sentence case, Title Case, UPPERCASE, lowercase, or Alternating case.'],
    component: MessageCaseFormatter
  },
  {
    id: 'click-to-call-generator',
    name: 'Click-to-Call Link Generator',
    shortDescription: 'Generate clean RFC 3966 tel: links and HTML anchor buttons for direct mobile phone dialing.',
    category: 'communication',
    iconName: 'Phone',
    keywords: ['click to call link', 'tel link generator', 'call button html', 'phone link'],
    instructions: ['Enter phone number with international country prefix.', 'Copy direct tel: link or HTML <a> tag.'],
    component: ClickToCallGenerator
  },
  {
    id: 'contact-sharing-qr-generator',
    name: 'Contact Sharing QR Generator',
    shortDescription: 'Generate downloadable vCard contact QR codes for instant smartphone camera scanning and address book saving.',
    category: 'communication',
    iconName: 'QrCode',
    keywords: ['contact sharing qr', 'vcard qr code', 'business card qr', 'download contact qr'],
    instructions: ['Enter contact details.', 'Scan with any phone camera or download the PNG image.'],
    component: ContactSharingQrGenerator
  },
  {
    id: 'emergency-contact-card-generator',
    name: 'Emergency Contact Card Generator',
    shortDescription: 'Create printable wallet-sized In Case of Emergency (ICE) cards with blood type, allergies, and contacts.',
    category: 'communication',
    iconName: 'ShieldAlert',
    keywords: ['emergency contact card', 'ice card printable', 'medical emergency card', 'wallet ice card'],
    instructions: ['Enter cardholder details, blood type, allergies, and emergency phone numbers.', 'Click Print to produce a wallet-sized card.'],
    component: EmergencyContactCardGenerator
  },

  // --- Section 5: Personal Communication Organizer (8) ---
  {
    id: 'important-contacts-organizer',
    name: 'Important Contacts Organizer',
    shortDescription: 'Private local address directory with VIP stars, relationship tags, emergency ICE markers, and instant search.',
    category: 'communication',
    iconName: 'Users',
    keywords: ['important contacts', 'vip contacts', 'emergency contacts list', 'private address book'],
    isPopular: true,
    instructions: ['Add important contacts with phone, email, and tags.', 'Search and filter instantly; stored 100% locally in IndexedDB.'],
    component: ImportantContactsOrganizer
  },
  {
    id: 'message-draft-saver',
    name: 'Message Draft Saver',
    shortDescription: 'Private client-side repository to save, organize, and copy draft messages for emails, SMS, and chats.',
    category: 'communication',
    iconName: 'Save',
    keywords: ['message draft saver', 'save email drafts', 'draft organizer', 'offline drafts'],
    instructions: ['Write and categorize message drafts by channel.', 'Search and copy saved messages anytime.'],
    component: MessageDraftSaver
  },
  {
    id: 'birthday-anniversary-reminder',
    name: 'Birthday & Anniversary Reminder',
    shortDescription: 'Track birthdays and anniversaries with days-remaining countdowns and yearly recurring reminders.',
    category: 'communication',
    iconName: 'Calendar',
    keywords: ['birthday reminder', 'anniversary countdown', 'milestone reminder', 'days left birthday'],
    instructions: ['Enter person name, occasion, and date.', 'Track exact days remaining until the upcoming milestone.'],
    component: BirthdayAnniversaryReminder
  },
  {
    id: 'follow-up-reminder',
    name: 'Follow-up Reminder',
    shortDescription: 'Track pending personal and business follow-ups with target deadlines, priority flags, and completion states.',
    category: 'communication',
    iconName: 'Clock',
    keywords: ['follow up reminder', 'task reminder', 'communication follow up', 'client check in'],
    instructions: ['Schedule follow-up tasks with contact name and target date.', 'Mark completed when finished.'],
    component: FollowUpReminder
  },
  {
    id: 'personal-address-book',
    name: 'Personal Address Book',
    shortDescription: 'Searchable local address book to manage names, phone numbers, email addresses, and relationship notes.',
    category: 'communication',
    iconName: 'BookOpen',
    keywords: ['personal address book', 'private contact directory', 'local address book'],
    instructions: ['Browse and search through your private contact records stored in browser IndexedDB.'],
    component: PersonalAddressBook
  },
  {
    id: 'communication-notes',
    name: 'Communication Notes',
    shortDescription: 'Log call summaries, meeting takeaways, and discussion commitments associated with specific people.',
    category: 'communication',
    iconName: 'FileText',
    keywords: ['communication notes', 'call log', 'meeting summary', 'interaction notes'],
    instructions: ['Record person name, channel (Call, Meeting, Email), and key takeaways.', 'Browse historical interaction notes.'],
    component: CommunicationNotes
  },
  {
    id: 'meeting-follow-up-tracker',
    name: 'Meeting Follow-up Tracker',
    shortDescription: 'Log meeting attendee lists, agreed deliverables, and generate structured follow-up summaries.',
    category: 'communication',
    iconName: 'CheckCircle2',
    keywords: ['meeting follow up tracker', 'action items tracker', 'meeting minutes follow up'],
    instructions: ['Record meeting title, date, attendees, and agreed action items.', 'Save and reference for project updates.'],
    component: MeetingFollowUpTracker
  },
  {
    id: 'quick-reply-templates',
    name: 'Quick Reply Templates',
    shortDescription: 'Curate custom reusable quick replies for customer support, messages, and emails with 1-click copy.',
    category: 'communication',
    iconName: 'Sparkles',
    keywords: ['quick reply templates', 'canned responses', 'saved replies', 'copy quick reply'],
    instructions: ['Browse reusable quick replies.', 'Click Copy to immediately paste into your email or messaging client.'],
    component: QuickReplyTemplates
  }
];
