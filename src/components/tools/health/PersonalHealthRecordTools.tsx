import React, { useState, useEffect } from 'react';
import { healthDB } from '../../../utils/healthDB';
import {
  classifyBloodPressure,
  classifyBloodSugar
} from '../../../utils/health/sleepUtils';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  FileText,
  Heart,
  Activity,
  Calendar,
  Pill,
  Trash2,
  Plus,
  AlertCircle,
  Copy,
  Printer,
  ShieldCheck,
  Scale
} from 'lucide-react';
import {
  HealthJournalEntry,
  MedicationSchedule,
  AppointmentReminder,
  MedicalReport,
  BloodPressureLog,
  BloodSugarLog,
  WeightLog,
  BodyMeasurements,
  HealthNote,
  EmergencyMedicalCardData
} from '../../../types/health';

// Privacy Banner for sensitive medical data
const PrivacyBanner = () => (
  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
    <p>
      <strong>100% Client-Side Privacy:</strong> All personal health records, blood pressure logs, and medication entries are saved exclusively in your browser's private IndexedDB storage. No health information is ever uploaded to external servers.
    </p>
  </div>
);

// ==========================================
// 1. Personal Health Journal
// ==========================================
export const PersonalHealthJournal: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<HealthJournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    healthDB.getJournalEntries().then(setEntries);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: HealthJournalEntry = {
      id: 'hj_' + Date.now(),
      date,
      title: title.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };
    await healthDB.saveJournalEntry(item);
    setEntries(await healthDB.getJournalEntries());
    setTitle('');
    setNotes('');
    showToast('Journal entry saved locally', 'success');
  };

  const handleDelete = async (id: string) => {
    await healthDB.deleteJournalEntry(id);
    setEntries(await healthDB.getJournalEntries());
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleSave} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-slate-500 block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-500 block mb-1 font-medium">Journal Headline / Topic</label>
            <input
              type="text"
              placeholder="e.g. Energy levels after dietary change..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-500 block mb-1 font-medium">Notes & Symptoms</label>
          <textarea
            rows={3}
            placeholder="Describe what you experienced..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none resize-none"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
          Save Health Journal Entry
        </button>
      </form>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No health journal entries recorded yet.</p>
        ) : (
          entries.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.title}</span>
                <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">{item.date}</span>
              <p className="text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">{item.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. Medication Reminder
// ==========================================
export const MedicationReminder: React.FC = () => {
  const { showToast } = useToast();
  const [meds, setMeds] = useState<MedicationSchedule[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [instructions, setInstructions] = useState('After breakfast');

  useEffect(() => {
    healthDB.getMedications().then(setMeds);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const entry: MedicationSchedule = {
      id: 'med_' + Date.now(),
      name: name.trim(),
      dosage: dosage.trim() || 'Standard',
      frequency,
      instructions,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveMedication(entry);
    setMeds(await healthDB.getMedications());
    setName('');
    setDosage('');
    showToast('Medication logged in local schedule', 'success');
  };

  const handleDelete = async (id: string) => {
    await healthDB.deleteMedication(id);
    setMeds(await healthDB.getMedications());
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-slate-500 block mb-1">Medication Name</label>
          <input
            type="text"
            placeholder="e.g. Vitamin D3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Dosage</label>
          <input
            type="text"
            placeholder="e.g. 1000 IU or 10 mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Frequency</label>
          <input
            type="text"
            placeholder="e.g. Once daily"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
            Add Medication
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {meds.map((m) => (
          <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <Pill className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{m.name}</span>
                <span className="text-slate-400 block text-[11px]">{m.dosage} • {m.frequency} • {m.instructions}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        * Disclaimer: This tracker is a personal organization tool. It does not provide medical dosage advice, pharmacokinetic warnings, drug interaction checks, or professional supervision. Always follow the explicit instructions on your prescription label.
      </div>
    </div>
  );
};

// ==========================================
// 3. Appointment Reminder
// ==========================================
export const AppointmentReminderTool: React.FC = () => {
  const { showToast } = useToast();
  const [appts, setAppts] = useState<AppointmentReminder[]>([]);
  const [provider, setProvider] = useState('');
  const [specialty, setSpecialty] = useState('Dental');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');

  useEffect(() => {
    healthDB.getAppointments().then(setAppts);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider.trim()) return;
    const entry: AppointmentReminder = {
      id: 'apt_' + Date.now(),
      providerName: provider.trim(),
      specialty,
      appointmentDate: date,
      appointmentTime: time,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    await healthDB.saveAppointment(entry);
    setAppts(await healthDB.getAppointments());
    setProvider('');
    showToast('Appointment saved', 'success');
  };

  const handleDelete = async (id: string) => {
    await healthDB.deleteAppointment(id);
    setAppts(await healthDB.getAppointments());
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-slate-500 block mb-1">Doctor / Clinic</label>
          <input
            type="text"
            placeholder="e.g. Dr. Emily Stone"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Specialty</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Date & Time</label>
          <div className="flex gap-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-24 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
            Add Appointment
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {appts.map((a) => (
          <div key={a.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-100">{a.providerName}</span>
              <span className="text-slate-400 block text-[11px]">{a.specialty} • {a.appointmentDate} at {a.appointmentTime}</span>
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-slate-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. Medical Report Organizer
// ==========================================
export const MedicalReportOrganizer: React.FC = () => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MedicalReport['category']>('blood');
  const [findings, setFindings] = useState('');

  useEffect(() => {
    healthDB.getReports().then(setReports);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const rep: MedicalReport = {
      id: 'rep_' + Date.now(),
      title: title.trim(),
      reportDate: new Date().toISOString().split('T')[0],
      category,
      keyFindings: findings.trim(),
      createdAt: new Date().toISOString()
    };
    await healthDB.saveReport(rep);
    setReports(await healthDB.getReports());
    setTitle('');
    setFindings('');
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleAdd} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-500 block mb-1">Report Title / Test Name</label>
            <input
              type="text"
              placeholder="e.g. Complete Blood Count (CBC)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold"
            />
          </div>
          <div>
            <label className="text-slate-500 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            >
              <option value="blood">Blood Test / Lipid Panel</option>
              <option value="radiology">Radiology (X-Ray, MRI, CT, Ultrasound)</option>
              <option value="cardiac">Cardiology (ECG, Echo, Stress Test)</option>
              <option value="dental">Dental Exam</option>
              <option value="vision">Vision / Optometry</option>
              <option value="general">General Checkup</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Key Findings / Values</label>
          <textarea
            rows={2}
            placeholder="e.g. Total cholesterol: 185 mg/dL (Normal). Vitamin D: 32 ng/mL."
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none resize-none"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">
          Log Medical Report
        </button>
      </form>

      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span>{r.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase">{r.category}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">{r.keyFindings}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. Blood Pressure Log
// ==========================================
export const BloodPressureLogTool: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<BloodPressureLog[]>([]);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [pulse, setPulse] = useState(72);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    healthDB.getBpLogs().then(setLogs);
  }, []);

  const classification = classifyBloodPressure(systolic, diastolic);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry: BloodPressureLog = {
      id: 'bp_' + Date.now(),
      date,
      time: new Date().toTimeString().slice(0, 5),
      systolic,
      diastolic,
      pulse,
      category: classification.category,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveBpLog(entry);
    setLogs(await healthDB.getBpLogs());
    showToast('Blood pressure measurement recorded', 'success');
  };

  const handleDelete = async (id: string) => {
    await healthDB.deleteBpLog(id);
    setLogs(await healthDB.getBpLogs());
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Systolic (mmHg)</label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold text-base"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Diastolic (mmHg)</label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold text-base"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Pulse (bpm)</label>
          <input
            type="number"
            value={pulse}
            onChange={(e) => setPulse(parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
            Record Measurement
          </button>
        </div>
      </form>

      <div className={`p-4 rounded-xl border text-xs ${classification.color}`}>
        <div className="font-bold text-sm">Category: {classification.category}</div>
        <p className="mt-1">{classification.advice}</p>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Logged History</span>
        {logs.slice(0, 5).map((l) => (
          <div key={l.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-extrabold text-base text-slate-800 dark:text-slate-100">{l.systolic}/{l.diastolic}</span>
              <span className="text-slate-400 text-xs ml-2">mmHg ({l.pulse} bpm)</span>
              <span className="text-slate-400 block text-[11px]">{l.date} • {l.category}</span>
            </div>
            <button onClick={() => handleDelete(l.id)} className="text-slate-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. Blood Sugar Log
// ==========================================
export const BloodSugarLogTool: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<BloodSugarLog[]>([]);
  const [level, setLevel] = useState(95);
  const [timing, setTiming] = useState<BloodSugarLog['timing']>('fasting');
  const [unit, setUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');

  useEffect(() => {
    healthDB.getSugarLogs().then(setLogs);
  }, []);

  const classification = classifyBloodSugar(level, unit, timing);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry: BloodSugarLog = {
      id: 'bs_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      level,
      unit,
      timing,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveSugarLog(entry);
    setLogs(await healthDB.getSugarLogs());
    showToast('Blood sugar entry saved', 'success');
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Blood Glucose Level</label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          >
            <option value="mg/dL">mg/dL (US Standard)</option>
            <option value="mmol/L">mmol/L (International)</option>
          </select>
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Reading Timing</label>
          <select
            value={timing}
            onChange={(e) => setTiming(e.target.value as any)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          >
            <option value="fasting">Fasting (Morning before food)</option>
            <option value="pre_meal">Pre-Meal (Before lunch/dinner)</option>
            <option value="post_meal_2h">Post-Meal (2h after food)</option>
            <option value="bedtime">Bedtime</option>
            <option value="random">Random / As Needed</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
            Record Glucose
          </button>
        </div>
      </form>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
        <span className={`font-bold ${classification.color}`}>{classification.status}</span>
        <p className="text-slate-500 mt-0.5">{classification.notes}</p>
      </div>

      <div className="space-y-2">
        {logs.slice(0, 5).map((l) => (
          <div key={l.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-100">{l.level} {l.unit}</span>
              <span className="text-slate-400 block text-[11px]">{l.date} • {l.timing}</span>
            </div>
            <button onClick={() => healthDB.deleteSugarLog(l.id).then(() => healthDB.getSugarLogs().then(setLogs))} className="text-slate-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. Weight History Tracker
// ==========================================
export const WeightHistoryTracker: React.FC = () => {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [weight, setWeight] = useState(72.5);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  useEffect(() => {
    healthDB.getWeightLogs().then(setLogs);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry: WeightLog = {
      id: 'wt_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight,
      unit,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveWeightLog(entry);
    setLogs(await healthDB.getWeightLogs());
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleSave} className="flex gap-2 text-xs">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          className="w-32 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as any)}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
        >
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">
          Log Weight
        </button>
      </form>

      <div className="space-y-2">
        {logs.slice(0, 5).map((w) => (
          <div key={w.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100">{w.weight} {w.unit}</span>
            <span className="text-slate-400">{w.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. Body Measurements Tracker
// ==========================================
export const BodyMeasurementsTracker: React.FC = () => {
  const [chest, setChest] = useState(98);
  const [waist, setWaist] = useState(82);
  const [hips, setHips] = useState(96);

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Chest (cm)</label>
          <input
            type="number"
            value={chest}
            onChange={(e) => setChest(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Waist (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Hips (cm)</label>
          <input
            type="number"
            value={hips}
            onChange={(e) => setHips(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Health Notes
// ==========================================
export const HealthNotesTool: React.FC = () => {
  const [notes, setNotes] = useState<HealthNote[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    healthDB.getHealthNotes().then(setNotes);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: HealthNote = {
      id: 'hn_' + Date.now(),
      title: title.trim(),
      category: 'general',
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    await healthDB.saveHealthNote(item);
    setNotes(await healthDB.getHealthNotes());
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <form onSubmit={handleAdd} className="space-y-2 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          placeholder="Note title (e.g. Questions for Cardiologist)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold"
        />
        <textarea
          rows={3}
          placeholder="Note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none resize-none"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">
          Save Note
        </button>
      </form>

      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100">{n.title}</span>
            <p className="text-slate-600 dark:text-slate-300 mt-1">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. Emergency Medical Information Card
// ==========================================
export const EmergencyMedicalCardTool: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<EmergencyMedicalCardData>({
    fullName: 'Alex Morgan',
    dateOfBirth: '1992-06-15',
    bloodType: 'O Positive',
    primaryEmergencyContact: {
      name: 'Sarah Morgan',
      relationship: 'Spouse',
      phone: '+1 555-0199'
    },
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Asthma (Mild)'],
    currentMedications: ['Albuterol inhaler PRN'],
    organDonor: true,
    physicianName: 'Dr. Robert Vance',
    physicianPhone: '+1 555-0144',
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    healthDB.getEmergencyCard().then((card) => {
      if (card) setData(card);
    });
  }, []);

  const handleSave = async () => {
    await healthDB.saveEmergencyCard(data);
    showToast('Emergency Medical Card saved locally', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PrivacyBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Full Name</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Blood Type</label>
          <input
            type="text"
            value={data.bloodType}
            onChange={(e) => setData({ ...data, bloodType: e.target.value })}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Emergency Contact Phone</label>
          <input
            type="text"
            value={data.primaryEmergencyContact.phone}
            onChange={(e) =>
              setData({
                ...data,
                primaryEmergencyContact: { ...data.primaryEmergencyContact, phone: e.target.value }
              })
            }
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Printable Wallet Card Preview */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-red-950/20 dark:to-slate-900 border-2 border-red-300 dark:border-red-900/60 max-w-md mx-auto shadow-sm space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-red-200 dark:border-red-900/40 pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <span className="font-black text-sm tracking-wide text-red-900 dark:text-red-300 uppercase">Emergency Medical ID</span>
          </div>
          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">ICE CARD</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-100">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Patient Name</span>
            <span className="font-extrabold text-sm">{data.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Blood Type</span>
            <span className="font-extrabold text-sm text-red-600 dark:text-red-400">{data.bloodType}</span>
          </div>
        </div>

        <div className="border-t border-red-100 dark:border-red-950 pt-2 space-y-1">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Emergency Contact</span>
          <p className="font-semibold">{data.primaryEmergencyContact.name} ({data.primaryEmergencyContact.relationship}): {data.primaryEmergencyContact.phone}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-red-100 dark:border-red-950 pt-2 text-[11px]">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Allergies</span>
            <span>{data.allergies.join(', ') || 'None noted'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Conditions</span>
            <span>{data.chronicConditions.join(', ') || 'None noted'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-colors"
        >
          Save Emergency Card
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print Wallet Card
        </button>
      </div>
    </div>
  );
};
