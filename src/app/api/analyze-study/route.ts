import { NextRequest, NextResponse } from 'next/server';

const CSS_TOPIC_MAPPINGS = [
  { keyword: 'selector', worldId: 1, levelId: 1, title: 'Element & Class Selectors' },
  { keyword: 'class', worldId: 1, levelId: 2, title: 'Stone Walls: Class Selectors' },
  { keyword: 'id', worldId: 1, levelId: 3, title: 'The Royal Keep: ID Selectors' },
  { keyword: 'box model', worldId: 1, levelId: 18, title: 'Box Model: Content Dimensions' },
  { keyword: 'padding', worldId: 1, levelId: 19, title: 'Chamber Padding' },
  { keyword: 'border', worldId: 1, levelId: 20, title: 'Fortified Borders' },
  { keyword: 'margin', worldId: 1, levelId: 21, title: 'Drawbridge Margin' },
  { keyword: 'box-sizing', worldId: 1, levelId: 22, title: 'box-sizing: border-box' },
  { keyword: 'font', worldId: 2, levelId: 1, title: 'Royal Inscription: Font Family' },
  { keyword: 'typography', worldId: 2, levelId: 2, title: 'Grand Proclamation: Font Size' },
  { keyword: 'color', worldId: 2, levelId: 15, title: 'Sunset Ramparts: Linear Gradients' },
  { keyword: 'gradient', worldId: 2, levelId: 15, title: 'Linear & Radial Gradients' },
  { keyword: 'radius', worldId: 2, levelId: 11, title: 'Rounded Archways: Border Radius' },
  { keyword: 'flex', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex' },
  { keyword: 'flexbox', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex' },
  { keyword: 'justify-content', worldId: 3, levelId: 14, title: 'Spaced Ramparts: justify-content' },
  { keyword: 'align-items', worldId: 3, levelId: 15, title: 'Royal Centering: align-items' },
  { keyword: 'grid', worldId: 3, levelId: 20, title: 'Fortress Matrix: display: grid' },
  { keyword: 'position', worldId: 3, levelId: 4, title: 'Tower Shift: position: relative' },
  { keyword: 'responsive', worldId: 4, levelId: 6, title: 'Adaptive Portcullis: Mobile Breakpoint' },
  { keyword: 'media quer', worldId: 4, levelId: 6, title: 'CSS Media Queries' },
  { keyword: 'clamp', worldId: 4, levelId: 3, title: 'Fluid Gates: clamp()' },
  { keyword: 'shadow', worldId: 5, levelId: 1, title: 'Shadow of the Keep: box-shadow' },
  { keyword: 'filter', worldId: 5, levelId: 4, title: 'Magical Mist: filter blur()' },
  { keyword: 'transform', worldId: 5, levelId: 9, title: 'Drawbridge Elevation: transform' },
  { keyword: 'transition', worldId: 6, levelId: 1, title: 'Smooth Drawbridge: transition' },
  { keyword: 'animation', worldId: 6, levelId: 5, title: 'Flag in the Wind: @keyframes' },
  { keyword: 'keyframe', worldId: 6, levelId: 5, title: 'Flag in the Wind: @keyframes' },
];

export async function POST(req: NextRequest) {
  try {
    let extractedText = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.name.endsWith('.pdf')) {
        try {
          // Dynamic import of pdf-parse to avoid edge runtime issues
          const pdfParse = (await import('pdf-parse')).default;
          const data = await pdfParse(buffer);
          extractedText = data.text;
        } catch (pdfErr) {
          // Scanned or malformed PDF fallback
          return NextResponse.json(
            {
              error:
                'The PDF appears to be a scanned image or unreadable binary. Please paste the text directly into the Text Analyzer.',
            },
            { status: 422 }
          );
        }
      } else {
        // Plain text / txt / docx text fallback
        extractedText = buffer.toString('utf-8');
      }
    } else {
      // JSON body with text
      const body = await req.json();
      extractedText = body.text || '';
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No readable text could be extracted. Please check your document.' },
        { status: 400 }
      );
    }

    // Concept detection
    const lower = extractedText.toLowerCase();
    const detectedConcepts: string[] = [];
    const recommendations: any[] = [];

    for (const mapping of CSS_TOPIC_MAPPINGS) {
      if (lower.includes(mapping.keyword)) {
        if (!detectedConcepts.includes(mapping.keyword)) {
          detectedConcepts.push(mapping.keyword);
        }
        if (!recommendations.some((r) => r.worldId === mapping.worldId && r.levelId === mapping.levelId)) {
          recommendations.push(mapping);
        }
      }
    }

    // Default recommendations if text is general
    if (recommendations.length === 0) {
      recommendations.push(
        { worldId: 1, levelId: 1, title: 'Element & Class Selectors' },
        { worldId: 2, levelId: 1, title: 'Royal Inscription: Font Family' },
        { worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex' }
      );
      detectedConcepts.push('CSS Basics', 'Layout', 'Styling');
    }

    return NextResponse.json({
      success: true,
      textExcerpt: extractedText.slice(0, 300) + '...',
      detectedConcepts,
      recommendations: recommendations.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Study material analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error analyzing study material.' },
      { status: 500 }
    );
  }
}
