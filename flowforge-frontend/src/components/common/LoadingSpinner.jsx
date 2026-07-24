import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading FlowForge...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px]">
      <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      <span className="text-sm font-medium text-slate-400 tracking-wide">{label}</span>
    </div>
  );
};
