import React, { useState, useRef } from 'react';
import {
  IdCard,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Users,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Building,
  Mail,
  Globe
} from 'lucide-react';
import { VCardContact, ContactDuplicateMatch } from '../../../types/communication';
import {
  generateVCard,
  generateVCardBlob,
  generateMultipleVCards,
  parseVCards,
  vCardsToCsv,
  csvToVCards,
  detectDuplicates,
  mergeContacts
} from '../../../utils/communication/vcardUtils';
import {
  validateAndFormatPhone,
  COUNTRY_PHONE_DATA
} from '../../../utils/communication/phoneUtils';

// ==========================================
// 1. Contact Card Generator (vCard)
// ==========================================
export const ContactCardGenerator: React.FC = () => {
  const [contact, setContact] = useState<VCardContact>({
    id: 'contact_gen',
    firstName: 'Jordan',
    lastName: 'Hayes',
    organization: 'Acme Global',
    jobTitle: 'VP of Engineering',
    mobile: '+1 555-0199',
    phone: '+1 555-0188',
    workPhone: '+1 555-0177',
    email: 'jordan.hayes@example.com',
    workEmail: 'jordan@acme.example.com',
    website: 'https://jordanhayes.example.com',
    street: '123 Innovation Way',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    notes: 'Key point of contact for enterprise platform partnerships.'
  });
  const [copied, setCopied] = useState(false);

  const vcardText = generateVCard(contact);

  const downloadVCard = () => {
    const blob = generateVCardBlob(contact);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contact.firstName || 'contact'}_${contact.lastName || 'card'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
          <input
            type="text"
            value={contact.firstName}
            onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
          <input
            type="text"
            value={contact.lastName}
            onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Organization / Company</label>
          <input
            type="text"
            value={contact.organization || ''}
            onChange={(e) => setContact({ ...contact, organization: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
          <input
            type="text"
            value={contact.jobTitle || ''}
            onChange={(e) => setContact({ ...contact, jobTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Phone</label>
          <input
            type="text"
            value={contact.mobile || ''}
            onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
          <input
            type="text"
            value={contact.website || ''}
            onChange={(e) => setContact({ ...contact, website: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">City, State</label>
          <input
            type="text"
            value={`${contact.city || ''}, ${contact.state || ''}`}
            onChange={(e) => {
              const [c, s] = e.target.value.split(',');
              setContact({ ...contact, city: c?.trim() || '', state: s?.trim() || '' });
            }}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
          <input
            type="text"
            value={contact.country || ''}
            onChange={(e) => setContact({ ...contact, country: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">vCard 3.0 File Output</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(vcardText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy vCard'}
            </button>
            <button
              onClick={downloadVCard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download .VCF
            </button>
          </div>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
          {vcardText}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 2. vCard Viewer
// ==========================================
export const VCardViewer: React.FC = () => {
  const [vcardRaw, setVcardRaw] = useState(
    `BEGIN:VCARD\nVERSION:3.0\nFN:Elena Rostova\nN:Rostova;Elena;;;\nORG:Quantum BioTech\nTITLE:Research Scientist\nTEL;TYPE=CELL:+44 7911 123456\nEMAIL:elena@quantumbio.example.com\nURL:https://quantumbio.example.com\nADR:;;45 Cambridge Science Park;Cambridge;Cambridgeshire;CB4 0FW;United Kingdom\nNOTE:Specialist in client-side genetic algorithmic modeling.\nEND:VCARD`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contacts = parseVCards(vcardRaw);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setVcardRaw(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Upload or Paste .VCF File Content
        </label>
        <div>
          <input
            type="file"
            accept=".vcf,text/vcard"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload .VCF File
          </button>
        </div>
      </div>

      <textarea
        rows={5}
        value={vcardRaw}
        onChange={(e) => setVcardRaw(e.target.value)}
        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        placeholder="Paste BEGIN:VCARD ... END:VCARD text here..."
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Parsed Contact Cards ({contacts.length})
          </span>
        </div>

        {contacts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            No valid vCard records found. Please enter valid vCard markup above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {c.firstName} {c.lastName}
                    </h3>
                    {(c.jobTitle || c.organization) && (
                      <p className="text-xs text-slate-500">
                        {[c.jobTitle, c.organization].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {c.firstName?.[0] || 'C'}
                    {c.lastName?.[0] || ''}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {(c.mobile || c.phone) && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.mobile || c.phone}</span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${c.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {c.email}
                      </a>
                    </div>
                  )}
                  {c.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <a href={c.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {c.website}
                      </a>
                    </div>
                  )}
                  {(c.city || c.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{[c.street, c.city, c.state, c.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {c.notes && (
                    <div className="pt-2 text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-2 rounded">
                      {c.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. vCard Editor
// ==========================================
export const VCardEditor: React.FC = () => {
  const [contacts, setContacts] = useState<VCardContact[]>([
    {
      id: 'edit_1',
      firstName: 'Sarah',
      lastName: 'Connor',
      organization: 'Cyberdyne Systems',
      jobTitle: 'Security Consultant',
      phone: '+1 555-0144',
      email: 'sarah@example.com'
    }
  ]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const current = contacts[selectedIdx] || contacts[0];

  const updateCurrent = (fields: Partial<VCardContact>) => {
    const updated = [...contacts];
    updated[selectedIdx] = { ...current, ...fields };
    setContacts(updated);
  };

  const downloadAll = () => {
    const text = generateMultipleVCards(contacts);
    const blob = new Blob([text], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_edited.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {contacts.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                selectedIdx === i
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {c.firstName || 'Unnamed'} {c.lastName}
            </button>
          ))}
          <button
            onClick={() => {
              const fresh: VCardContact = {
                id: `new_${Date.now()}`,
                firstName: 'New',
                lastName: 'Contact'
              };
              setContacts([...contacts, fresh]);
              setSelectedIdx(contacts.length);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <button
          onClick={downloadAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export All as .VCF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
          <input
            type="text"
            value={current.firstName}
            onChange={(e) => updateCurrent({ firstName: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
          <input
            type="text"
            value={current.lastName}
            onChange={(e) => updateCurrent({ lastName: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Organization</label>
          <input
            type="text"
            value={current.organization || ''}
            onChange={(e) => updateCurrent({ organization: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
          <input
            type="text"
            value={current.jobTitle || ''}
            onChange={(e) => updateCurrent({ jobTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
          <input
            type="text"
            value={current.phone || ''}
            onChange={(e) => updateCurrent({ phone: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={current.email || ''}
            onChange={(e) => updateCurrent({ email: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. vCard to CSV Converter
// ==========================================
export const VCardToCsvConverter: React.FC = () => {
  const [vcardText, setVcardText] = useState(
    `BEGIN:VCARD\nVERSION:3.0\nFN:Alice Smith\nN:Smith;Alice;;;\nORG:Alpha Tech\nTEL:+1 555-1234\nEMAIL:alice@example.com\nEND:VCARD\n\nBEGIN:VCARD\nVERSION:3.0\nFN:Bob Jones\nN:Jones;Bob;;;\nORG:Beta Corp\nTEL:+1 555-5678\nEMAIL:bob@example.com\nEND:VCARD`
  );
  const [copied, setCopied] = useState(false);

  const contacts = parseVCards(vcardText);
  const csvOutput = vCardsToCsv(contacts);

  const downloadCsv = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Paste .VCF Content</label>
        <textarea
          rows={5}
          value={vcardText}
          onChange={(e) => setVcardText(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Converted CSV Spreadsheet ({contacts.length} rows)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(csvOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy CSV'}
            </button>
            <button
              onClick={downloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-60">
          {csvOutput}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 5. CSV to vCard Converter
// ==========================================
export const CsvToVCardConverter: React.FC = () => {
  const [csvText, setCsvText] = useState(
    `"First Name","Last Name","Organization","Job Title","Phone","Email"\n"Carol","Danvers","Avenger Corp","Captain","+1 555-8888","carol@example.com"\n"Bruce","Banner","BioLabs Inc","Lead Scientist","+1 555-9999","bruce@example.com"`
  );
  const [copied, setCopied] = useState(false);

  const contacts = csvToVCards(csvText);
  const vcardOutput = generateMultipleVCards(contacts);

  const downloadVCard = () => {
    const blob = new Blob([vcardOutput], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_contacts.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Paste CSV Spreadsheet Text</label>
        <textarea
          rows={5}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Generated vCard 3.0 Output ({contacts.length} contacts)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(vcardOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy .VCF'}
            </button>
            <button
              onClick={downloadVCard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .VCF
            </button>
          </div>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-60">
          {vcardOutput}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 6. Contact Deduplicator
// ==========================================
export const ContactDeduplicator: React.FC = () => {
  const [contacts, setContacts] = useState<VCardContact[]>([
    { id: '1', firstName: 'David', lastName: 'Miller', phone: '+1 555-0101', email: 'david@example.com', organization: 'Acme' },
    { id: '2', firstName: 'David', lastName: 'Miller', phone: '5550101', email: 'dmiller@work.example.com', organization: 'Acme Corp' },
    { id: '3', firstName: 'Jessica', lastName: 'Lee', phone: '+1 555-0202', email: 'jessica@example.com' }
  ]);

  const duplicates = detectDuplicates(contacts);

  const handleMerge = (match: ContactDuplicateMatch) => {
    const merged = mergeContacts(match.contactA, match.contactB);
    setContacts(contacts.filter((c) => c.id !== match.contactB.id).map((c) => (c.id === match.contactA.id ? merged : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Contact List ({contacts.length} total)</h3>
          <p className="text-xs text-slate-500">Duplicate detection cross-checks normalized phone numbers, emails, and names.</p>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Detected Potential Duplicates ({duplicates.length})
        </span>

        {duplicates.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Zero duplicate contacts detected! Your contact list is clean.
          </div>
        ) : (
          duplicates.map((dup, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {dup.confidenceScore}% Confidence Match
                </span>
                <button
                  onClick={() => handleMerge(dup)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Safe Merge Contacts
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">{dup.contactA.firstName} {dup.contactA.lastName}</div>
                  <div className="text-slate-500">{dup.contactA.phone || 'No phone'}</div>
                  <div className="text-slate-500">{dup.contactA.email || 'No email'}</div>
                  <div className="text-slate-500">{dup.contactA.organization || 'No org'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">{dup.contactB.firstName} {dup.contactB.lastName}</div>
                  <div className="text-slate-500">{dup.contactB.phone || 'No phone'}</div>
                  <div className="text-slate-500">{dup.contactB.email || 'No email'}</div>
                  <div className="text-slate-500">{dup.contactB.organization || 'No org'}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Match reasons: {dup.matchReasons.join(', ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. Contact List Formatter
// ==========================================
export const ContactListFormatter: React.FC = () => {
  const [rawText, setRawText] = useState(
    `john doe - 555-1234 - john@example.com\nSARAH CONNOR, +15559876, sarah@example.com\nbruce wayne; 555 4321; bruce@wayne.com`
  );
  const [copied, setCopied] = useState(false);

  const formatList = () => {
    const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      const parts = line.split(/[,;\-|\t]/).map((p) => p.trim());
      const rawName = parts[0] || '';
      const nameParts = rawName.split(/\s+/).map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase());
      const formattedName = nameParts.join(' ');
      const phone = parts[1] || '';
      const email = parts[2]?.toLowerCase() || '';
      return `${formattedName} | ${phone} | ${email}`;
    });
  };

  const formatted = formatList().join('\n');

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Raw Contact List (One per line, separated by commas, semicolons, or dashes)
        </label>
        <textarea
          rows={5}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cleaned Standardized Table</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(formatted);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy List'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {formatted}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 8. Address Formatter
// ==========================================
export const AddressFormatter: React.FC = () => {
  const [recipient, setRecipient] = useState('Acme Corporation');
  const [street, setStreet] = useState('100 Market St, Suite 400');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94105');
  const [country, setCountry] = useState('United States');
  const [formatStyle, setFormatStyle] = useState<'standard' | 'singleLine' | 'postalUppercase'>('standard');
  const [copied, setCopied] = useState(false);

  const getFormattedAddress = () => {
    if (formatStyle === 'singleLine') {
      return `${recipient}, ${street}, ${city}, ${state} ${zip}, ${country}`;
    }
    if (formatStyle === 'postalUppercase') {
      return `${recipient.toUpperCase()}\n${street.toUpperCase()}\n${city.toUpperCase()} ${state.toUpperCase()} ${zip}\n${country.toUpperCase()}`;
    }
    return `${recipient}\n${street}\n${city}, ${state} ${zip}\n${country}`;
  };

  const output = getFormattedAddress();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient / Attention</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">City / Locality</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">State / Province</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Postal / ZIP Code</label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <label className="font-medium text-slate-700 dark:text-slate-300">Format Convention:</label>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-900">
          {(['standard', 'singleLine', 'postalUppercase'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFormatStyle(s)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                formatStyle === s ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {s === 'standard' ? 'Standard Multi-Line' : s === 'singleLine' ? 'Single Line' : 'Postal Envelope Caps'}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Formatted Mailing Label</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 9. Phone Number Formatter
// ==========================================
export const PhoneNumberFormatter: React.FC = () => {
  const [rawPhone, setRawPhone] = useState('5551234567');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = validateAndFormatPhone(rawPhone, selectedCountry);

  const copyVal = (val?: string, key?: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key || 'val');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number Input</label>
          <input
            type="text"
            value={rawPhone}
            onChange={(e) => setRawPhone(e.target.value)}
            placeholder="e.g. 5551234567 or +44 7911 123456"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Default Country Context</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          >
            {COUNTRY_PHONE_DATA.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard Formatted Representations</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 block mb-0.5">E.164 (International Standard)</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{result.formattedE164 || '—'}</span>
            </div>
            <button onClick={() => copyVal(result.formattedE164, 'e164')} className="p-1 text-slate-500 hover:text-blue-600">
              {copiedKey === 'e164' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 block mb-0.5">National Format</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{result.formattedNational || '—'}</span>
            </div>
            <button onClick={() => copyVal(result.formattedNational, 'nat')} className="p-1 text-slate-500 hover:text-blue-600">
              {copiedKey === 'nat' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 block mb-0.5">Display International</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{result.formattedInternational || '—'}</span>
            </div>
            <button onClick={() => copyVal(result.formattedInternational, 'intl')} className="p-1 text-slate-500 hover:text-blue-600">
              {copiedKey === 'intl' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 block mb-0.5">RFC 3966 URI (HTML tel:)</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{result.formattedRfc3966 || '—'}</span>
            </div>
            <button onClick={() => copyVal(result.formattedRfc3966, 'rfc')} className="p-1 text-slate-500 hover:text-blue-600">
              {copiedKey === 'rfc' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. International Phone Number Validator
// ==========================================
export const InternationalPhoneValidator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [preferredCountry, setPreferredCountry] = useState('IN');

  const result = validateAndFormatPhone(phoneNumber, preferredCountry);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Enter Phone Number with Dial Code</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Fallback Region</label>
          <select
            value={preferredCountry}
            onChange={(e) => setPreferredCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          >
            {COUNTRY_PHONE_DATA.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.isValid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {result.isValid ? 'Valid Format & Length' : 'Invalid Digit Structure'}
          </span>
          <span className="text-xs text-slate-500">
            Detected Country: <strong className="text-slate-800 dark:text-slate-200">{result.countryName} ({result.countryCode})</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Country Code</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{result.countryCode || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">National Digits</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{result.nationalNumber || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block mb-0.5">Likely Line Type</span>
            <span className="font-medium capitalize text-slate-800 dark:text-slate-200">{result.possibleType?.replace('_', ' ') || 'unknown'}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Offline Structure Verification:</span>
          {result.disclaimer}
        </div>
      </div>
    </div>
  );
};
