import React, { useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';

interface UploadMenuProps {
  onClose: () => void;
  onAddFiles: (files: FileList | File[]) => void;
}

export const UploadMenu: React.FC<UploadMenuProps> = ({ onClose, onAddFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (accept: string, multiple: boolean) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.multiple = multiple;
      fileInputRef.current.click();
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(e.target.files);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-[#334155] p-6 w-80 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">Add Material</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => handleSelect('.pdf', false)}
          className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] transition"
        >
          <Upload className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
          <span>Upload PDF</span>
        </button>
        <button
          onClick={() => handleSelect('.pdf,.txt,.docx', true)}
          className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] transition"
        >
          <Upload className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
          <span>Upload Files</span>
        </button>
        <button
          onClick={() => handleSelect('.txt,.docx', true)}
          className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] transition"
        >
          <FileText className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
          <span>Paste Notes (Text file)</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFiles}
        />
      </div>
    </div>
  );
};
