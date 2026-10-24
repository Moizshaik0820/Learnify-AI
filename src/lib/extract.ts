import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';

/**
 * Helper to extract raw text from a request.
 * Supports multipart/form-data with a single file (pdf/txt/docx) or JSON body with `text`.
 * Returns { text: string }.
 */
export async function extractTextFromRequest(req: NextRequest): Promise<{ text: string }> {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file uploaded');
    const buffer = Buffer.from(await file.arrayBuffer());
    if (file.name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      return { text: data.text };
    }
    // txt or docx fallback – treat as UTF‑8 text
    return { text: buffer.toString('utf-8') };
  }
  // JSON body
  const body = await req.json();
  return { text: body.text || '' };
}
