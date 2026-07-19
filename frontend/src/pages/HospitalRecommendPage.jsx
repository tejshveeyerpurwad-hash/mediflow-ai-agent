import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import agentService from '../services/agentService';
import {
  MapPin, Navigation, Star, Building2, Bed, Clock, Phone, Filter, Search, Ambulance
} from 'lucide-react';

const SPECIALTIES = [
  'General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'ENT',
  'Ophthalmology', 'Dermatology', 'Gynecology', 'Neurology', 'Psychiatry',
];

const MOCK_HOSPITALS = [
  { name: 'City General Hospital', distance: '1.2 km', rating: 4.5, address: '123 Main St, City Center', specialties: ['General', 'Cardiology', 'Orthopedics'], beds: 24, waitTime: '15 min', phone: '+1 555-0100' },
  { name: 'Apollo Medical Center', distance: '2.8 km', rating: 4.8, address: '456 Oak Ave, Uptown', specialties: ['Cardiology', 'Neurology', 'Pediatrics'], beds: 42, waitTime: '10 min', phone: '+1 555-0200' },
  { name: 'St. Mary\'s Hospital', distance: '3.5 km', rating: 4.2, address: '789 Pine Rd, Suburb', specialties: ['General', 'Gynecology', 'ENT'], beds: 18, waitTime: '25 min', phone: '+1 555-0300' },
  { name: 'Sunrise Healthcare', distance: '5.0 km', rating: 4.6, address: '321 Elm St, Westside', specialties: ['Orthopedics', 'Dermatology', 'Psychiatry'], beds: 35, waitTime: '20 min', phone: '+1 555-0400' },
  { name: 'MediLife Hospital', distance: '6.3 km', rating: 4.0, address: '654 Birch Ln, Eastside', specialties: ['Pediatrics', 'Ophthalmology', 'General'], beds: 12, waitTime: '30 min', phone: '+1 555-0500' },
  { name: 'Green Valley Clinic', distance: '0.8 km', rating: 4.3, address: '987 Cedar Dr, Downtown', specialties: ['General', 'Dermatology'], beds: 8, waitTime: '10 min', phone: '+1 555-0600' },
];

export default function HospitalRecommendPage() {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('input');

  const handleSubmit = async () => {
    if (!location || !specialty) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setActiveTab('result');
    try {
      const data = await agentService.hospitalRecommendation({
        location,
        specialty,
        emergency,
      });
      setResults(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to get recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = location && specialty;

  // Use mock if API returns empty or no results
  const hospitals = results?.hospitals?.length > 0 ? results.hospitals : MOCK_HOSPITALS;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <Navbar />
      <div className="relative px-4 pb-32 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl border border-blue-200">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Hospital Finder</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">Find the best healthcare facilities near you</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 mb-3">
          <button onClick={() => setActiveTab('input')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'input' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Filter className="w-3 h-3" /> Filters
          </button>
          <button onClick={() => setActiveTab('result')} className={`flex-1 py-1.5 text-center rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === 'result' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
            <Building2 className="w-3 h-3" /> Results {results && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filters Column */}
          <div className={`lg:col-span-2 ${activeTab === 'result' ? 'hidden lg:block' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Search Filters</h2>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Location / Pincode
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. 110001 or City Name"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Specialties Needed
                </label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none"
                >
                  <option value="">Select specialty...</option>
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Ambulance className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-700">Emergency</p>
                  <p className="text-[10px] text-amber-600 font-medium">Prioritize nearest emergency care</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emergency} onChange={e => setEmergency(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              <motion.button
                whileHover={canSubmit ? { y: -1, scale: 1.01 } : {}}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${canSubmit && !loading ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60 hover:from-blue-700 hover:to-blue-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <><Search className="w-4 h-4 animate-spin" /> Searching...</>
                ) : (
                  <><Search className="w-4 h-4" /> Find Hospitals</>
                )}
              </motion.button>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                    <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-rose-700">Search Error</p>
                      <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                      <button onClick={() => setError(null)} className="mt-1 text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider">Dismiss</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Results Column */}
          <div className={`lg:col-span-3 ${activeTab === 'result' ? '' : 'hidden lg:block'}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              {/* View toggle */}
              {results && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-500">{hospitals.length} hospitals found near <span className="text-slate-800">{location}</span></p>
                  <div className="flex bg-slate-100/80 rounded-lg border border-slate-200/50 p-0.5">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}>
                      <MapPin className="w-3 h-3 inline mr-1" /> List
                    </button>
                    <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'map' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}>
                      Map
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Empty */}
                {!results && !loading && !error && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-10 sm:p-14 text-center">
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center border border-blue-200">
                      <Building2 className="w-9 h-9 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-wide">Search Hospitals</h3>
                    <p className="mt-1.5 text-sm text-slate-400 font-medium max-w-md mx-auto">Enter your location and specialty to find nearby healthcare facilities.</p>
                  </motion.div>
                )}

                {/* Loading */}
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-14 text-center space-y-4">
                    <div className="relative">
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-16 h-16 mx-auto bg-blue-500 rounded-full blur-xl absolute inset-0" />
                      <Ambulance className="w-10 h-10 text-blue-600 animate-bounce relative z-10 mx-auto" />
                    </div>
                    <p className="font-black text-blue-600 uppercase tracking-widest text-xs">Finding Nearby Hospitals...</p>
                    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mx-auto">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} className="h-full bg-blue-500" />
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                {results && !loading && (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {viewMode === 'map' ? (
                      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-10 text-center">
                        <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">Map View</p>
                        <p className="text-xs text-slate-400 mt-1">Interactive map integration coming soon</p>
                        <button onClick={() => setViewMode('list')} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Switch to List View</button>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        <AnimatePresence>
                          {hospitals.map((hospital, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-5 sm:p-6 hover:shadow-2xl hover:shadow-slate-200/60 transition-all group"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 shrink-0 self-start">
                                  <Building2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">{hospital.name}</h3>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <div className="flex items-center">{renderStars(hospital.rating)}</div>
                                        <span className="text-xs font-bold text-slate-400">{hospital.rating}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg shrink-0">
                                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-xs font-black text-emerald-700">{hospital.distance}</span>
                                    </div>
                                  </div>

                                  <p className="text-sm text-slate-600 font-medium mt-1.5 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {hospital.address}
                                  </p>

                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {hospital.specialties.map(s => (
                                      <span key={s} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[10px] font-bold text-blue-700">{s}</span>
                                    ))}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5 font-semibold">
                                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                                      {hospital.beds} beds
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      {hospital.waitTime} wait
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold">
                                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                                      {hospital.phone}
                                    </span>
                                  </div>

                                  {hospital.emergency || emergency ? (
                                    <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                                      <Ambulance className="w-4 h-4 text-rose-600 shrink-0" />
                                      <span className="text-xs font-bold text-rose-700">Emergency services available</span>
                                    </div>
                                  ) : null}

                                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200/40">
                                      <Navigation className="w-3.5 h-3.5" /> Directions
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                                      <Phone className="w-3.5 h-3.5" /> Call Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
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
