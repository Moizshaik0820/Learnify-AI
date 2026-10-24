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
    <div className="max-w-3xl mx-auto bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-200 dark:border-[#334155] p-6 shadow-sm space-y-4 transition-colors">
      <div className="flex items-start space-x-3">
        {/* + button */}
        <button
          type="button"
          onClick={() => setShowMenu(true)}
          className="p-2 rounded-xl bg-gray-50 dark:bg-[#111827] hover:bg-gray-100 dark:hover:bg-[#162032] border border-gray-200 dark:border-[#334155] transition"
          aria-label="Add attachment"
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-[#CBD5E1]" />
        </button>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Upload your material or paste your study notes here..."
          className="flex-1 min-h-[80px] p-3 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-[#334155] text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#94A3B8] rounded-2xl focus:outline-none focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:bg-white dark:focus:bg-[#111827] resize-none transition"
        />
        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className="p-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Send notes for analysis"
        >
          <ArrowUp className="w-5 h-5 text-white dark:text-[#0F172A]" />
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
