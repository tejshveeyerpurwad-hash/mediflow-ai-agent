import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import agentService from '../services/agentService';
import {
  Pill, AlertTriangle, CheckCircle, Shield, AlertOctagon, Search, User, Activity
} from 'lucide-react';

const COMMON_DRUGS = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Amlodipine',
  'Losartan', 'Atorvastatin', 'Omeprazole', 'Aspirin', 'Cetirizine',
  'Azithromycin', 'Dolo 650', 'Cough Syrup', 'Vitamin D3', 'Iron Supplement',
  'Insulin', 'Metronidazole', 'Pantoprazole', 'Montelukast', 'Levothyroxine',
  'Furosemide', 'Ranitidine', 'Diclofenac', 'Prednisolone', 'Warfarin',
];

const SEVERITY_CONFIG = {
  severe: { icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', dot: 'bg-rose-500', label: 'Contraindicated' },
  moderate: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500', label: 'Caution' },
  mild: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500', label: 'Minor' },
};

export default function MedicationSafetyPage() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [currentMeds, setCurrentMeds] = useState([]);
  const [newMeds, setNewMeds] = useState([]);
  const [medInput, setMedInput] = useState('');
  const [newMedInput, setNewMedInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState('');
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleDrugSearch = (value, list) => {
    if (list === 'current') {
      setMedInput(value);
      setShowSuggestions('current');
    } else {
      setNewMedInput(value);
      setShowSuggestions('new');
    }
    if (value.length >= 1) {
      setFilteredDrugs(
        COMMON_DRUGS.filter(d => d.toLowerCase().includes(value.toLowerCase()))
      );
    } else {
      setFilteredDrugs([]);
    }
  };

  const addDrug = (drug, list) => {
    if (list === 'current') {
      if (!currentMeds.includes(drug)) {
        setCurrentMeds([...currentMeds, drug]);
      }
      setMedInput('');
    } else {
      if (!newMeds.includes(drug)) {
        setNewMeds([...newMeds, drug]);
      }
      setNewMedInput('');
    }
    setShowSuggestions('');
    setFilteredDrugs([]);
  };

  const removeDrug = (drug, list) => {
    if (list === 'current') {
      setCurrentMeds(currentMeds.filter(m => m !== drug));
    } else {
      setNewMeds(newMeds.filter(m => m !== drug));
    }
  };

  const handleKeyDown = (e, list) => {
    if (e.key === 'Enter' && filteredDrugs.length > 0) {
      addDrug(filteredDrugs[0], list);
    }
  };

  const handleSubmit = async () => {
    if (!age || !weight || currentMeds.length === 0 || newMeds.length === 0) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTab('result');
    try {
      const data = await agentService.medicationCheck({
        age: parseInt(age),
        weight: parseFloat(weight),
        currentMedications: currentMeds,
        newMedications: newMeds,
      });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Medication check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = age && weight && currentMeds.length > 0 && newMeds.length > 0;

  const interactions = result?.interactions || [];
  const safetyScore = result?.safetyScore ?? (interactions.length > 0 ? Math.round(Math.max(0, 100 - interactions.reduce((acc, i) => {
    if (i.severity === 'severe') return acc + 30;
    if (i.severity === 'moderate') return acc + 15;
    return acc + 5;
  }, 0))) : 92);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <Navbar />
      <div className="relative px-4 pb-32 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-2xl border border-violet-200">
              <Shield className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Medication Safety</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">Check drug interactions and safety before prescribing</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 mb-3">
          <button onClick={() => setActiveTab('input')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'input' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Pill className="w-3 h-3" /> Input
          </button>
          <button onClick={() => setActiveTab('result')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'result' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Shield className="w-3 h-3" /> Results {result && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Column */}
          <div className={`${activeTab === 'input' || activeTab === 'result' ? '' : ''} ${activeTab === 'result' ? 'hidden lg:block' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Patient Details</h2>

              {/* Age and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">Age (years)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">Weight (kg)</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      step="0.1"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">Current Medications</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={medInput}
                    onChange={e => handleDrugSearch(e.target.value, 'current')}
                    onKeyDown={e => handleKeyDown(e, 'current')}
                    onFocus={() => medInput.length >= 1 && setShowSuggestions('current')}
                    placeholder="Search and add medications..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                  {showSuggestions === 'current' && filteredDrugs.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                      {filteredDrugs.map(drug => (
                        <button
                          key={drug}
                          onClick={() => addDrug(drug, 'current')}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Pill className="w-3.5 h-3.5 text-slate-400" />
                          {drug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {currentMeds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentMeds.map(drug => (
                      <span key={drug} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 border border-violet-200 rounded-lg text-xs font-bold text-violet-700">
                        <Pill className="w-3 h-3" />
                        {drug}
                        <button onClick={() => removeDrug(drug, 'current')} className="ml-1 text-violet-400 hover:text-rose-500 transition-colors">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* New Medications to Check */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">New Medications to Check</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newMedInput}
                    onChange={e => handleDrugSearch(e.target.value, 'new')}
                    onKeyDown={e => handleKeyDown(e, 'new')}
                    onFocus={() => newMedInput.length >= 1 && setShowSuggestions('new')}
                    placeholder="Search medications to check against..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                  {showSuggestions === 'new' && filteredDrugs.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                      {filteredDrugs.map(drug => (
                        <button
                          key={drug}
                          onClick={() => addDrug(drug, 'new')}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Pill className="w-3.5 h-3.5 text-slate-400" />
                          {drug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {newMeds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newMeds.map(drug => (
                      <span key={drug} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-700">
                        <Pill className="w-3 h-3" />
                        {drug}
                        <button onClick={() => removeDrug(drug, 'new')} className="ml-1 text-amber-400 hover:text-rose-500 transition-colors">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={canSubmit ? { y: -1, scale: 1.01 } : {}}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${canSubmit && !loading ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-200/60 hover:from-violet-700 hover:to-violet-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <><Activity className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Shield className="w-4 h-4" /> Check Medication Safety</>
                )}
              </motion.button>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rose-700">Check Failed</p>
                      <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                      <button onClick={() => setError(null)} className="mt-1 text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider">Dismiss</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Results Column */}
          <div className={`${activeTab === 'result' ? '' : 'hidden lg:block'}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 min-h-[400px] lg:sticky lg:top-28">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-5">Safety Results</h2>

              <AnimatePresence mode="wait">
                {/* Empty */}
                {!result && !loading && !error && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-violet-100 to-violet-50 rounded-3xl flex items-center justify-center border border-violet-200">
                      <Shield className="w-9 h-9 text-violet-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-wide">No Check Yet</h3>
                    <p className="mt-1.5 text-sm text-slate-400 font-medium max-w-sm">Enter patient details, current medications, and new medications to begin the safety check.</p>
                  </motion.div>
                )}

                {/* Loading */}
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-14 text-center space-y-4">
                    <div className="relative">
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-16 h-16 mx-auto bg-violet-500 rounded-full blur-xl absolute inset-0" />
                      <Shield className="w-10 h-10 text-violet-600 animate-spin relative z-10 mx-auto" />
                    </div>
                    <p className="font-black text-violet-600 uppercase tracking-widest text-xs">Analyzing Drug Interactions...</p>
                    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} className="h-full bg-violet-500" />
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                {result && !loading && (
                  <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    {/* Safety Score */}
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Safety Score</span>
                        <span className={`text-2xl font-black ${safetyScore >= 80 ? 'text-emerald-600' : safetyScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {safetyScore}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${safetyScore}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${safetyScore >= 80 ? 'bg-emerald-500' : safetyScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-2">
                        {safetyScore >= 80 ? 'Safe to prescribe with monitoring' : safetyScore >= 50 ? 'Use with caution — moderate interactions detected' : 'High risk — physician review required'}
                      </p>
                    </div>

                    {/* Physician Review Needed */}
                    {result.physicianReviewNeeded && (
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                        <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-rose-700 uppercase tracking-wider">Physician Review Required</p>
                          <p className="text-xs text-rose-600 font-medium mt-0.5">This combination requires immediate expert evaluation before administration.</p>
                        </div>
                      </div>
                    )}

                    {/* Interactions */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                        Interactions Found ({interactions.length})
                      </h3>
                      {interactions.length === 0 ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                          <p className="text-sm font-bold text-emerald-700">No interactions detected between the specified medications.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {interactions.map((interaction, idx) => {
                            const config = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG.mild;
                            const Icon = config.icon;
                            return (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-3.5 rounded-xl border ${config.bg}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-1.5 rounded-lg bg-white/80 border border-white shrink-0">
                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                                      <span className={`text-[10px] font-black uppercase tracking-wider ${config.color}`}>{config.label}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">
                                      {interaction.drugs?.join(' + ') || 'Interaction'}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5">{interaction.description || interaction.effect}</p>
                                    {interaction.recommendation && (
                                      <p className="text-xs font-bold text-slate-500 mt-1.5">Recommendation: {interaction.recommendation}</p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Alternatives */}
                    {result.alternatives?.length > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Recommended Alternatives
                        </h3>
                        <ul className="space-y-1">
                          {result.alternatives.map((alt, i) => (
                            <li key={i} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
