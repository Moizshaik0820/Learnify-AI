import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  concepts: string[];
  onCreate: (topic: string, level: string, style: string) => void;
}

export const LearningPathSetup: React.FC<Props> = ({ concepts, onCreate }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [style, setStyle] = useState('Step-by-step lessons');

  const topics = Array.from(new Set(concepts));

  const handleSubmit = () => {
    const topic = selectedTopic || customTopic.trim();
    if (!topic) return;
    onCreate(topic, level, style);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-navy-800">Create a Learning Path</h2>

      {/* Topic selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select a topic</label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">-- choose from detected concepts --</option>
          {topics.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Custom topic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Or type a custom topic</label>
        <input
          type="text"
          placeholder="e.g., CSS Grid Layout"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Level selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Learning style */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">Learning Style</span>
        <div className="flex flex-col gap-2">
          {['Step-by-step lessons', 'Examples and demonstrations', 'Practice questions', 'Exam preparation'].map((s) => (
            <label key={s} className="inline-flex items-center">
              <input
                type="radio"
                name="style"
                value={s}
                checked={style === s}
                onChange={() => setStyle(s)}
                className="mr-2"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded"
      >
        Create My Learning Path
      </button>
    </div>
  );
};
