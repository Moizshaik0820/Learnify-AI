import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/aiService';

/**
 * POST /api/summarize
 * Body: { text: string }
 * Uses Gemini to return a structured summary.
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const prompt = `You are an expert study assistant. Analyze and summarize the following study material.

Return your response as a valid JSON object (no markdown fences) with these fields:
{
  "overview": "A concise 2-3 sentence overview of the material",
  "keyPoints": ["point 1", "point 2", ...],
  "concepts": ["concept 1", "concept 2", ...],
  "detailedSummary": "A thorough paragraph summarizing the content in detail",
  "studyTips": ["tip 1", "tip 2", ...]
}

Material:
${text.slice(0, 8000)}`;

    const aiResponse = await callAI(prompt);

    // Try to parse JSON from response – Gemini sometimes wraps in ```json ... ```
    let summaryObj: any = {};
    try {
      // Strip markdown code fences if present
      const cleaned = aiResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      summaryObj = JSON.parse(cleaned);
    } catch {
      // Fallback: treat whole response as the overview
      summaryObj = {
        overview: aiResponse,
        keyPoints: [],
        concepts: [],
        detailedSummary: '',
        studyTips: [],
      };
    }

    return NextResponse.json({ success: true, summary: summaryObj });
  } catch (err: any) {
    console.error('Summarize API error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
