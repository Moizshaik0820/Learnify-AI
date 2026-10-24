import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/aiService';
import { extractTextFromRequest } from '@/lib/extract';

/**
 * POST /api/learning-path
 * Body: { topic, level, style, sourceText }
 * Returns an array of lesson objects.
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, level, style, sourceText } = await req.json();
    if (!topic || !level || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const prompt = `You are an expert curriculum designer.
Create a learning path for the topic "${topic}" at a ${level.toLowerCase()} level.
Use the following learning style: ${style}.
Base the content on this source material (excerpt):\n\n${sourceText}\n\nReturn a JSON array named "lessons" where each lesson has:
- title (string)
- content (concise explanation, max 2 paragraphs)
- exercise (optional short practice question or task)\nProvide at least 5 lessons.`;

    const aiResponse = await callAI(prompt);
    let lessons = [];
    try {
      const parsed = JSON.parse(aiResponse);
      lessons = parsed.lessons || [];
    } catch {
      // fallback: treat whole response as one lesson placeholder
      lessons = [{ title: topic, content: aiResponse }];
    }
    return NextResponse.json({ success: true, lessons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
