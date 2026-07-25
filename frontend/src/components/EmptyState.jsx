import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = '',
  primaryAction,
  secondaryAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-slate-400" />
      </motion.div>

      <h3 className="text-base font-black text-slate-900 mb-1">{title}</h3>

      {description && (
        <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">{description}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="btn-primary text-xs"
          >
            {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5" />}
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="btn-ghost text-xs"
          >
            {secondaryAction.icon && <secondaryAction.icon className="w-3.5 h-3.5" />}
            {secondaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}
