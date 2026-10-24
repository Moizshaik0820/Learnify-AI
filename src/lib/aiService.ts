/**
 * Wrapper around the Google Gemini generative AI endpoint.
 * Dynamically cascades through available Gemini models to guarantee
 * compatibility with any Google AI Studio key tier.
 */

const KNOWN_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
];

export async function callAI(prompt: string): Promise<string> {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_AI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      'AI credentials missing. Set AI_API_KEY in Vercel Environment Variables, then redeploy.'
    );
  }

  const cleanKey = apiKey.trim();

  // Collect candidate endpoints
  const endpointsToTry: string[] = [];

  // 1. If user provided a custom AI_ENDPOINT in env, test it first
  // (filtering out known hallucinated model names like gemini-3.8-flash-lite)
  const envEndpoint = (process.env.AI_ENDPOINT || process.env.NEXT_PUBLIC_AI_ENDPOINT || '').trim();
  if (envEndpoint && !envEndpoint.includes('gemini-3.8-flash-lite')) {
    endpointsToTry.push(envEndpoint.split('?')[0]);
  }

  // 2. Add standard production models
  for (const model of KNOWN_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    if (!endpointsToTry.includes(url)) {
      endpointsToTry.push(url);
    }
  }

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

  let lastError = 'AI service error';
  const attemptedErrors: string[] = [];

  for (const targetEndpoint of endpointsToTry) {
    try {
      const url = `${targetEndpoint}?key=${cleanKey}`;
      console.log(`[Learnify AI] Attempting Gemini endpoint: ${targetEndpoint}`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Learnify AI] Endpoint failed (${res.status}): ${targetEndpoint} -> ${errText}`);

        try {
          const errJson = JSON.parse(errText);
          const msg = errJson?.error?.message || `HTTP ${res.status}`;
          lastError = msg;
          attemptedErrors.push(`${targetEndpoint.split('/models/')[1] || targetEndpoint}: ${msg}`);
        } catch {
          lastError = `HTTP ${res.status}`;
          attemptedErrors.push(`${targetEndpoint}: HTTP ${res.status}`);
        }
        // Try next candidate model
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        lastError = 'Empty response received from AI model.';
        continue;
      }

      console.log(`[Learnify AI] Successfully generated content using: ${targetEndpoint}`);
      return text;
    } catch (err: any) {
      console.error(`[Learnify AI] Network failure for ${targetEndpoint}:`, err);
      lastError = err?.message || lastError;
      attemptedErrors.push(`${targetEndpoint}: ${err?.message || 'Network error'}`);
    }
  }

  console.error('[Learnify AI] All Gemini model endpoints failed:', attemptedErrors);
  throw new Error(lastError);
}
