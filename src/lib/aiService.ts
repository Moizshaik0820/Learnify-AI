/**
 * Wrapper around the Google Gemini generative AI endpoint.
 * Expects env variables:
 *   AI_ENDPOINT – base URL (without ?key=…), e.g.
 *       https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent
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
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

  // Replace sunset or deprecated model references (like gemini-1.5-flash or gemini-2.5-flash)
  // with current active models
  if (
    endpoint.includes('gemini-1.5') ||
    endpoint.includes('gemini-2.5') ||
    endpoint.includes('gemini-3.8-flash')
  ) {
    endpoint = endpoint.replace(
      /gemini-(?:1\.5|2\.5|3\.8)-flash/g,
      'gemini-3.5-flash'
    );
  }

  if (!apiKey) {
    throw new Error(
      'AI credentials missing. Set AI_API_KEY or GEMINI_API_KEY in Vercel Environment Variables, then redeploy.'
    );
  }

  const candidateEndpoints = [
    endpoint,
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
  ];

  // Remove duplicates
  const endpointsToTry = Array.from(new Set(candidateEndpoints));

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

  for (const targetEndpoint of endpointsToTry) {
    try {
      const url = `${targetEndpoint}?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Gemini API error for ${targetEndpoint}:`, res.status, errText);

        try {
          const errJson = JSON.parse(errText);
          lastError = errJson?.error?.message || `AI service error (${res.status})`;
        } catch {
          lastError = `AI service error (${res.status})`;
        }
        // If 404 or model not found, continue to next candidate
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        lastError = 'Empty response from AI service.';
        continue;
      }

      return text;
    } catch (err: any) {
      console.error(`Network error calling ${targetEndpoint}:`, err);
      lastError = err?.message || lastError;
    }
  }

  throw new Error(lastError);
}
