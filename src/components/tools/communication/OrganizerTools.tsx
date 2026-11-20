import React, { useState, useEffect } from 'react';
import {
  Users,
  Star,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Check,
  Calendar,
  Clock,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  RotateCcw,
  Copy,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { communicationDB } from '../../../utils/communicationDB';
import {
  ImportantContact,
  MessageDraft,
  CommunicationReminder,
  CommunicationNote,
  MeetingFollowUp,
  QuickReplyTemplate
} from '../../../types/communication';

// ==========================================
// 1. Important Contacts Organizer
// ==========================================
export const ImportantContactsOrganizer: React.FC = () => {
  const [contacts, setContacts] = useState<ImportantContact[]>([]);
  const [search, setSearch] = useState('');
  const [filterRel, setFilterRel] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rel, setRel] = useState('Family');
  const [isVip, setIsVip] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const list = await communicationDB.getContacts();
    setContacts(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const fresh: ImportantContact = {
      id: `vip_${Date.now()}`,
      fullName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      relationship: rel,
      isVip,
      isEmergency,
      createdAt: new Date().toISOString()
    };

    await communicationDB.saveContact(fresh);
    setName('');
    setPhone('');
    setEmail('');
    setShowAdd(false);
    await loadContacts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this contact?')) {
      await communicationDB.deleteContact(id);
      await loadContacts();
    }
  };

  const filtered = contacts.filter((c) => {
    const matchesSearch = c.fullName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesRel = filterRel === 'All' || c.relationship === filterRel;
    return matchesSearch && matchesRel;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search important contacts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Important Contact
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
              <select
                value={rel}
                onChange={(e) => setRel(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                <option>Family</option>
                <option>Doctor / Medical</option>
                <option>Emergency Services</option>
                <option>Work / Boss</option>
                <option>Key Client</option>
                <option>Friend</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={isVip}
                  onChange={(e) => setIsVip(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>VIP Priority</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span>Emergency Contact</span>
              </label>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            No contacts saved yet. Click "Add Important Contact" above.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  c.isEmergency ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {c.fullName[0] || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{c.fullName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {c.relationship}
                    </span>
                    {c.isEmergency && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        ICE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{c.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. Message Draft Saver
// ==========================================
export const MessageDraftSaver: React.FC = () => {
  const [drafts, setDrafts] = useState<MessageDraft[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'sms' | 'social'>('email');
  const [recipient, setRecipient] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    const list = await communicationDB.getDrafts();
    setDrafts(list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const draft: MessageDraft = {
      id: `draft_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      channel,
      recipient: recipient.trim() || undefined,
      tags: [channel],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await communicationDB.saveDraft(draft);
    setTitle('');
    setContent('');
    setRecipient('');
    await loadDrafts();
  };

  const handleDelete = async (id: string) => {
    await communicationDB.deleteDraft(id);
    await loadDrafts();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Draft Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up on design audit"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient (Optional)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. client@example.com"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Message Content</label>
          <textarea
            rows={3}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
          >
            <Save className="w-3.5 h-3.5" /> Save Message Draft
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Saved Drafts ({drafts.length})
        </span>

        {drafts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            No drafts stored in your local browser vault.
          </div>
        ) : (
          drafts.map((d) => (
            <div
              key={d.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{d.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {d.channel}
                  </span>
                  {d.recipient && <span className="text-xs text-slate-500">to: {d.recipient}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(d.content);
                      setCopiedId(d.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    {copiedId === d.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === d.id ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {d.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. Birthday & Anniversary Reminder
// ==========================================
export const BirthdayAnniversaryReminder: React.FC = () => {
  const [reminders, setReminders] = useState<CommunicationReminder[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'birthday' | 'anniversary'>('birthday');
  const [date, setDate] = useState('2026-12-15');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const list = await communicationDB.getReminders();
    setReminders(list.filter((r) => r.type === 'birthday' || r.type === 'anniversary'));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rem: CommunicationReminder = {
      id: `rem_${Date.now()}`,
      type,
      personName: name.trim(),
      targetDate: date,
      annualRecurring: true,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await communicationDB.saveReminder(rem);
    setName('');
    await loadReminders();
  };

  const handleDelete = async (id: string) => {
    await communicationDB.deleteReminder(id);
    await loadReminders();
  };

  const calculateDaysLeft = (targetStr: string) => {
    const today = new Date();
    const target = new Date(targetStr);
    const thisYear = new Date(today.getFullYear(), target.getMonth(), target.getDate());
    if (thisYear < today) {
      thisYear.setFullYear(today.getFullYear() + 1);
    }
    const diffMs = thisYear.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Person Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Hayes"
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Occasion</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
          >
            <option value="birthday">Birthday 🎂</option>
            <option value="anniversary">Work / Wedding Anniversary 💍</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
        >
          Add Reminder
        </button>
      </form>

      <div className="space-y-2">
        {reminders.map((r) => {
          const days = calculateDaysLeft(r.targetDate);
          return (
            <div
              key={r.id}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{r.type === 'birthday' ? '🎂' : '💍'}</span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm block">{r.personName}</span>
                  <span className="text-xs text-slate-500 capitalize">{r.type} · {r.targetDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${days <= 7 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow!' : `in ${days} days`}
                </span>
                <button onClick={() => handleDelete(r.id)} className="p-1 text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. Follow-up Reminder
// ==========================================
export const FollowUpReminder: React.FC = () => {
  const [reminders, setReminders] = useState<CommunicationReminder[]>([]);
  const [person, setPerson] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    const list = await communicationDB.getReminders();
    setReminders(list.filter((r) => r.type === 'follow_up'));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim()) return;

    const item: CommunicationReminder = {
      id: `fu_${Date.now()}`,
      type: 'follow_up',
      personName: person.trim(),
      targetDate: dueDate,
      annualRecurring: false,
      priority: 'high',
      status: 'pending',
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    await communicationDB.saveReminder(item);
    setPerson('');
    setNotes('');
    await loadList();
  };

  const toggleDone = async (item: CommunicationReminder) => {
    const updated = { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } as CommunicationReminder;
    await communicationDB.saveReminder(updated);
    await loadList();
  };

  const handleDelete = async (id: string) => {
    await communicationDB.deleteReminder(id);
    await loadList();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Contact / Person</label>
            <input
              type="text"
              required
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="e.g. Acme Procurement Team"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Follow-up Target Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Context / Action</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Check on contract signature"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
            Schedule Follow-up
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between p-3.5 rounded-xl border ${
              r.status === 'completed'
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={r.status === 'completed'}
                onChange={() => toggleDone(r)}
                className="rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className={`font-semibold text-sm ${r.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                  {r.personName}
                </span>
                {r.notes && <p className="text-xs text-slate-500">{r.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">{r.targetDate}</span>
              <button onClick={() => handleDelete(r.id)} className="p-1 text-slate-400 hover:text-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. Personal Address Book
// ==========================================
export const PersonalAddressBook: React.FC = () => {
  const [contacts, setContacts] = useState<ImportantContact[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const list = await communicationDB.getContacts();
    setContacts(list);
  };

  const filtered = contacts.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) || (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter address book..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{c.fullName}</h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              {c.phone && <div>📞 {c.phone}</div>}
              {c.email && <div>✉️ {c.email}</div>}
              <div className="text-[11px] text-slate-500">Tag: {c.relationship}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. Communication Notes
// ==========================================
export const CommunicationNotes: React.FC = () => {
  const [notes, setNotes] = useState<CommunicationNote[]>([]);
  const [person, setPerson] = useState('');
  const [type, setType] = useState<'call' | 'meeting' | 'email'>('call');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const list = await communicationDB.getNotes();
    setNotes(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person.trim() || !summary.trim()) return;

    const fresh: CommunicationNote = {
      id: `note_${Date.now()}`,
      personName: person.trim(),
      interactionType: type,
      date: new Date().toISOString().split('T')[0],
      summary: summary.trim(),
      actionItems: [],
      createdAt: new Date().toISOString()
    };

    await communicationDB.saveNote(fresh);
    setPerson('');
    setSummary('');
    await loadNotes();
  };

  const handleDelete = async (id: string) => {
    await communicationDB.deleteNote(id);
    await loadNotes();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Person / Contact</label>
            <input
              type="text"
              required
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="e.g. John from Engineering"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Interaction Channel</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg capitalize"
            >
              <option value="call">Phone Call 📞</option>
              <option value="meeting">Video / In-Person Meeting 🤝</option>
              <option value="email">Email Thread ✉️</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Key Discussion Takeaways</label>
          <textarea
            rows={3}
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Record what was discussed, decisions made, or commitments given..."
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
            Log Note
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {notes.map((n) => (
          <div key={n.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{n.personName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                  {n.interactionType}
                </span>
                <span className="text-xs text-slate-500 font-mono">{n.date}</span>
              </div>
              <button onClick={() => handleDelete(n.id)} className="p-1 text-slate-400 hover:text-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. Meeting Follow-up Tracker
// ==========================================
export const MeetingFollowUpTracker: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingFollowUp[]>([]);
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    const list = await communicationDB.getMeetingFollowUps();
    setMeetings(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const meeting: MeetingFollowUp = {
      id: `m_${Date.now()}`,
      meetingTitle: title.trim(),
      meetingDate: new Date().toISOString().split('T')[0],
      attendees: attendees.trim(),
      discussionSummary: summary.trim(),
      actionItems: [],
      createdAt: new Date().toISOString()
    };

    await communicationDB.saveMeetingFollowUp(meeting);
    setTitle('');
    setAttendees('');
    setSummary('');
    await loadList();
  };

  const handleDelete = async (id: string) => {
    await communicationDB.deleteMeetingFollowUp(id);
    await loadList();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Name / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Strategy Review"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Attendees</label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="e.g. Sarah, Alex, Michael"
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Agreed Decisions &amp; Follow-Up Items</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Record agreed deliverables, timelines, and next meeting target..."
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
            Save Meeting Log
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {meetings.map((m) => (
          <div key={m.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm block">{m.meetingTitle}</span>
                <span className="text-xs text-slate-500">{m.meetingDate} · Attendees: {m.attendees || 'None specified'}</span>
              </div>
              <button onClick={() => handleDelete(m.id)} className="p-1 text-slate-400 hover:text-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {m.discussionSummary && (
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {m.discussionSummary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. Quick Reply Templates
// ==========================================
export const QuickReplyTemplates: React.FC = () => {
  const [replies, setReplies] = useState<QuickReplyTemplate[]>([
    { id: '1', title: 'Thanks & Confirm', category: 'general', content: 'Thank you for the update! Confirming receipt.', tags: ['general'], createdAt: '' },
    { id: '2', title: 'In a Meeting', category: 'general', content: 'Currently in a meeting. Will call you back as soon as I wrap up.', tags: ['general'], createdAt: '' },
    { id: '3', title: 'Send Details', category: 'customer_support', content: 'Could you please provide your order ID so we can investigate immediately?', tags: ['support'], createdAt: '' }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          One-Click Reusable Quick Replies
        </span>

        {replies.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <div>
              <span className="font-semibold text-slate-900 dark:text-white text-sm block">{r.title}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">{r.content}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(r.content);
                setCopiedId(r.id);
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium"
            >
              {copiedId === r.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === r.id ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
