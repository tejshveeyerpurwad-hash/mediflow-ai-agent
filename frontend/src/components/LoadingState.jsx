import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = 'Loading...',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center py-20 px-4 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-emerald-500 mb-4"
      />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {message}
      </p>
    </motion.div>
  );
}
