import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import agentService from '../services/agentService';
import {
  Upload, FileText, Image, Scan, CheckCircle, AlertCircle, Clock,
  Pill, User, Calendar, Activity,
} from 'lucide-react';

const DOCUMENT_TYPES = [
  { id: 'prescription', label: 'Prescription', icon: Pill, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-200' },
  { id: 'lab_report', label: 'Lab Report', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { id: 'discharge_summary', label: 'Discharge Summary', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'other', label: 'Other Document', icon: Image, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
];

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Completed' },
  processing: { icon: Scan, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  failed: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Failed' },
};

function extractMedications(text) {
  if (!text) return [];
  const patterns = [
    ...text.matchAll(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*-\s*(\d+\s*(?:mg|mcg|g|ml|IU|tablet|capsule|drop|puff)s?)/g),
    ...text.matchAll(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(\d+\s*(?:mg|mcg|g|ml|IU))/g),
  ];
  return patterns.map(m => ({ name: m[1].trim(), dosage: m[2].trim() }));
}

function extractPatientInfo(text) {
  if (!text) return {};
  const nameMatch = text.match(/(?:Patient\s*(?:Name|name|:)?\s*[:.]?\s*)([A-Za-z\s]+)/);
  const ageMatch = text.match(/(\d+)\s*(?:years?|Y\/O|y\/o|yr)/i);
  const dateMatch = text.match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/);
  return {
    name: nameMatch?.[1]?.trim() || '',
    age: ageMatch?.[1] || '',
    date: dateMatch?.[1] || '',
  };
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export default function MedicalRecordsPage() {
  const [uploading, setUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('prescription');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mediflow_ocr_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { }
  }, []);

  const saveHistory = (entries) => {
    setHistory(entries);
    try { localStorage.setItem('mediflow_ocr_history', JSON.stringify(entries)); } catch { }
  };

  const handleFile = async (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF, JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit. Please upload a smaller file.');
      return;
    }
    setError(null);
    setOcrResult(null);
    setSummaryResult(null);
    setUploading(true);

    const pendingEntry = {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      type: selectedDocType,
      status: 'processing',
      date: new Date().toISOString(),
    };

    const updated = [pendingEntry, ...history];
    saveHistory(updated);

    try {
      const data = await agentService.ocr(file);

      const result = {
        rawText: data.text || data.rawText || '',
        medications: data.medications || extractMedications(data.text || data.rawText || ''),
        patientInfo: data.patientInfo || extractPatientInfo(data.text || data.rawText || ''),
        diagnosis: data.diagnosis || '',
        doctorName: data.doctorName || '',
        confidence: data.confidence || 0,
        structured: data.structured || data.parsed || null,
      };

      setOcrResult(result);

      const completed = updated.map(e =>
        e.id === pendingEntry.id
          ? { ...e, status: 'completed', ocrData: result }
          : e
      );
      saveHistory(completed);
    } catch (err) {
      const failed = updated.map(e =>
        e.id === pendingEntry.id ? { ...e, status: 'failed', error: err.message } : e
      );
      saveHistory(failed);
      setError(err?.response?.data?.message || err.message || 'OCR processing failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleGenerateSummary = async () => {
    if (!ocrResult) return;
    setSummaryLoading(true);
    setSummaryResult(null);
    try {
      const data = await agentService.medicalSummary({
        text: ocrResult.rawText,
        medications: ocrResult.medications,
        patientInfo: ocrResult.patientInfo,
        diagnosis: ocrResult.diagnosis,
      });
      setSummaryResult(data.summary || data.text || data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to generate medical summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const clearHistory = () => saveHistory([]);

  const getDocTypeConfig = (typeId) => DOCUMENT_TYPES.find(d => d.id === typeId) || DOCUMENT_TYPES[3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      <Navbar />

      <div className="relative px-4 pb-32 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Background decorations */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Medical Records
              </h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                Upload prescriptions, lab reports, and discharge summaries for intelligent OCR extraction
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all"
              >
                Clear History
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">

          {/* Left Column - Upload & Controls */}
          <div className="lg:col-span-3 space-y-6">

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Upload Document</h2>

                {/* Document Type Selector */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {DOCUMENT_TYPES.map(dt => {
                    const active = selectedDocType === dt.id;
                    return (
                      <button
                        key={dt.id}
                        onClick={() => setSelectedDocType(dt.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${active
                            ? `${dt.bg} ${dt.color} shadow-sm`
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <dt.icon className="w-3.5 h-3.5" />
                        {dt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all ${dragOver
                      ? 'border-emerald-400 bg-emerald-50/60 scale-[1.01]'
                      : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                  <motion.div
                    animate={uploading ? { rotate: 360 } : { rotate: 0 }}
                    transition={uploading ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200/60"
                  >
                    <Upload className={`w-7 h-7 ${uploading ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </motion.div>
                  <p className="text-base font-bold text-slate-700">
                    {uploading ? 'Processing document...' : 'Drop your file here or click to browse'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    Supports PDF, JPEG, PNG, WebP &middot; Max 15MB
                  </p>
                </div>

                {/* Selected file info */}
                {uploading && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <Scan className="w-5 h-5 text-blue-500 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">Extracting text with AI...</p>
                      <div className="mt-1 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-rose-700">Processing Error</p>
                        <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                        <button
                          onClick={() => setError(null)}
                          className="mt-2 text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* OCR Result Card (skeleton + loaded) */}
            <AnimatePresence mode="wait">
              {ocrResult && (
                <motion.div
                  key="ocr-result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                          <Scan className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Extracted Data</h3>
                          {ocrResult.confidence > 0 && (
                            <p className="text-xs text-slate-400 font-medium">
                              Confidence: {Math.round(ocrResult.confidence * 100)}%
                            </p>
                          )}
                        </div>
                      </div>
                      {ocrResult.rawText && (
                        <button
                          onClick={() => navigator.clipboard.writeText(ocrResult.rawText)}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors"
                        >
                          Copy Text
                        </button>
                      )}
                    </div>

                    {/* Patient Info */}
                    {(ocrResult.patientInfo?.name || ocrResult.patientInfo?.age) && (
                      <div className="flex flex-wrap gap-3 mb-5">
                        {ocrResult.patientInfo.name && (
                          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{ocrResult.patientInfo.name}</span>
                          </div>
                        )}
                        {ocrResult.patientInfo.age && (
                          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{ocrResult.patientInfo.age} yrs</span>
                          </div>
                        )}
                        {ocrResult.patientInfo.date && (
                          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{ocrResult.patientInfo.date}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Diagnosis */}
                    {ocrResult.diagnosis && (
                      <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">Diagnosis</p>
                        <p className="text-sm font-semibold text-slate-800">{ocrResult.diagnosis}</p>
                      </div>
                    )}

                    {/* Medications */}
                    {ocrResult.medications?.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Medications</p>
                        <div className="grid gap-2">
                          {ocrResult.medications.map((med, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm"
                            >
                              <div className="p-1.5 bg-violet-50 rounded-lg border border-violet-200">
                                <Pill className="w-4 h-4 text-violet-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800">{med.name}</p>
                                {med.dosage && (
                                  <p className="text-xs text-slate-500 font-medium">{med.dosage}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Doctor name */}
                    {ocrResult.doctorName && (
                      <div className="mb-5 flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">Dr. {ocrResult.doctorName}</span>
                      </div>
                    )}

                    {/* Raw text (collapsible) */}
                    {ocrResult.rawText && (
                      <details className="group">
                        <summary className="text-xs font-black uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 transition-colors list-none flex items-center gap-2">
                          <span>Raw Extracted Text</span>
                          <span className="text-[10px] text-slate-300 group-open:rotate-180 transition-transform">&#9660;</span>
                        </summary>
                        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                          <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                            {ocrResult.rawText}
                          </pre>
                        </div>
                      </details>
                    )}

                    {/* Structured data fallback */}
                    {ocrResult.structured && (
                      <div className="mt-5 pt-5 border-t border-slate-200">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Structured Fields</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(ocrResult.structured).map(([key, val]) => (
                            <div key={key} className="p-2.5 bg-white border border-slate-200 rounded-xl">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{key}</p>
                              <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{String(val)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generate Summary Button */}
                    <div className="mt-6 pt-5 border-t border-slate-200">
                      <button
                        onClick={handleGenerateSummary}
                        disabled={summaryLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-emerald-200/60 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl hover:shadow-emerald-200/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {summaryLoading ? (
                          <>
                            <Scan className="w-4 h-4 animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Generate Medical Summary
                          </>
                        )}
                      </button>
                    </div>

                    {/* Summary Result */}
                    <AnimatePresence>
                      {summaryResult && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">AI Medical Summary</p>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {typeof summaryResult === 'string' ? summaryResult : summaryResult.text || JSON.stringify(summaryResult)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state when no OCR result */}
            {!ocrResult && !uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-10 sm:p-14 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl flex items-center justify-center border border-slate-200">
                  <FileText className="w-9 h-9 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-wide">No Document Processed</h3>
                <p className="mt-1.5 text-sm text-slate-400 font-medium max-w-md mx-auto">
                  Upload a medical document above to extract medications, patient details, and generate an AI summary.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 lg:sticky lg:top-28"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">History</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{history.length}</span>
              </div>

              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <Clock className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No uploads yet</p>
                  <p className="text-xs text-slate-300 mt-1">Your processed documents will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 -mr-1">
                  {history.map((entry, idx) => {
                    const dt = getDocTypeConfig(entry.type);
                    const st = STATUS_CONFIG[entry.status] || STATUS_CONFIG.processing;
                    const StIcon = st.icon;
                    const DtIcon = dt.icon;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group relative p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${dt.bg}`}>
                            <DtIcon className={`w-4 h-4 ${dt.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">
                                  {entry.fileName}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                  {formatDate(entry.date)}
                                </p>
                              </div>
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg shrink-0 ${st.bg}`}>
                                <StIcon className={`w-3 h-3 ${st.color}`} />
                                <span className={`text-[9px] font-black uppercase tracking-wider ${st.color}`}>
                                  {st.label}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {dt.label}
                              </span>
                              <span className="text-slate-200">|</span>
                              <span className="text-[10px] text-slate-400">
                                {(entry.fileSize / 1024 / 1024).toFixed(1)} MB
                              </span>
                            </div>

                            {/* Quick view of extracted data */}
                            {entry.ocrData?.medications?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {entry.ocrData.medications.slice(0, 3).map((m, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 rounded-lg text-[9px] font-bold text-violet-600"
                                  >
                                    <Pill className="w-2.5 h-2.5" />
                                    {m.name}
                                  </span>
                                ))}
                                {entry.ocrData.medications.length > 3 && (
                                  <span className="text-[9px] font-bold text-slate-400 pl-1">
                                    +{entry.ocrData.medications.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
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
