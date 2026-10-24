/**
 * Wrapper around the Google Gemini generative AI endpoint.
 * Expects env variables:
 *   AI_ENDPOINT – base URL (without ?key=…), e.g.
 *       https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
 *   AI_API_KEY – your Gemini API key.
 */
export async function callAI(prompt: string): Promise<string> {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_AI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  let endpoint =
    process.env.AI_ENDPOINT ||
    process.env.NEXT_PUBLIC_AI_ENDPOINT ||
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  if (endpoint.includes('gemini-3.8')) {
    endpoint = endpoint.replace('gemini-3.8-flash', 'gemini-1.5-flash');
  }

  if (!apiKey) {
    throw new Error(
      'AI credentials missing. Set AI_API_KEY or GEMINI_API_KEY in Vercel Environment Variables, then redeploy.'
    );
  }

  // Gemini expects the key as a query parameter
  const url = `${endpoint}?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Gemini API error:', res.status, errText);

    // Try to extract a useful message from the error
    let detail = `AI service error (${res.status})`;
    try {
      const errJson = JSON.parse(errText);
      detail = errJson?.error?.message || detail;
    } catch {
      // use default detail
    }
    throw new Error(detail);
  }

  const data = await res.json();

  // Gemini response shape: { candidates: [{ content: { parts: [{ text }] } }] }
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    throw new Error('Empty response from AI service.');
  }

  return text;
}
