import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Download,
  Printer,
  Shield,
  Hotel,
  Plane,
  DollarSign,
  BookOpen,
  MapPin,
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { travelDB } from '../../../utils/travelDB';
import {
  TravelDocumentRecord,
  HotelBookingRecord,
  FlightRecord,
  TravelExpenseRecord,
  TravelJournalEntry,
  EmergencyTravelCardData,
  TripPlan
} from '../../../types/travel';

// ==========================================
// 1. TRAVEL DOCUMENT ORGANIZER
// ==========================================
export const TravelDocumentOrganizer: React.FC = () => {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<TravelDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<TravelDocumentRecord['documentType']>('passport');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [holderName, setHolderName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await travelDB.getDocuments();
      setDocs(data);
    } catch {
      showToast('Could not load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !holderName.trim()) {
      showToast('Title and holder name are required', 'warning');
      return;
    }

    const newDoc: TravelDocumentRecord = {
      id: `doc_${Date.now()}`,
      title: title.trim(),
      documentType,
      documentNumber: documentNumber.trim(),
      issuingCountry: issuingCountry.trim(),
      expiryDate,
      holderName: holderName.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await travelDB.saveDocument(newDoc);
    showToast('Document saved securely in browser database', 'success');
    setShowAdd(false);
    setTitle('');
    setDocumentNumber('');
    setIssuingCountry('');
    setExpiryDate('');
    setHolderName('');
    setNotes('');
    loadDocs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document record?')) return;
    await travelDB.deleteDocument(id);
    showToast('Document deleted', 'info');
    loadDocs();
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return { text: 'No Expiry', color: 'text-slate-500' };
    const today = new Date().getTime();
    const exp = new Date(expiryDate).getTime();
    const diffDays = Math.round((exp - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'EXPIRED', color: 'text-red-600 bg-red-100 dark:bg-red-950/60' };
    if (diffDays <= 180) return { text: `< 6 Mo (${diffDays}d)`, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60' };
    return { text: `Valid (${diffDays}d)`, color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🛂</span> Travel Document Organizer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Store passports, visas, licenses, and insurance reference numbers securely on your device.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Add New Document Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Document Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Primary Passport"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="passport">Passport</option>
                <option value="visa">Visa / ETA</option>
                <option value="id_card">National ID</option>
                <option value="driver_license">Driver's License / IDP</option>
                <option value="insurance">Travel Insurance Policy</option>
                <option value="ticket">Ticket / Boarding Pass</option>
                <option value="other">Other Document</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Holder Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Legal Name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Document / Policy #
              </label>
              <input
                type="text"
                placeholder="Optional ID / number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Issuing Country
              </label>
              <input
                type="text"
                placeholder="e.g. USA / UK / Germany"
                value={issuingCountry}
                onChange={(e) => setIssuingCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes</label>
              <input
                type="text"
                placeholder="Renewal notes, emergency contacts..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Record
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading documents...</div>
      ) : docs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-3xl mb-2">📑</p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">No documents stored</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store your passport, visa numbers, and insurance policy contacts for quick offline reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => {
            const status = getExpiryStatus(doc.expiryDate);
            return (
              <div
                key={doc.id}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{doc.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {doc.documentType.replace('_', ' ')} • {doc.holderName}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {doc.documentNumber && (
                    <p>
                      <span className="text-slate-400">Doc #:</span>{' '}
                      <span className="font-mono font-semibold">{doc.documentNumber}</span>
                    </p>
                  )}
                  {doc.issuingCountry && (
                    <p>
                      <span className="text-slate-400">Country:</span> {doc.issuingCountry}
                    </p>
                  )}
                  {doc.expiryDate && (
                    <p>
                      <span className="text-slate-400">Expires:</span> {doc.expiryDate}
                    </p>
                  )}
                  {doc.notes && <p className="text-slate-500 italic mt-1 text-[11px]">{doc.notes}</p>}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. PASSPORT EXPIRY REMINDER
// ==========================================
export const PassportExpiryReminder: React.FC = () => {
  const [expiryDate, setExpiryDate] = useState<string>('2027-08-15');
  const [tripDate, setTripDate] = useState<string>('2026-10-01');

  const expTime = new Date(expiryDate).getTime();
  const tripTime = new Date(tripDate).getTime();
  const today = new Date().getTime();

  const diffMonthsFromTrip = (expTime - tripTime) / (1000 * 60 * 60 * 24 * 30.4375);
  const diffDaysFromToday = Math.round((expTime - today) / (1000 * 60 * 60 * 24));

  const passesSixMonthRule = diffMonthsFromTrip >= 6;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🛂</span> Passport Expiry Reminder & 6-Month Rule
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Verify if your passport meets international 6-month validity requirements prior to boarding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Passport Expiry Date
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Planned Travel Return Date
          </label>
          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div
        className={`p-6 rounded-2xl border flex items-start gap-4 ${
          passesSixMonthRule
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
        }`}
      >
        {passesSixMonthRule ? (
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h3
            className={`font-bold text-sm ${
              passesSixMonthRule ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'
            }`}
          >
            {passesSixMonthRule
              ? 'Meets 6-Month Validity Requirement'
              : 'CRITICAL: Passport Fails 6-Month International Rule!'}
          </h3>
          <p
            className={`text-xs leading-relaxed ${
              passesSixMonthRule ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'
            }`}
          >
            Your passport has{' '}
            <strong>{diffMonthsFromTrip.toFixed(1)} months</strong> of validity remaining past your return date ({diffDaysFromToday} days from today).{' '}
            {!passesSixMonthRule &&
              'Most international airlines and immigration officers will deny boarding if passport has under 6 months validity.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. VISA EXPIRY REMINDER
// ==========================================
export const VisaExpiryReminder: React.FC = () => {
  const [country, setCountry] = useState('Schengen Area (EU)');
  const [visaType, setVisaType] = useState('Type C Tourist (Multiple Entry)');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [maxStayDays, setMaxStayDays] = useState(90);

  const daysLeft = Math.max(
    0,
    Math.round((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🛂</span> Visa Expiry & Stay Limit Tracker
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor visa validity periods and maximum permitted duration of stay.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Country / Region
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Visa Type</label>
          <input
            type="text"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Valid Until</label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Max Stay Days per Entry
          </label>
          <input
            type="number"
            value={maxStayDays}
            onChange={(e) => setMaxStayDays(parseInt(e.target.value) || 30)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">Days Until Visa Expiry</span>
          <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{daysLeft} days</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">Max Permitted Stay</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {maxStayDays} days
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. TRAVEL INSURANCE CHECKLIST
// ==========================================
export const TravelInsuranceChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', title: 'Emergency Medical Expenses', coverage: 'At least $100,000 USD coverage', verified: true },
    { id: '2', title: 'Emergency Medical Evacuation & Repatriation', coverage: 'At least $250,000 USD coverage', verified: true },
    { id: '3', title: 'Trip Cancellation & Curtailment', coverage: 'Covers non-refundable flights & hotels', verified: false },
    { id: '4', title: 'Baggage Loss, Theft & Damage', coverage: 'Includes personal electronics & passports', verified: false },
    { id: '5', title: 'Travel Delay & Missed Connection', coverage: 'Covers meals & accommodation past 6h delay', verified: false },
    { id: '6', title: 'Rental Car Collision Damage Waiver (CDW)', coverage: 'Zero excess collision coverage', verified: false },
    { id: '7', title: '24/7 International Emergency Assistance Hotline', coverage: 'Phone number stored in phone contacts', verified: true }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, verified: !i.verified } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🛡️</span> Travel Insurance Policy Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Audit critical policy clauses to protect against medical emergencies and unforeseen trip disruptions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <input
              type="checkbox"
              checked={item.verified}
              onChange={() => toggle(item.id)}
              className="mt-1 rounded text-indigo-600"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.coverage}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. EMERGENCY TRAVEL CARD
// ==========================================
export const EmergencyTravelCard: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<EmergencyTravelCardData>({
    travelerName: 'Alex Johnson',
    passportNumber: 'US89218491',
    nationality: 'United States',
    bloodType: 'O+',
    allergies: 'Penicillin (Severe), Peanuts',
    homeCountryEmergencyPhone: '+1 555-0199 (Family Contact)',
    destinationEmbassyAddress: '12 Boulevard de la Tour-Maubourg, 75007 Paris',
    destinationEmbassyPhone: '+33 1 43 12 22 22',
    localEmergencyNumber: '112 (European Universal Emergency)',
    updatedAt: new Date().toISOString()
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const saved = await travelDB.getEmergencyCard();
    if (saved) setData(saved);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await travelDB.saveEmergencyCard(data);
    showToast('Emergency card updated', 'success');
    setEditing(false);
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🚨</span> Emergency Travel Card
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pocket-sized physical and digital emergency medical summary for medical responders abroad.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl"
          >
            {editing ? 'Close Form' : 'Edit Details'}
          </button>
          <button
            onClick={printCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print Card
          </button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Traveler Name</label>
              <input
                type="text"
                value={data.travelerName}
                onChange={(e) => setData({ ...data, travelerName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Blood Type</label>
              <input
                type="text"
                value={data.bloodType}
                onChange={(e) => setData({ ...data, bloodType: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Allergies / Critical Conditions</label>
              <input
                type="text"
                value={data.allergies}
                onChange={(e) => setData({ ...data, allergies: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Home Emergency Contact</label>
              <input
                type="text"
                value={data.homeCountryEmergencyPhone}
                onChange={(e) => setData({ ...data, homeCountryEmergencyPhone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Embassy Hotline</label>
              <input
                type="text"
                value={data.destinationEmbassyPhone}
                onChange={(e) => setData({ ...data, destinationEmbassyPhone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Local Emergency Police/Ambulance</label>
              <input
                type="text"
                value={data.localEmergencyNumber}
                onChange={(e) => setData({ ...data, localEmergencyNumber: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Save Emergency Info
          </button>
        </form>
      )}

      {/* Printable Card */}
      <div className="max-w-md mx-auto p-6 bg-red-50 dark:bg-slate-800 rounded-3xl border-2 border-red-300 dark:border-red-900/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-red-200 dark:border-red-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚑</span>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-red-700 dark:text-red-400">
                Emergency Medical Card
              </h3>
              <p className="text-[10px] text-slate-500">In Case of Emergency (ICE)</p>
            </div>
          </div>
          <span className="text-lg font-black font-mono text-red-600 dark:text-red-400 px-2 py-0.5 bg-red-100 dark:bg-red-950/80 rounded-lg">
            {data.bloodType || 'N/A'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Traveler Name</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{data.travelerName}</p>
          </div>

          <div className="p-2.5 bg-red-100/60 dark:bg-red-950/40 rounded-xl">
            <span className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold">
              Critical Allergies / Conditions
            </span>
            <p className="font-bold text-red-800 dark:text-red-200 mt-0.5">{data.allergies || 'None Reported'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Home Emergency Contact</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{data.homeCountryEmergencyPhone}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Local Emergency #</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{data.localEmergencyNumber}</p>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Consular / Embassy Hotline</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{data.destinationEmbassyPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. HOTEL BOOKING ORGANIZER
// ==========================================
export const HotelBookingOrganizer: React.FC = () => {
  const { showToast } = useToast();
  const [hotels, setHotels] = useState<HotelBookingRecord[]>([]);
  const [hotelName, setHotelName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [roomType, setRoomType] = useState('Standard Queen');
  const [totalCost, setTotalCost] = useState(350);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    const data = await travelDB.getHotelBookings();
    setHotels(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName.trim() || !city.trim() || !checkInDate || !checkOutDate) {
      showToast('Please fill in hotel, city and dates', 'warning');
      return;
    }

    const item: HotelBookingRecord = {
      id: `hotel_${Date.now()}`,
      hotelName: hotelName.trim(),
      city: city.trim(),
      address: address.trim(),
      checkInDate,
      checkOutDate,
      confirmationNumber: confirmationNumber.trim(),
      roomType,
      totalCost,
      createdAt: new Date().toISOString()
    };

    await travelDB.saveHotelBooking(item);
    showToast('Hotel booking recorded', 'success');
    setHotelName('');
    setCity('');
    setAddress('');
    setConfirmationNumber('');
    loadHotels();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deleteHotelBooking(id);
    loadHotels();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🏨</span> Hotel Booking Organizer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Store lodging reservations, check-in windows, confirmation codes, and addresses.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Add Lodging Booking</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Hotel / Property Name *</label>
            <input
              type="text"
              required
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Confirmation #</label>
            <input
              type="text"
              value={confirmationNumber}
              onChange={(e) => setConfirmationNumber(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Check-In Date *</label>
            <input
              type="date"
              required
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Check-Out Date *</label>
            <input
              type="date"
              required
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Room Type</label>
            <input
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Total Cost ($)</label>
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
        >
          Save Booking
        </button>
      </form>

      <div className="space-y-3">
        {hotels.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{h.hotelName}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {h.city} • {h.checkInDate} to {h.checkOutDate} ({h.roomType})
              </p>
              {h.confirmationNumber && (
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Conf: {h.confirmationNumber}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {h.totalCost ? (
                <span className="text-xs font-mono font-bold text-emerald-600">${h.totalCost}</span>
              ) : null}
              <button
                onClick={() => handleDelete(h.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. FLIGHT INFORMATION ORGANIZER
// ==========================================
export const FlightInformationOrganizer: React.FC = () => {
  const { showToast } = useToast();
  const [flights, setFlights] = useState<FlightRecord[]>([]);
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    const data = await travelDB.getFlightRecords();
    setFlights(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!airline.trim() || !flightNumber.trim() || !departureAirport.trim() || !arrivalAirport.trim()) {
      showToast('Please fill in flight number and airports', 'warning');
      return;
    }

    const item: FlightRecord = {
      id: `flight_${Date.now()}`,
      airline: airline.trim(),
      flightNumber: flightNumber.trim(),
      departureAirport: departureAirport.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.trim().toUpperCase(),
      departureTime: departureTime || new Date().toISOString(),
      arrivalTime: '',
      seatNumber: seatNumber.trim(),
      bookingReference: bookingRef.trim(),
      createdAt: new Date().toISOString()
    };

    await travelDB.saveFlightRecord(item);
    showToast('Flight recorded', 'success');
    setFlightNumber('');
    setSeatNumber('');
    setBookingRef('');
    loadFlights();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deleteFlightRecord(id);
    loadFlights();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>✈️</span> Flight Information Organizer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Store airline flights, terminals, seats, and 6-character PNR booking codes offline.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Airline</label>
            <input
              type="text"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              placeholder="e.g. Delta Air Lines"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Flight Number</label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="e.g. DL 128"
              className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">From Airport</label>
            <input
              type="text"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              placeholder="e.g. JFK"
              className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">To Airport</label>
            <input
              type="text"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
              placeholder="e.g. LHR"
              className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Seat Number</label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              placeholder="e.g. 21A"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Booking PNR / Confirmation</label>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g. KLM892"
              className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
        >
          Add Flight
        </button>
      </form>

      <div className="space-y-3">
        {flights.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">✈️</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {f.airline} ({f.flightNumber})
                </h4>
                <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                  {f.departureAirport} ➔ {f.arrivalAirport}
                </p>
                <span className="text-[11px] text-slate-400">
                  Seat: {f.seatNumber || 'Unassigned'} • PNR: {f.bookingReference || 'N/A'}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(f.id)}
              className="text-slate-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. TRAVEL EXPENSE LOG
// ==========================================
export const TravelExpenseLog: React.FC = () => {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<TravelExpenseRecord[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(25);
  const [category, setCategory] = useState<TravelExpenseRecord['category']>('food');
  const [currency, setCurrency] = useState('USD');
  const [paidBy, setPaidBy] = useState('Alex');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const list = await travelDB.getTravelExpenses();
    setExpenses(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const item: TravelExpenseRecord = {
      id: `exp_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      description: desc.trim(),
      amount: Math.max(0, amount),
      currency,
      category,
      paidBy: paidBy.trim(),
      createdAt: new Date().toISOString()
    };

    await travelDB.saveTravelExpense(item);
    showToast('Expense logged', 'success');
    setDesc('');
    loadExpenses();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deleteTravelExpense(id);
    loadExpenses();
  };

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>💵</span> Travel Expense Log
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log itemized trip expenses, food receipts, and transportation fares.
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/60 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
          <span className="text-[10px] text-indigo-500 block uppercase font-bold">Total Spent</span>
          <p className="text-lg font-bold font-mono text-indigo-900 dark:text-indigo-200">${total.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="Expense description (e.g. Gelato & Coffee)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        >
          <option value="food">🍽️ Food</option>
          <option value="transport">🚆 Transit</option>
          <option value="lodging">🏨 Lodging</option>
          <option value="activities">🎟️ Activities</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="emergency">🚨 Emergency</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
          >
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{exp.description}</span>
              <p className="text-[10px] text-slate-400 capitalize">
                {exp.category} • Paid by {exp.paidBy} • {exp.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                ${exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => handleDelete(exp.id)}
                className="text-slate-400 hover:text-red-500"
              >
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
// 9. TRAVEL JOURNAL
// ==========================================
export const TravelJournal: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<TravelJournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [body, setBody] = useState('');
  const [weather, setWeather] = useState<TravelJournalEntry['weather']>('sunny');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    const list = await travelDB.getJournalEntries();
    setEntries(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('Title and journal entry text are required', 'warning');
      return;
    }

    const item: TravelJournalEntry = {
      id: `jour_${Date.now()}`,
      title: title.trim(),
      cityOrPlace: city.trim() || 'Travel Spot',
      date: new Date().toISOString().slice(0, 10),
      body: body.trim(),
      weather,
      rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await travelDB.saveJournalEntry(item);
    showToast('Journal entry saved', 'success');
    setTitle('');
    setCity('');
    setBody('');
    loadJournal();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deleteJournalEntry(id);
    loadJournal();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📖</span> Travel Journal & Memories
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture day-by-day travel thoughts, weather, highlights, and personal reflections.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Entry Title</label>
            <input
              type="text"
              placeholder="e.g. Sunset over the Amalfi Coast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">City or Place</label>
            <input
              type="text"
              placeholder="e.g. Positano, Italy"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-500 block mb-1">Journal Entry</label>
          <textarea
            rows={3}
            placeholder="Today we explored..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Weather:</span>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value as any)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            >
              <option value="sunny">☀️ Sunny</option>
              <option value="cloudy">⛅ Cloudy</option>
              <option value="rainy">🌧️ Rainy</option>
              <option value="snowy">❄️ Snowy</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
          >
            Save Entry
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{entry.title}</h4>
                <p className="text-xs text-slate-400">
                  {entry.cityOrPlace} • {entry.date} • {entry.weather === 'sunny' ? '☀️' : '🌧️'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {entry.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. TRIP SUMMARY GENERATOR
// ==========================================
export const TripSummaryGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [tripTitle, setTripTitle] = useState('');
  const [destinations, setDestinations] = useState('');
  const [daysCount, setDaysCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topHighlights, setTopHighlights] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const generateReport = () => {
    return `# TRIP SUMMARY DEBRIEF: ${tripTitle}
==================================================
• Destinations: ${destinations}
• Total Duration: ${daysCount} Days
• Total Financial Expenditure: $${totalSpent.toLocaleString()}
• Cost per Day: $${Math.round(totalSpent / (daysCount || 1))}/day

[ KEY HIGHLIGHTS ]
${topHighlights.split(',').map((h) => `• ${h.trim()}`).join('\n')}

[ LESSONS & TRAVEL TIPS ]
• ${lessonsLearned}

Generated privately on client-side LifeTools Platform.
`;
  };

  const copySummary = () => {
    navigator.clipboard.writeText(generateReport());
    showToast('Trip debrief copied', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📊</span> Trip Summary & Debrief Generator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Synthesize key trip stats, budget tally, lessons learned, and memorable highlights.
          </p>
        </div>
        <button
          onClick={copySummary}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Debrief
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Trip Name</label>
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="e.g. European Summer Adventure"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Destinations Visited</label>
            <input
              type="text"
              value={destinations}
              onChange={(e) => setDestinations(e.target.value)}
              placeholder="e.g. London, Paris, Rome"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Total Days</label>
            <input
              type="number"
              value={daysCount || ''}
              onChange={(e) => setDaysCount(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Total Expenses ($)</label>
            <input
              type="number"
              value={totalSpent || ''}
              onChange={(e) => setTotalSpent(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-500 block mb-1">Highlights (comma separated)</label>
          <input
            type="text"
            value={topHighlights}
            onChange={(e) => setTopHighlights(e.target.value)}
            placeholder="e.g. Louvre tour, Colosseum underground, Sunset cruise"
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-500 block mb-1">Lessons Learned & Tips</label>
          <input
            type="text"
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="p-5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-sm">
        {generateReport()}
      </div>
    </div>
  );
};
