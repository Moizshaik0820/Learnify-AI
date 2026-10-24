import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Lesson {
  title: string;
  content: string;
  exercise?: string;
}

export const LearningPathView: React.FC<{ lessons: Lesson[] }> = ({ lessons }) => {
  const [index, setIndex] = React.useState(0);

  const lesson = lessons[index];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-navy-800">Lesson {index + 1} of {lessons.length}</h2>
      <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
      <p className="mb-4 whitespace-pre-line">{lesson.content}</p>
      {lesson.exercise && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <strong>Exercise:</strong>
          <p className="mt-1 whitespace-pre-line">{lesson.exercise}</p>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, lessons.length - 1))}
          disabled={index === lessons.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
