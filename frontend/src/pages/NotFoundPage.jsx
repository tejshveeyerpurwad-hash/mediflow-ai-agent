import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SearchX, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
        >
          <SearchX className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black text-slate-900 tracking-tight mb-2"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-bold text-slate-500 mb-8"
        >
          This page doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary text-xs"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
