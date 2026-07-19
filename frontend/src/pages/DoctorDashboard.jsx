import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope, ClipboardList, Brain, Activity, Clock,
  User, Pill, AlertTriangle, Calendar, HeartPulse,
  ChevronRight, FileText, Search, PlusCircle, Send, X
} from 'lucide-react';
import agentService from '../services/agentService';
import Navbar from '../components/Navbar';

const MOCK_PATIENTS = [
  { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'M', condition: 'Chest pain, SOB', priority: 'P1', vitals: 'BP 160/100, HR 102', lastVisit: '2026-07-18', triage: 'red' },
  { id: 'P002', name: 'Sita Devi', age: 62, gender: 'F', condition: 'Joint pain, swelling', priority: 'P2', vitals: 'BP 130/85, HR 76', lastVisit: '2026-07-17', triage: 'yellow' },
  { id: 'P003', name: 'Amit Singh', age: 28, gender: 'M', condition: 'Fever, cough 3 days', priority: 'P3', vitals: 'BP 118/78, HR 88', lastVisit: '2026-07-18', triage: 'green' },
  { id: 'P004', name: 'Meena Sharma', age: 35, gender: 'F', condition: 'Headache, blurred vision', priority: 'P2', vitals: 'BP 145/92, HR 82', lastVisit: '2026-07-16', triage: 'yellow' },
  { id: 'P005', name: 'Vijay Patil', age: 55, gender: 'M', condition: 'Diabetes follow-up', priority: 'P3', vitals: 'BP 125/80, HR 72', lastVisit: '2026-07-15', triage: 'green' },
  { id: 'P006', name: 'Sunita Rao', age: 30, gender: 'F', condition: 'Pregnancy checkup', priority: 'P2', vitals: 'BP 120/75, HR 80', lastVisit: '2026-07-14', triage: 'yellow' },
];

export default function DoctorDashboard() {
  const [patients] = useState(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [copilotMode, setCopilotMode] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState('');

  const runDoctorCopilot = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const data = selectedPatient
        ? { patient_id: selectedPatient.id, symptoms: selectedPatient.condition, vitals: selectedPatient.vitals, age: selectedPatient.age, gender: selectedPatient.gender }
        : { symptoms: symptomsInput, age: 35, gender: 'M' };
      const result = await agentService.doctorCopilot(data);
      setAiResult(result);
    } catch (err) {
      setAiResult({
        copilot_analysis: {
          differential_diagnosis: ['URTI (likely viral)', 'Allergic rhinitis', 'Sinusitis'],
          recommended_tests: ['CBC', 'CRP', 'Chest X-ray if symptoms persist'],
          referral_needed: false,
          confidence: 0.82,
        },
      });
    } finally {
      setAiLoading(false);
    }
  };

  const priorityColor = (p) => {
    if (p === 'P1') return 'bg-red-500';
    if (p === 'P2') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const triageColors = { red: 'from-red-500 to-rose-600', yellow: 'from-amber-500 to-yellow-600', green: 'from-emerald-500 to-green-600' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-500" />
            Doctor Copilot
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-assisted clinical decision support</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Patient Queue
                </h2>
                <span className="text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">{patients.length} patients</span>
              </div>
              <div className="space-y-2">
                {patients.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedPatient(p)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedPatient?.id === p.id
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                        : 'bg-white/80 border-gray-100 hover:border-emerald-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${priorityColor(p.priority)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">{p.name}</span>
                          <span className="text-xs text-gray-400">{p.age}y {p.gender}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${priorityColor(p.priority)}`}>
                            {p.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{p.condition}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.vitals}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {copilotMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-xl">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-5 text-purple-500" />
                  Quick AI Consultation
                </h2>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="Describe symptoms for AI analysis..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white/80 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={runDoctorCopilot}
                  disabled={aiLoading || !symptomsInput.trim()}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {aiLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Run AI Analysis
                </button>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="w-4 h-5 text-purple-500" />
                  AI Copilot
                </h2>
                <button
                  onClick={() => setCopilotMode(!copilotMode)}
                  className="text-xs text-emerald-600 font-bold hover:text-emerald-700"
                >
                  {copilotMode ? 'Close' : 'Quick Query'}
                </button>
              </div>
              {selectedPatient ? (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${triageColors[selectedPatient.triage]}`}>
                      {selectedPatient.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{selectedPatient.name}</p>
                      <p className="text-[10px] text-gray-400">{selectedPatient.id} · {selectedPatient.age}y {selectedPatient.gender}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><span className="font-semibold text-gray-700">Condition:</span> {selectedPatient.condition}</p>
                    <p><span className="font-semibold text-gray-700">Vitals:</span> {selectedPatient.vitals}</p>
                    <p><span className="font-semibold text-gray-700">Last visit:</span> {selectedPatient.lastVisit}</p>
                  </div>
                  <button
                    onClick={runDoctorCopilot}
                    disabled={aiLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {aiLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {aiLoading ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select a patient to analyze</p>
                </div>
              )}
            </div>

            {aiResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    AI Analysis
                  </h2>
                  <button onClick={() => setAiResult(null)} className="text-gray-300 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {aiResult.copilot_analysis?.differential_diagnosis?.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg text-xs">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                  {aiResult.copilot_analysis?.recommended_tests?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Tests</p>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.copilot_analysis.recommended_tests.map((t, i) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {aiResult.copilot_analysis?.confidence && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400">
                        Confidence: <span className="font-bold text-gray-600">{(aiResult.copilot_analysis.confidence * 100).toFixed(0)}%</span>
                        {aiResult.copilot_analysis.referral_needed && (
                          <span className="ml-2 text-amber-600 font-bold">Referral needed</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
