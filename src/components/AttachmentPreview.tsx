import React from 'react';
import { X } from 'lucide-react';

interface Props {
  file: File;
  progress?: number; // 0-100
  onRemove: () => void;
}

export const AttachmentPreview: React.FC<Props> = ({ file, progress = 0, onRemove }) => {
  const fileType = file.name.split('.').pop()?.toUpperCase() || 'FILE';
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-[#334155] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 dark:text-[#F1F5F9] truncate">
          {file.name}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-[#94A3B8]">{fileType}</p>
      </div>
      {progress > 0 && progress < 100 && (
        <div className="w-20 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3B82F6] dark:bg-[#60A5FA]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400"
        title="Remove"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
