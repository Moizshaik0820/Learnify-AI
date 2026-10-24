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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-navy-800">Add Material</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => handleSelect('.pdf', false)}
          className="w-full flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-50 border border-gray-200"
        >
          <Upload className="w-5 h-5 text-purple-600" />
          <span>Upload PDF</span>
        </button>
        <button
          onClick={() => handleSelect('.pdf,.txt,.docx', true)}
          className="w-full flex items-center space-x-2 py-2 px-3 rounded-md mt-2 hover:bg-gray-50 border border-gray-200"
        >
          <Upload className="w-5 h-5 text-purple-600" />
          <span>Upload Files</span>
        </button>
        <button
          onClick={() => handleSelect('.txt,.docx', true)}
          className="w-full flex items-center space-x-2 py-2 px-3 rounded-md mt-2 hover:bg-gray-50 border border-gray-200"
        >
          <FileText className="w-5 h-5 text-purple-600" />
          <span>Paste Study Notes (text file)</span>
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
