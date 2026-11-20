import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  Copy,
  Download,
  DollarSign,
  Users,
  Car,
  Plane,
  Train,
  Ship,
  Sun,
  Shield,
  Briefcase,
  Luggage,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { travelDB } from '../../../utils/travelDB';
import { TripPlan, ItineraryActivity } from '../../../types/travel';

// ==========================================
// 1. TRIP PLANNER
// ==========================================
export const TripPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripPlan | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);
  const [estimatedBudget, setEstimatedBudget] = useState(1000);
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState<TripPlan['status']>('planning');
  const [notes, setNotes] = useState('');
  const [coverEmoji, setCoverEmoji] = useState('✈️');

  const emojis = ['✈️', '🏖️', '🏔️', '🚗', '🚢', '🚂', '🏕️', '🏙️', '🗺️', '🌴'];

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await travelDB.getTrips();
      setTrips(data);
    } catch {
      showToast('Could not load trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim() || !startDate || !endDate) {
      showToast('Please fill in title, destination, and dates', 'warning');
      return;
    }

    const trip: TripPlan = {
      id: editingTrip ? editingTrip.id : `trip_${Date.now()}`,
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travelersCount: Math.max(1, travelersCount),
      estimatedBudget: Math.max(0, estimatedBudget),
      currency,
      status,
      notes: notes.trim(),
      coverEmoji,
      createdAt: editingTrip ? editingTrip.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await travelDB.saveTrip(trip);
      showToast(editingTrip ? 'Trip updated' : 'Trip created', 'success');
      setShowModal(false);
      resetForm();
      loadTrips();
    } catch {
      showToast('Failed to save trip', 'error');
    }
  };

  const handleDelete = async (id: string, tripTitle: string) => {
    if (!window.confirm(`Delete "${tripTitle}"? All attached records will remain in database.`)) return;
    try {
      await travelDB.deleteTrip(id);
      showToast('Trip deleted', 'info');
      loadTrips();
    } catch {
      showToast('Failed to delete trip', 'error');
    }
  };

  const resetForm = () => {
    setEditingTrip(null);
    setTitle('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setTravelersCount(1);
    setEstimatedBudget(1000);
    setCurrency('USD');
    setStatus('planning');
    setNotes('');
    setCoverEmoji('✈️');
  };

  const openEdit = (trip: TripPlan) => {
    setEditingTrip(trip);
    setTitle(trip.title);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTravelersCount(trip.travelersCount);
    setEstimatedBudget(trip.estimatedBudget);
    setCurrency(trip.currency);
    setStatus(trip.status);
    setNotes(trip.notes || '');
    setCoverEmoji(trip.coverEmoji || '✈️');
    setShowModal(true);
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const calculateCountdown = (start: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = new Date(start).setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Starts today!';
    if (diff > 0) return `${diff} days away`;
    return `${Math.abs(diff)} days ago`;
  };

  const filteredTrips = trips.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>✈️</span> Trip Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, manage, and coordinate your multi-day journeys with offline client-side storage.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Trip
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-sm">
        {['all', 'planning', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium capitalize whitespace-nowrap transition ${
              filter === tab
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading trips from local database...</div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="font-semibold text-slate-700 dark:text-slate-300">No trips found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {filter === 'all'
              ? 'Start planning your next adventure! Add destination, dates, and budget.'
              : `No trips currently marked as "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => {
            const days = calculateDays(trip.startDate, trip.endDate);
            const countdown = calculateCountdown(trip.startDate);
            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{trip.coverEmoji || '✈️'}</span>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{trip.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500" /> {trip.destination}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        trip.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : trip.status === 'ongoing'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 animate-pulse'
                          : trip.status === 'upcoming'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" /> Dates:
                      </span>
                      <span className="font-medium">
                        {trip.startDate} to {trip.endDate} ({days} {days === 1 ? 'day' : 'days'})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" /> Travelers:
                      </span>
                      <span className="font-medium">{trip.travelersCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5" /> Budget:
                      </span>
                      <span className="font-medium font-mono">
                        {trip.currency} {trip.estimatedBudget.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="text-slate-400">Timeline:</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{countdown}</span>
                    </div>
                  </div>

                  {trip.notes && (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg">
                      {trip.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(trip)}
                    className="text-xs px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id, trip.title)}
                    className="text-xs px-2.5 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editingTrip ? 'Edit Trip' : 'Create New Trip'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Trip Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer in Tokyo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo & Kyoto, Japan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'INR', 'SGD'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Est. Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TripPlan['status'])}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Icon</label>
                  <div className="flex items-center gap-1">
                    {emojis.slice(0, 5).map((e) => (
                      <button
                        type="button"
                        key={e}
                        onClick={() => setCoverEmoji(e)}
                        className={`text-lg p-1 rounded-lg ${
                          coverEmoji === e
                            ? 'bg-indigo-100 dark:bg-indigo-950 ring-2 ring-indigo-500'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Trip Notes & Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Important reminders, passport checks, booking links..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
                >
                  {editingTrip ? 'Save Changes' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. TRAVEL ITINERARY BUILDER
// ==========================================
export const TravelItineraryBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<ItineraryActivity[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ItineraryActivity['category']>('sightseeing');
  const [cost, setCost] = useState<number>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const list = await travelDB.getItineraries();
    setActivities(list);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Activity title is required', 'warning');
      return;
    }

    const item: ItineraryActivity = {
      id: `act_${Date.now()}`,
      dayNumber: selectedDay,
      startTime: time,
      title: title.trim(),
      location: location.trim(),
      category,
      cost: cost > 0 ? cost : undefined,
      notes: notes.trim(),
      isCompleted: false
    };

    await travelDB.saveItinerary(item);
    showToast('Activity added to itinerary', 'success');
    setTitle('');
    setLocation('');
    setNotes('');
    setCost(0);
    loadActivities();
  };

  const toggleComplete = async (item: ItineraryActivity) => {
    const updated = { ...item, isCompleted: !item.isCompleted };
    await travelDB.saveItinerary(updated);
    loadActivities();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deleteItinerary(id);
    showToast('Activity removed', 'info');
    loadActivities();
  };

  const filtered = activities
    .filter((a) => a.dayNumber === selectedDay)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const exportText = () => {
    let out = `TRAVEL ITINERARY (Day ${selectedDay})\n===============================\n`;
    filtered.forEach((a) => {
      out += `• ${a.startTime || '--:--'} - ${a.title} [${a.category.toUpperCase()}]\n`;
      if (a.location) out += `  Location: ${a.location}\n`;
      if (a.cost) out += `  Cost: $${a.cost}\n`;
      if (a.notes) out += `  Notes: ${a.notes}\n`;
      out += `\n`;
    });
    navigator.clipboard.writeText(out);
    showToast('Itinerary copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📅</span> Travel Itinerary Builder
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Structure your days with detailed time blocks, activities, sightseeing, and meal stops.
          </p>
        </div>
        <button
          onClick={exportText}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition disabled:opacity-50"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Day Schedule
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedDay === d
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Creation Form */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-500" /> Add Day {selectedDay} Activity
          </h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                placeholder="e.g. Visit Louvre Museum"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItineraryActivity['category'])}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sightseeing">🏛️ Sightseeing</option>
                  <option value="food">🍽️ Food & Dining</option>
                  <option value="transit">🚆 Transit</option>
                  <option value="flight">✈️ Flight</option>
                  <option value="hotel">🏨 Hotel</option>
                  <option value="activity">🏄 Activity</option>
                  <option value="other">📍 Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Rue de Rivoli"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Est. Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Notes</label>
              <textarea
                rows={2}
                placeholder="Tickets booked, dress code, confirmation code..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-sm mt-2"
            >
              Add Activity
            </button>
          </form>
        </div>

        {/* Activities List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-3xl mb-2">🏖️</p>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Day {selectedDay} is empty</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add places you want to visit, cafes to stop by, or transit times.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-3 p-4 rounded-xl border transition ${
                  item.isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(item)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition"
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        item.isCompleted ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''
                      }`}
                    />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        {item.startTime || 'Flexible'}
                      </span>
                      <h4
                        className={`text-sm font-bold text-slate-800 dark:text-slate-100 ${
                          item.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {item.location && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-red-500" /> {item.location}
                      </p>
                    )}

                    {item.notes && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{item.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.cost ? (
                    <span className="text-xs font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg">
                      ${item.cost}
                    </span>
                  ) : null}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. DAILY TRAVEL SCHEDULE
// ==========================================
export const DailyTravelSchedule: React.FC = () => {
  const { showToast } = useToast();
  const [scheduleDate, setScheduleDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<
    { id: string; time: string; activity: string; bufferMinutes: number; notes: string }[]
  >([
    { id: '1', time: '08:00', activity: 'Breakfast at hotel cafe', bufferMinutes: 15, notes: 'Pack day pack' },
    { id: '2', time: '09:30', activity: 'Metro to Historic District', bufferMinutes: 20, notes: 'Buy day pass' },
    { id: '3', time: '10:30', activity: 'Guided Walking Tour', bufferMinutes: 30, notes: 'Comfortable walking shoes' },
    { id: '13:00', time: '13:00', activity: 'Lunch at Local Bistro', bufferMinutes: 15, notes: 'Try house specialty' },
    { id: '5', time: '15:00', activity: 'Museum Entry (Tickets reserved)', bufferMinutes: 30, notes: 'No large bags' },
    { id: '6', time: '18:30', activity: 'Sunset Viewpoint & Dinner', bufferMinutes: 20, notes: 'Camera battery full' }
  ]);

  const [newTime, setNewTime] = useState('12:00');
  const [newActivity, setNewActivity] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const addSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    const item = {
      id: `slot_${Date.now()}`,
      time: newTime,
      activity: newActivity.trim(),
      bufferMinutes: 15,
      notes: newNotes.trim()
    };
    setSlots([...slots, item].sort((a, b) => a.time.localeCompare(b.time)));
    setNewActivity('');
    setNewNotes('');
    showToast('Schedule slot added', 'success');
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>⏰</span> Daily Travel Schedule
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hour-by-hour structured day timetable with buffer warnings to avoid missed reservations.
          </p>
        </div>
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">Add Time Block</h3>
          <form onSubmit={addSlot} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Activity</label>
              <input
                type="text"
                placeholder="e.g. Catch regional express train"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reminder</label>
              <input
                type="text"
                placeholder="e.g. Platform 4, reservation #8841"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Add to Schedule
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {slots.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative"
            >
              <div className="text-center w-14 shrink-0">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{s.time}</span>
                <div className="h-6 w-0.5 bg-indigo-200 dark:bg-indigo-900 mx-auto my-1" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.activity}</h4>
                  <button
                    onClick={() => removeSlot(s.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {s.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.notes}</p>}
                <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Recommended buffer: {s.bufferMinutes} min transit allowance
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MULTI-CITY TRIP PLANNER
// ==========================================
export const MultiCityTripPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [legs, setLegs] = useState<
    {
      id: string;
      origin: string;
      destination: string;
      mode: 'flight' | 'train' | 'bus' | 'car' | 'ferry';
      depDate: string;
      arrDate: string;
      stayDays: number;
      cost: number;
    }[]
  >([
    {
      id: '1',
      origin: 'New York (JFK)',
      destination: 'London (LHR)',
      mode: 'flight',
      depDate: '2026-06-01',
      arrDate: '2026-06-02',
      stayDays: 3,
      cost: 650
    },
    {
      id: '2',
      origin: 'London',
      destination: 'Paris',
      mode: 'train',
      depDate: '2026-06-05',
      arrDate: '2026-06-05',
      stayDays: 4,
      cost: 110
    },
    {
      id: '3',
      origin: 'Paris',
      destination: 'Rome',
      mode: 'flight',
      depDate: '2026-06-09',
      arrDate: '2026-06-09',
      stayDays: 4,
      cost: 95
    }
  ]);

  const totalTransitCost = legs.reduce((acc, l) => acc + l.cost, 0);
  const totalDays = legs.reduce((acc, l) => acc + l.stayDays, 0);

  const addLeg = () => {
    const last = legs[legs.length - 1];
    const newLeg = {
      id: `leg_${Date.now()}`,
      origin: last ? last.destination : 'City A',
      destination: 'Next Destination',
      mode: 'train' as const,
      depDate: last ? last.arrDate : '2026-06-13',
      arrDate: last ? last.arrDate : '2026-06-13',
      stayDays: 3,
      cost: 100
    };
    setLegs([...legs, newLeg]);
    showToast('Transit leg added', 'info');
  };

  const removeLeg = (id: string) => {
    setLegs(legs.filter((l) => l.id !== id));
  };

  const updateLeg = (id: string, field: string, val: any) => {
    setLegs(legs.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🗺️</span> Multi-City Trip Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chain flights, trains, and ferry legs across multiple stops with layovers and stay durations.
          </p>
        </div>
        <button
          onClick={addLeg}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add City Stop
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Destinations</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{legs.length + 1}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Total Transit Legs</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{legs.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Total Stay Days</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalDays} days</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Transit Budget</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">${totalTransitCost}</p>
        </div>
      </div>

      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div
            key={leg.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Leg #{index + 1}
              </span>
              <button
                onClick={() => removeLeg(leg.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">From</label>
                <input
                  type="text"
                  value={leg.origin}
                  onChange={(e) => updateLeg(leg.id, 'origin', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">To</label>
                <input
                  type="text"
                  value={leg.destination}
                  onChange={(e) => updateLeg(leg.id, 'destination', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Mode</label>
                <select
                  value={leg.mode}
                  onChange={(e) => updateLeg(leg.id, 'mode', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="flight">✈️ Flight</option>
                  <option value="train">🚆 Train</option>
                  <option value="bus">🚌 Bus</option>
                  <option value="car">🚗 Rental Car</option>
                  <option value="ferry">⛴️ Ferry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Departure</label>
                <input
                  type="date"
                  value={leg.depDate}
                  onChange={(e) => updateLeg(leg.id, 'depDate', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Stay Days</label>
                <input
                  type="number"
                  min="0"
                  value={leg.stayDays}
                  onChange={(e) => updateLeg(leg.id, 'stayDays', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cost ($)</label>
                <input
                  type="number"
                  min="0"
                  value={leg.cost}
                  onChange={(e) => updateLeg(leg.id, 'cost', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. ROAD TRIP PLANNER
// ==========================================
export const RoadTripPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [stops, setStops] = useState<
    { id: string; name: string; distanceKm: number; drivingHours: number; highlights: string; driver: string }[]
  >([
    { id: '1', name: 'Start: Denver, CO', distanceKm: 0, drivingHours: 0, highlights: 'Load vehicle, tire check', driver: 'Alex' },
    { id: '2', name: 'Glenwood Canyon', distanceKm: 250, drivingHours: 2.8, highlights: 'Scenic highway canyon, coffee break', driver: 'Alex' },
    { id: '3', name: 'Moab & Arches', distanceKm: 190, drivingHours: 2.2, highlights: 'Delicate Arch hike, stay overnight', driver: 'Sam' },
    { id: '4', name: 'Bryce Canyon', distanceKm: 400, drivingHours: 4.5, highlights: 'Scenic byway 12, sunset point', driver: 'Alex' }
  ]);

  const totalDist = stops.reduce((acc, s) => acc + s.distanceKm, 0);
  const totalDrive = stops.reduce((acc, s) => acc + s.drivingHours, 0);
  const recommendedBreaks = Math.floor(totalDrive / 2);

  const addStop = () => {
    const item = {
      id: `stop_${Date.now()}`,
      name: 'Scenic Stop / City',
      distanceKm: 150,
      drivingHours: 2.0,
      highlights: 'Sightseeing & refuel',
      driver: 'Alex'
    };
    setStops([...stops, item]);
    showToast('Road trip stop added', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🚗</span> Road Trip Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Map out highway waypoints, driver rotations, rest breaks, and scenic viewpoints along your route.
          </p>
        </div>
        <button
          onClick={addStop}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Stop
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Total Distance</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalDist} km</p>
          <span className="text-[11px] text-slate-400">({Math.round(totalDist * 0.621371)} miles)</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Driving Time</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{totalDrive.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Rec. Rest Breaks</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{recommendedBreaks} stops</p>
          <span className="text-[11px] text-slate-400">(every 2h driving)</span>
        </div>
      </div>

      <div className="space-y-3">
        {stops.map((s, idx) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.highlights}</p>
                <span className="text-[11px] text-slate-400 mt-0.5 inline-block">
                  Driver: <span className="font-semibold text-slate-600 dark:text-slate-300">{s.driver}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">{s.distanceKm} km</p>
                <p className="text-[11px] text-slate-400">{s.drivingHours} hrs drive</p>
              </div>
              {idx > 0 && (
                <button
                  onClick={() => setStops(stops.filter((item) => item.id !== s.id))}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. WEEKEND TRIP PLANNER
// ==========================================
export const WeekendTripPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [destination, setDestination] = useState('Coastal Beach Town');
  const [schedule, setSchedule] = useState([
    { period: 'Friday Evening', plan: 'Arrive, hotel check-in, sunset boardwalk walk, casual seafood dinner' },
    { period: 'Saturday Morning', plan: 'Morning cafe, local farmers market, coastal hike' },
    { period: 'Saturday Afternoon', plan: 'Beach relaxation, water activities, museum or local brewery' },
    { period: 'Saturday Night', plan: 'Dinner reservations at waterfront bistro, live music' },
    { period: 'Sunday Morning', plan: 'Brunch, souvenir shopping, scenic lighthouse viewpoint' },
    { period: 'Sunday Afternoon', plan: 'Check-out, scenic drive back home' }
  ]);

  const updatePlan = (idx: number, text: string) => {
    const copy = [...schedule];
    copy[idx].plan = text;
    setSchedule(copy);
  };

  const copyWeekend = () => {
    let out = `WEEKEND GETAWAY: ${destination}\n==========================\n`;
    schedule.forEach((s) => {
      out += `• ${s.period}:\n  ${s.plan}\n\n`;
    });
    navigator.clipboard.writeText(out);
    showToast('Weekend plan copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🏖️</span> Weekend Trip Planner
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quick 48-hour getaway template from Friday arrival to Sunday evening departure.
          </p>
        </div>
        <button
          onClick={copyWeekend}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Copy className="w-3.5 h-3.5" /> Copy 48-Hour Plan
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          Weekend Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedule.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-2"
          >
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.period}</span>
            <textarea
              rows={2}
              value={item.plan}
              onChange={(e) => updatePlan(idx, e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. HOLIDAY PLANNER
// ==========================================
export const HolidayPlanner: React.FC = () => {
  const [leaveDays, setLeaveDays] = useState(4);
  const [publicHolidays, setPublicHolidays] = useState(2);
  const [includeWeekends, setIncludeWeekends] = useState(true);

  const totalConsecutive = leaveDays + publicHolidays + (includeWeekends ? 4 : 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🌴</span> Holiday Planner
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Maximize consecutive vacation days by bridging annual leave days with public holidays and weekends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Leave Optimization</h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Annual Leave Days Taken
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={leaveDays}
              onChange={(e) => setLeaveDays(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Adjacent Public Holidays
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={publicHolidays}
              onChange={(e) => setPublicHolidays(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
              className="rounded text-indigo-600"
            />
            Bridge both surrounding weekends (+4 days)
          </label>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-800/60 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 flex flex-col justify-center text-center">
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            Total Vacation Window
          </span>
          <p className="text-5xl font-black text-slate-900 dark:text-white my-3">
            {totalConsecutive} <span className="text-2xl font-normal text-slate-500">consecutive days off</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            By taking <span className="font-bold text-indigo-600">{leaveDays} official leave days</span>, combined with{' '}
            {publicHolidays} holiday(s) and weekend bridging, you unlock {totalConsecutive} continuous days for
            travel or rest.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. TRAVEL BUDGET PLANNER
// ==========================================
export const TravelBudgetPlanner: React.FC = () => {
  const [categories, setCategories] = useState<{ name: string; planned: number; spent: number }[]>([
    { name: 'Flights / Long-Haul Transit', planned: 800, spent: 750 },
    { name: 'Accommodation / Hotels', planned: 900, spent: 880 },
    { name: 'Local Transit (taxis, subway, trains)', planned: 150, spent: 120 },
    { name: 'Food, Cafes & Dining', planned: 600, spent: 540 },
    { name: 'Activities, Tours & Tickets', planned: 300, spent: 310 },
    { name: 'Shopping & Souvenirs', planned: 200, spent: 150 },
    { name: 'Emergency Contingency Fund', planned: 250, spent: 0 }
  ]);

  const totalPlanned = categories.reduce((acc, c) => acc + c.planned, 0);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const balance = totalPlanned - totalSpent;

  const updateVal = (idx: number, field: 'planned' | 'spent', val: number) => {
    const copy = [...categories];
    copy[idx][field] = Math.max(0, val);
    setCategories(copy);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>💰</span> Travel Budget Planner
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Allocate your trip funds across core categories and track actual vs planned spending.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Total Planned</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">${totalPlanned}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Actual Spent</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">${totalSpent}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Remaining Buffer</span>
          <p
            className={`text-xl font-bold mt-1 ${
              balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
            }`}
          >
            ${balance}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const percent = cat.planned > 0 ? Math.min(100, Math.round((cat.spent / cat.planned) * 100)) : 0;
          return (
            <div
              key={cat.name}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{cat.name}</span>
                <span className="text-xs font-mono text-slate-500">
                  ${cat.spent} / ${cat.planned} ({percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    percent > 100 ? 'bg-red-500' : percent > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block">Planned ($)</label>
                  <input
                    type="number"
                    value={cat.planned}
                    onChange={(e) => updateVal(idx, 'planned', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Spent ($)</label>
                  <input
                    type="number"
                    value={cat.spent}
                    onChange={(e) => updateVal(idx, 'spent', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 9. GROUP TRIP ORGANIZER
// ==========================================
export const GroupTripOrganizer: React.FC = () => {
  const { showToast } = useToast();
  const [members, setMembers] = useState<{ id: string; name: string; role: string; contact: string }[]>([
    { id: '1', name: 'Alex Johnson', role: 'Trip Coordinator', contact: 'alex@example.com' },
    { id: '2', name: 'Sam Smith', role: 'Lead Navigator / Driver', contact: '+1 555-0192' },
    { id: '3', name: 'Taylor Lee', role: 'Treasurer / Splitter', contact: 'taylor@example.com' },
    { id: '4', name: 'Jordan Rivera', role: 'Activity Coordinator', contact: '+1 555-0814' }
  ]);

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Traveler');
  const [newContact, setNewContact] = useState('');

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMembers([
      ...members,
      { id: `mem_${Date.now()}`, name: newName.trim(), role: newRole.trim(), contact: newContact.trim() }
    ]);
    setNewName('');
    setNewContact('');
    showToast('Group member added', 'success');
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>👥</span> Group Trip Organizer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Coordinate traveler roles, designate leads (driver, treasurer, bookings), and store emergency contact channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">Add Group Member</h3>
          <form onSubmit={addMember} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Morgan Vance"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Assigned Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Trip Coordinator">Trip Coordinator</option>
                <option value="Lead Navigator / Driver">Lead Navigator / Driver</option>
                <option value="Treasurer / Splitter">Treasurer / Splitter</option>
                <option value="Activity Coordinator">Activity Coordinator</option>
                <option value="Photographer">Photographer</option>
                <option value="First Aid Lead">First Aid Lead</option>
                <option value="Traveler">General Traveler</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Contact Info</label>
              <input
                type="text"
                placeholder="Phone or email"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Add Member
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.name}</h4>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{m.role}</span>
                  {m.contact && <p className="text-[11px] text-slate-400 mt-0.5">{m.contact}</p>}
                </div>
              </div>
              <button
                onClick={() => removeMember(m.id)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. TRAVEL CHECKLIST GENERATOR
// ==========================================
export const TravelChecklistGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [tripType, setTripType] = useState<'domestic' | 'international'>('international');
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const [hasKids, setHasKids] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const generateTasks = () => {
    const list: { phase: string; tasks: string[] }[] = [
      {
        phase: '2 Weeks Before',
        tasks: [
          'Verify passport expiration date (needs 6 months validity)',
          tripType === 'international' ? 'Check visa regulations and eVisa approvals' : 'Verify ID / Driver License',
          'Notify bank / credit card of international travel dates',
          'Purchase comprehensive travel medical insurance',
          'Refill prescription medications with spare dosage'
        ]
      },
      {
        phase: '1 Week Before',
        tasks: [
          'Download offline Google Maps / translation language packs',
          'Confirm hotel and flight reservations',
          'Arrange airport transit or parking',
          'Set up international eSIM or roaming plan',
          hasKids ? 'Prepare child snacks, travel games, and comfort toys' : 'Pack light carry-on luggage'
        ]
      },
      {
        phase: 'Day Before Departure',
        tasks: [
          'Online airline check-in (24 hours prior)',
          'Charge power banks, laptops, headphones, phones',
          'Place passports and boarding passes in accessible pouch',
          'Empty refrigerator and take out trash',
          'Lock windows, set thermostat to away mode'
        ]
      },
      {
        phase: 'Departure Morning',
        tasks: [
          'Check flight status for any last-minute gate changes',
          'Unplug non-essential electronics',
          'Double check wallet, passport, and house keys',
          'Depart for airport with 3h buffer (international) or 2h (domestic)'
        ]
      }
    ];
    return list;
  };

  const sections = generateTasks();

  const toggleTask = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const exportList = () => {
    let out = `TRAVEL PREPARATION CHECKLIST\n============================\n`;
    sections.forEach((sec) => {
      out += `\n[ ${sec.phase} ]\n`;
      sec.tasks.forEach((t) => {
        const isDone = !!checkedItems[`${sec.phase}-${t}`];
        out += `${isDone ? '[X]' : '[ ]'} ${t}\n`;
      });
    });
    navigator.clipboard.writeText(out);
    showToast('Checklist copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📋</span> Travel Checklist Generator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dynamically assemble pre-trip deadlines from 2 weeks before to departure morning.
          </p>
        </div>
        <button
          onClick={exportList}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Checklist
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Destination Scope</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTripType('domestic')}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                tripType === 'domestic'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Domestic
            </button>
            <button
              onClick={() => setTripType('international')}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                tripType === 'international'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              International
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Traveling with Kids</label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hasKids}
              onChange={(e) => setHasKids(e.target.checked)}
              className="rounded text-indigo-600"
            />
            Include Family & Kids Prep
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.phase}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {sec.phase}
            </h3>
            <div className="space-y-2">
              {sec.tasks.map((task) => {
                const key = `${sec.phase}-${task}`;
                const isChecked = !!checkedItems[key];
                return (
                  <label
                    key={task}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTask(key)}
                      className="mt-0.5 rounded text-indigo-600"
                    />
                    <span
                      className={`leading-relaxed ${
                        isChecked
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {task}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
