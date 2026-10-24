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
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">{fileType}</p>
      </div>
      {progress > 0 && progress < 100 && (
        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-gray-100"
        title="Remove"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
