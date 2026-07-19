import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, HeartPulse, FileText, Pill, Activity,
  AlertTriangle, CheckCircle, Clock, MapPin, User,
  ChevronDown, ChevronUp, PlusCircle, Stethoscope,
  Shield, Download
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TIMELINE_EVENTS = [
  { id: 1, type: 'visit', date: '2026-07-15', title: 'PHC Visit', description: 'General checkup. BP: 120/80, Weight: 65kg', provider: 'Dr. Sharma', location: 'Sundarnagar PHC', severity: 'info' },
  { id: 2, type: 'diagnosis', date: '2026-07-10', title: 'Diagnosis: URTI', description: 'Upper Respiratory Tract Infection diagnosed', provider: 'Dr. Verma', location: 'Community Health Center', severity: 'warning' },
  { id: 3, type: 'medication', date: '2026-07-10', title: 'Prescribed Amoxicillin', description: 'Amoxicillin 500mg - 3 times daily for 7 days', provider: 'Dr. Verma', severity: 'info' },
  { id: 4, type: 'lab', date: '2026-07-08', title: 'Blood Test Results', description: 'Hb: 12.5 g/dL, WBC: 8,200, Platelets: 245,000', provider: 'Pathology Lab', severity: 'success' },
  { id: 5, type: 'vaccination', date: '2026-06-20', title: 'Tetanus Booster', description: 'TT vaccination administered', provider: 'ASHA Priya', location: 'Home Visit', severity: 'success' },
  { id: 6, type: 'emergency', date: '2026-06-15', title: 'Emergency Visit', description: 'High fever (103°F). Treated and discharged same day.', provider: 'Civil Hospital', location: 'Emergency Ward', severity: 'danger' },
  { id: 7, type: 'follow_up', date: '2026-06-22', title: 'Follow-up Scheduled', description: 'Post-emergency follow-up with Dr. Mehta', severity: 'info' },
  { id: 8, type: 'referral', date: '2026-06-10', title: 'Referred to Specialist', description: 'Referred to ENT specialist for chronic cough', provider: 'Dr. Sharma', location: 'District Hospital', severity: 'warning' },
];

const TYPE_CONFIG = {
  visit: { icon: Stethoscope, color: '#3b82f6', bg: '#eff6ff', label: 'Visit' },
  diagnosis: { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb', label: 'Diagnosis' },
  medication: { icon: Pill, color: '#8b5cf6', bg: '#f5f3ff', label: 'Medication' },
  lab: { icon: Activity, color: '#10b981', bg: '#ecfdf5', label: 'Lab Result' },
  vaccination: { icon: Shield, color: '#06b6d4', bg: '#ecfeff', label: 'Vaccination' },
  emergency: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', label: 'Emergency' },
  follow_up: { icon: Clock, color: '#6366f1', bg: '#eef2ff', label: 'Follow-up' },
  referral: { icon: User, color: '#f97316', bg: '#fff7ed', label: 'Referral' },
};

function TimelineCard({ event, index }) {
  const Icon = TYPE_CONFIG[event.type]?.icon || Activity;
  const config = TYPE_CONFIG[event.type] || { color: '#6b7280', bg: '#f9fafb', label: 'Event' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative pl-8 pb-6 group"
    >
      <div className="absolute left-3 top-1 bottom-0 w-0.5 bg-gray-200 group-last:hidden" />
      <div
        className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center"
        style={{ backgroundColor: config.bg, borderColor: config.color }}
      >
        <Icon className="w-3 h-3" style={{ color: config.color }} />
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: config.bg, color: config.color }}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{event.date}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{event.description}</p>
            {event.provider && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <User className="w-3 h-3" />{event.provider}
                {event.location && <><MapPin className="w-3 h-3 ml-2" />{event.location}</>}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PatientTimeline() {
  const { user } = useAuth();
  const [events, setEvents] = useState(TIMELINE_EVENTS);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Medical Timeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">Complete patient history in chronological order</p>
        </motion.div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[{ key: 'all', label: 'All' }, ...Object.entries(TYPE_CONFIG).map(([key, val]) => ({ key, label: val.label }))].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No events found for this filter</p>
            </div>
          ) : (
            filtered.map((event, i) => (
              <TimelineCard key={event.id} event={event} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
