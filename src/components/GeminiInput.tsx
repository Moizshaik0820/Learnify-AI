import React, { useState, useRef, KeyboardEvent } from 'react';
import { Plus, ArrowUp } from 'lucide-react';
import { UploadMenu } from './UploadMenu';
import { AttachmentPreview } from './AttachmentPreview';

interface FileAttachment {
  file: File;
  progress?: number; // 0‑100
}

export const GeminiInput = ({
  onSubmit,
}: {
  onSubmit: (text: string, attachments: File[]) => Promise<void>;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const newAtts: FileAttachment[] = [];
    Array.from(files).forEach((f) => {
      // basic validation – only pdf/txt/docx, ≤10 MB
      if (!f.name.match(/\.(pdf|txt|docx)$/i)) return;
      if (f.size > 10 * 1024 * 1024) return;
      newAtts.push({ file: f, progress: 0 });
    });
    setAttachments((prev) => [...prev, ...newAtts]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!text.trim() && attachments.length === 0) return;
    await onSubmit(text, attachments.map((a) => a.file));
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-start space-x-3">
        {/* + button */}
        <button
          type="button"
          onClick={() => setShowMenu(true)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Upload your material or paste your study notes here..."
          className="flex-1 min-h-[80px] p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white resize-none"
        />
        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att, i) => (
            <AttachmentPreview
              key={i}
              file={att.file}
              progress={att.progress}
              onRemove={() => removeAttachment(i)}
            />
          ))}
        </div>
      )}

      {/* Upload menu modal */}
      {showMenu && (
        <UploadMenu
          onClose={() => setShowMenu(false)}
          onAddFiles={addFiles}
        />
      )}
    </div>
  );
};
