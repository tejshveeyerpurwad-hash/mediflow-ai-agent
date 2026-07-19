import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import agentService from '../services/agentService';
import {
  Calendar, Clock, User, Phone, CheckCircle, ChevronLeft, ChevronRight, Plus, QrCode, Mail, Bell
} from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const MOCK_SCHEDULE = {
  1: ['09:00 AM', '10:00 AM', '11:00 AM'],
  2: ['09:30 AM', '10:30 AM', '02:00 PM', '03:00 PM'],
  3: ['10:00 AM', '02:30 PM', '04:00 PM'],
  4: ['09:00 AM', '09:30 AM', '10:00 AM', '02:00 PM', '03:30 PM'],
  5: ['11:00 AM', '02:00 PM', '04:30 PM'],
  6: ['09:00 AM', '10:30 AM'],
  7: [],
};

const PAST_APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Sharma', specialty: 'General', date: '2026-07-15', time: '10:00 AM', status: 'completed' },
  { id: 2, doctor: 'Dr. Patel', specialty: 'Cardiology', date: '2026-07-10', time: '02:30 PM', status: 'completed' },
  { id: 3, doctor: 'Dr. Verma', specialty: 'Orthopedics', date: '2026-07-05', time: '09:00 AM', status: 'cancelled' },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function AppointmentPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('book');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    return MOCK_SCHEDULE[dayOfWeek] || [];
  }, [selectedDate]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (day) => {
    const d = new Date(year, month, day);
    return d.toDateString() === today.toDateString();
  };

  const handleDateSelect = (day) => {
    setSelectedDate(new Date(year, month, day));
    setSelectedSlot('');
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !patientName || !contact) return;
    setLoading(true);
    setError(null);
    setConfirmation(null);
    try {
      const data = await agentService.appointment({
        patientName,
        contact,
        reason,
        preferredDate: selectedDate.toISOString().split('T')[0],
        preferredSlot: selectedSlot,
      });
      setConfirmation(data);
      setActiveTab('confirm');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Appointment booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedDate && selectedSlot && patientName && contact;

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const statusConfig = {
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
    cancelled: { color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: Bell },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <Navbar />
      <div className="relative px-4 pb-32 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-100 rounded-2xl border border-teal-200">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Appointments</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">Schedule and manage your appointments</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 mb-3">
          <button onClick={() => setActiveTab('book')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'book' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Calendar className="w-3 h-3" /> Book
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Clock className="w-3 h-3" /> History
          </button>
          {confirmation && (
            <button onClick={() => setActiveTab('confirm')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'confirm' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
              <CheckCircle className="w-3 h-3" /> Confirmed
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar and Booking */}
          <div className={`lg:col-span-2 space-y-6 ${activeTab === 'book' || activeTab === 'confirm' ? '' : 'hidden lg:block'} ${activeTab === 'confirm' && !confirmation ? 'hidden lg:block' : ''}`}>
            {/* Calendar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Select Date</h2>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200">
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-sm font-black text-slate-800 min-w-[140px] text-center">{MONTHS[month]} {year}</span>
                  <button onClick={nextMonth} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 py-2">{d}</div>
                ))}
                {calendarDays.map((day, idx) => (
                  <div key={idx} className="aspect-square">
                    {day && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateSelect(day)}
                        className={`w-full h-full rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                          selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                            : isToday(day)
                              ? 'bg-teal-50 text-teal-700 border border-teal-200 font-black'
                              : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        {day}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Time Slots */}
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                  <Clock className="w-4 h-4 inline mr-1.5" />
                  Available Slots — {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h2>
                {availableSlots.length === 0 ? (
                  <div className="py-8 text-center">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-400">No slots available</p>
                    <p className="text-xs text-slate-400 mt-1">Please select another date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map(slot => (
                      <motion.button
                        key={slot}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        {slot}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Patient Details Form */}
            {selectedSlot && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Patient Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">
                      <User className="w-3 h-3 inline mr-1" /> Patient Name
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">
                      <Phone className="w-3 h-3 inline mr-1" /> Contact
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="Phone number"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">
                    <Mail className="w-3 h-3 inline mr-1" /> Reason for Visit
                  </label>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Brief description of symptoms or reason..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all resize-none"
                  />
                </div>

                <motion.button
                  whileHover={canSubmit ? { y: -1, scale: 1.01 } : {}}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${canSubmit && !loading ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-200/60 hover:from-teal-700 hover:to-teal-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  {loading ? (
                    <><Clock className="w-4 h-4 animate-spin" /> Booking...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Book Appointment</>
                  )}
                </motion.button>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                      <Calendar className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-rose-700">Booking Failed</p>
                        <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                        <button onClick={() => setError(null)} className="mt-1 text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider">Dismiss</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className={`space-y-6 ${activeTab === 'confirm' || activeTab === 'history' ? '' : 'hidden lg:block'}`}>
            {/* Confirmation */}
            <AnimatePresence mode="wait">
              {confirmation && activeTab !== 'history' && (
                <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 lg:sticky lg:top-28">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-200">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-emerald-700">Confirmed</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-800">{confirmation.patientName || patientName}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-800">{confirmation.date || selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-800">{confirmation.slot || selectedSlot}</span>
                    </div>
                    {confirmation.doctor && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                        <User className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-800">{confirmation.doctor}</span>
                      </div>
                    )}
                    {confirmation.bookingId && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-0.5">Booking ID</p>
                        <p className="text-sm font-bold text-slate-800 font-mono">{confirmation.bookingId}</p>
                      </div>
                    )}
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="mt-5 p-5 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
                    <div className="w-28 h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center mb-2">
                      <QrCode className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Show this QR at reception</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Add to Calendar
                    </button>
                    <button className="flex-1 py-2.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-100 transition-all flex items-center justify-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" /> Remind Me
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Past Appointments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 ${confirmation ? '' : 'lg:sticky lg:top-28'}`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Past Appointments</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{PAST_APPOINTMENTS.length}</span>
              </div>

              {PAST_APPOINTMENTS.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <Calendar className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No past appointments</p>
                  <p className="text-xs text-slate-300 mt-1">Your appointment history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {PAST_APPOINTMENTS.map((apt, idx) => {
                    const config = statusConfig[apt.status] || statusConfig.completed;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${config.bg}`}>
                            <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800">{apt.doctor}</p>
                                <p className="text-[10px] font-medium text-slate-500">{apt.specialty}</p>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-wider shrink-0 ${config.color}`}>{apt.status}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
