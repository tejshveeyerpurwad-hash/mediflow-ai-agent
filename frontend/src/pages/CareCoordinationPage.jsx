import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ArrowRight, CheckCircle, AlertTriangle, Clock,
  User, Stethoscope, Activity, Pill, Send, Brain
} from 'lucide-react';
import agentService from '../services/agentService';
import Navbar from '../components/Navbar';

const COLUMNS = [
  { id: 'triage', title: 'Triage', icon: AlertTriangle, color: 'rose' },
  { id: 'primary-care', title: 'Primary Care', icon: Stethoscope, color: 'blue' },
  { id: 'specialist', title: 'Specialist Referral', icon: Activity, color: 'amber' },
  { id: 'follow-up', title: 'Follow-up', icon: Pill, color: 'violet' },
  { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'emerald' },
];

const PRIORITY_CONFIG = {
  P1: { label: 'P1', classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
  P2: { label: 'P2', classes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  P3: { label: 'P3', classes: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

const COLOR_MAP = {
  rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
};

const mockPatients = [
  { id: 'P-001', name: 'Eleanor Vance', age: 72, condition: 'Chest Pain', priority: 'P1', provider: 'Dr. Chen', column: 'triage', lastUpdated: '2 min ago', avatar: 'EV' },
  { id: 'P-002', name: 'Marcus Webb', age: 45, condition: 'Hypertension', priority: 'P2', provider: 'Dr. Patel', column: 'triage', lastUpdated: '5 min ago', avatar: 'MW' },
  { id: 'P-003', name: 'Sophia Kim', age: 34, condition: 'Prenatal Checkup', priority: 'P3', provider: 'Dr. Rivera', column: 'primary-care', lastUpdated: '12 min ago', avatar: 'SK' },
  { id: 'P-004', name: 'James Okafor', age: 58, condition: 'Diabetes Type 2', priority: 'P2', provider: 'Dr. Thompson', column: 'primary-care', lastUpdated: '8 min ago', avatar: 'JO' },
  { id: 'P-005', name: 'Linda Harper', age: 67, condition: 'Orthopedic Consult', priority: 'P2', provider: 'Dr. Walsh', column: 'specialist', lastUpdated: '20 min ago', avatar: 'LH' },
  { id: 'P-006', name: 'David Cruz', age: 29, condition: 'Dermatology Referral', priority: 'P3', provider: 'Dr. Kim', column: 'specialist', lastUpdated: '1 hr ago', avatar: 'DC' },
  { id: 'P-007', name: 'Agnes Moore', age: 81, condition: 'Post-op Recovery', priority: 'P1', provider: 'Dr. Chen', column: 'follow-up', lastUpdated: '30 min ago', avatar: 'AM' },
  { id: 'P-008', name: 'Raj Mehta', age: 52, condition: 'Cardiology Follow-up', priority: 'P3', provider: 'Dr. Patel', column: 'follow-up', lastUpdated: '45 min ago', avatar: 'RM' },
  { id: 'P-009', name: 'Clara Jenkins', age: 41, condition: 'Annual Physical', priority: 'P3', provider: 'Dr. Rivera', column: 'completed', lastUpdated: '2 hrs ago', avatar: 'CJ' },
  { id: 'P-010', name: 'Tomás Silva', age: 63, condition: 'Colonoscopy Clear', priority: 'P2', provider: 'Dr. Walsh', column: 'completed', lastUpdated: '3 hrs ago', avatar: 'TS' },
];

function PatientCard({ patient, onDragStart, onClick, isSelected }) {
  const priority = PRIORITY_CONFIG[patient.priority];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => onDragStart(e, patient)}
      onClick={() => onClick(patient)}
      className={`group cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-white/50 backdrop-blur-xl p-4 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:bg-white/70 hover:-translate-y-0.5 ${
        isSelected ? 'ring-2 ring-indigo-400/60 bg-white/80' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-500/40 text-xs font-semibold text-white ring-1 ring-white/20">
            {patient.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{patient.name}</p>
            <p className="text-xs text-gray-500">{patient.age} yrs</p>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.classes}`}>
          {priority.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
        <Stethoscope className="h-3 w-3 text-gray-400" />
        <span>{patient.condition}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{patient.provider}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{patient.lastUpdated}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Column({ column, patients, onDragStart, onDrop, onDragOver, onPatientClick, selectedPatientId, onMovePatient }) {
  const Icon = column.icon;
  return (
    <div
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={onDragOver}
      className="flex flex-col rounded-2xl border border-white/20 bg-white/40 backdrop-blur-2xl p-4 shadow-xl shadow-black/5 min-h-[28rem] w-64 shrink-0"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${COLOR_MAP[column.color]} bg-opacity-50`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">{column.title}</h3>
        </div>
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/60 text-[11px] font-bold text-gray-600 shadow-sm">
          {patients.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence>
          {patients.map((p) => (
            <div key={p.id} className="relative">
              <PatientCard
                patient={p}
                onDragStart={onDragStart}
                onClick={onPatientClick}
                isSelected={selectedPatientId === p.id}
              />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                {COLUMNS.map((col) => {
                  if (col.id === column.id) return null;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onMovePatient(p.id, col.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 shadow-md text-gray-500 hover:text-indigo-500 hover:bg-white transition-all text-[10px]"
                      title={`Move to ${col.title}`}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </AnimatePresence>
        {patients.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-xs text-gray-400 py-8">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-1 opacity-40" />
              <p>Drop patient here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CareCoordinationPage() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiPlan, setAiPlan] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dragPatient, setDragPatient] = useState(null);

  const getPatientsByColumn = (colId) =>
    patients.filter((p) => p.column === colId);

  const handleDragStart = (e, patient) => {
    setDragPatient(patient);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', patient.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!dragPatient) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === dragPatient.id ? { ...p, column: columnId, lastUpdated: 'Just now' } : p
      )
    );
    setDragPatient(null);
  };

  const handleMovePatient = (patientId, toColumn) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, column: toColumn, lastUpdated: 'Just now' } : p
      )
    );
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setPanelOpen(true);
    setAiPlan('');
  };

  const handleGeneratePlan = async () => {
    if (!selectedPatient) return;
    setAiLoading(true);
    setAiPlan('');
    try {
      const result = await agentService.careCoordinator({
        patientId: selectedPatient.id,
        name: selectedPatient.name,
        age: selectedPatient.age,
        condition: selectedPatient.condition,
        priority: selectedPatient.priority,
        provider: selectedPatient.provider,
        currentColumn: selectedPatient.column,
      });
      setAiPlan(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch {
      setAiPlan('Unable to generate care plan at this time. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const selectedPatientData = selectedPatient
    ? patients.find((p) => p.id === selectedPatient.id) || selectedPatient
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full from-rose-500/10 bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-60 w-60 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                Care Coordination
              </h1>
              <p className="text-sm text-gray-400 mt-1 ml-1">Kanban board for patient care workflow</p>
            </div>
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                panelOpen
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Brain className="h-4 w-4" />
              AI Coordinator
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex gap-4 overflow-x-auto pb-4 flex-1 scrollbar-thin">
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  patients={getPatientsByColumn(col.id)}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onPatientClick={handlePatientClick}
                  selectedPatientId={selectedPatientData?.id}
                  onMovePatient={handleMovePatient}
                />
              ))}
            </div>

            <AnimatePresence>
              {panelOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 360, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="shrink-0 overflow-hidden"
                >
                  <div className="w-[360px] rounded-2xl border border-white/20 bg-white/30 backdrop-blur-2xl p-5 shadow-xl shadow-black/5 h-[calc(100vh-11rem)] overflow-y-auto scrollbar-thin">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400/30 to-purple-500/30">
                        <Brain className="h-4 w-4 text-indigo-300" />
                      </div>
                      <h2 className="text-base font-bold text-gray-800">Care Coordinator AI</h2>
                    </div>

                    {selectedPatientData ? (
                      <div className="space-y-4">
                        <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 p-4">
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Selected Patient</p>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-500/40 text-sm font-semibold text-white ring-1 ring-white/20">
                              {selectedPatientData.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{selectedPatientData.name}</p>
                              <p className="text-xs text-gray-500">{selectedPatientData.condition} &middot; {selectedPatientData.age} yrs</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PRIORITY_CONFIG[selectedPatientData.priority]?.classes || ''}`}>
                              {selectedPatientData.priority}
                            </span>
                            <span className="text-gray-400">&middot;</span>
                            <User className="h-3 w-3" />
                            <span>{selectedPatientData.provider}</span>
                          </div>
                        </div>

                        <div className="rounded-xl bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 p-4">
                          <p className="text-[10px] uppercase tracking-widest text-indigo-400 mb-2 font-semibold flex items-center gap-1.5">
                            <Activity className="h-3 w-3" /> Current Column
                          </p>
                          <p className="text-sm font-medium text-indigo-300">
                            {COLUMNS.find((c) => c.id === selectedPatientData.column)?.title || selectedPatientData.column}
                          </p>
                        </div>

                        <button
                          onClick={handleGeneratePlan}
                          disabled={aiLoading}
                          className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {aiLoading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Generate Care Plan
                            </>
                          )}
                        </button>

                        <AnimatePresence>
                          {aiPlan && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3 }}
                              className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 p-4"
                            >
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold flex items-center gap-1.5">
                                <Brain className="h-3 w-3" /> AI Care Plan
                              </p>
                              <div className="prose prose-sm prose-invert max-w-none">
                                {aiPlan.split('\n').map((line, i) => (
                                  <p key={i} className="text-xs text-gray-700 leading-relaxed mb-1">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/30 backdrop-blur-sm mb-4">
                          <Users className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-1">No patient selected</p>
                        <p className="text-xs text-gray-400">Click on a patient card to view their care coordination details</p>
                      </div>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
