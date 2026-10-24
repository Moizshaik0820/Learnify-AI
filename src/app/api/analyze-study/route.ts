import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/analyze-study
 * Accepts JSON { text } or multipart form with file upload.
 * Extracts text and detects CSS concepts, returning matching site topics.
 */

const CSS_TOPIC_MAPPINGS = [
  { keyword: 'selector', worldId: 1, levelId: 1, title: 'The Castle Gate: Element Selectors', concept: 'Element Selectors' },
  { keyword: 'class', worldId: 1, levelId: 2, title: 'Stone Walls: Class Selectors', concept: 'Class Selectors' },
  { keyword: 'id selector', worldId: 1, levelId: 3, title: 'The Royal Keep: ID Selectors', concept: 'ID Selectors' },
  { keyword: 'grouping', worldId: 1, levelId: 4, title: 'Twin Towers: Grouping Selectors', concept: 'Grouping Selectors' },
  { keyword: 'universal', worldId: 1, levelId: 5, title: 'Castle Atmosphere: Universal Selector', concept: 'Universal Selector' },
  { keyword: 'hex', worldId: 1, levelId: 6, title: 'Royal Spires: Hex Colors', concept: 'Hex Colors' },
  { keyword: 'rgb', worldId: 1, levelId: 7, title: 'Castle Moat: RGB Colors', concept: 'RGB Colors' },
  { keyword: 'hsl', worldId: 1, levelId: 8, title: 'Magical Glow: HSL Colors', concept: 'HSL Colors' },
  { keyword: 'pixel', worldId: 1, levelId: 9, title: 'Fortress Foundation: Pixel Heights', concept: 'Pixel Units' },
  { keyword: 'em unit', worldId: 1, levelId: 10, title: 'Castle Embrasures: Relative EM Units', concept: 'EM Units' },
  { keyword: 'rem', worldId: 1, levelId: 11, title: 'Royal Throne Room: REM Units', concept: 'REM Units' },
  { keyword: 'percent', worldId: 1, levelId: 12, title: 'The Outer Courtyard: Percentages', concept: 'Percentage Units' },
  { keyword: 'cascade', worldId: 1, levelId: 13, title: 'The Cascade Law: Order Matters', concept: 'CSS Cascade' },
  { keyword: 'specificity', worldId: 1, levelId: 14, title: 'Specificity Battle: Classes vs IDs', concept: 'Specificity' },
  { keyword: 'important', worldId: 1, levelId: 15, title: 'The Emergency Seal: !important', concept: '!important Rule' },
  { keyword: 'inherit', worldId: 1, levelId: 16, title: 'Royal Bloodline: CSS Inheritance', concept: 'CSS Inheritance' },
  { keyword: 'comment', worldId: 1, levelId: 17, title: "Architect's Notes: CSS Comments", concept: 'CSS Comments' },
  { keyword: 'box model', worldId: 1, levelId: 18, title: 'Box Model 1: Width and Height', concept: 'Box Model' },
  { keyword: 'padding', worldId: 1, levelId: 19, title: 'Box Model 2: Chamber Padding', concept: 'Box Model Padding' },
  { keyword: 'border', worldId: 1, levelId: 20, title: 'Box Model 3: Fortified Borders', concept: 'Box Model Border' },
  { keyword: 'margin', worldId: 1, levelId: 21, title: 'Box Model 4: Drawbridge Margin', concept: 'Box Model Margin' },
  { keyword: 'box-sizing', worldId: 1, levelId: 22, title: 'Mastering the Box: box-sizing', concept: 'Box Sizing' },
  { keyword: 'font-family', worldId: 2, levelId: 1, title: 'Royal Inscription: Font Family', concept: 'Font Family' },
  { keyword: 'font-size', worldId: 2, levelId: 2, title: 'Grand Proclamation: Font Size', concept: 'Font Size' },
  { keyword: 'font-weight', worldId: 2, levelId: 3, title: 'Iron Inscription: Font Weight', concept: 'Font Weight' },
  { keyword: 'font', worldId: 2, levelId: 1, title: 'Royal Inscription: Font Family', concept: 'Typography' },
  { keyword: 'typography', worldId: 2, levelId: 2, title: 'Grand Proclamation: Font Size', concept: 'Typography' },
  { keyword: 'color', worldId: 1, levelId: 6, title: 'Royal Spires: Hex Colors', concept: 'CSS Colors' },
  { keyword: 'gradient', worldId: 2, levelId: 15, title: 'Sunset Ramparts: Linear Gradients', concept: 'Gradients' },
  { keyword: 'border-radius', worldId: 2, levelId: 11, title: 'Rounded Archways: Border Radius', concept: 'Border Radius' },
  { keyword: 'flex', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex', concept: 'Flexbox' },
  { keyword: 'flexbox', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex', concept: 'Flexbox' },
  { keyword: 'justify-content', worldId: 3, levelId: 14, title: 'Spaced Ramparts: justify-content', concept: 'Flexbox Alignment' },
  { keyword: 'align-items', worldId: 3, levelId: 15, title: 'Royal Centering: align-items', concept: 'Flexbox Alignment' },
  { keyword: 'grid', worldId: 3, levelId: 20, title: 'Fortress Matrix: display: grid', concept: 'CSS Grid' },
  { keyword: 'position', worldId: 3, levelId: 4, title: 'Tower Shift: position: relative', concept: 'CSS Position' },
  { keyword: 'display', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex', concept: 'Display Property' },
  { keyword: 'responsive', worldId: 4, levelId: 6, title: 'Adaptive Portcullis: Media Queries', concept: 'Responsive Design' },
  { keyword: 'media query', worldId: 4, levelId: 6, title: 'Adaptive Portcullis: Media Queries', concept: 'Media Queries' },
  { keyword: 'clamp', worldId: 4, levelId: 3, title: 'Fluid Gates: clamp()', concept: 'CSS Functions' },
  { keyword: 'shadow', worldId: 5, levelId: 1, title: 'Shadow of the Keep: box-shadow', concept: 'Box Shadow' },
  { keyword: 'filter', worldId: 5, levelId: 4, title: 'Magical Mist: filter blur()', concept: 'CSS Filters' },
  { keyword: 'transform', worldId: 5, levelId: 9, title: 'Drawbridge Elevation: transform', concept: 'CSS Transforms' },
  { keyword: 'transition', worldId: 6, levelId: 1, title: 'Smooth Drawbridge: transition', concept: 'CSS Transitions' },
  { keyword: 'animation', worldId: 6, levelId: 5, title: 'Flag in the Wind: @keyframes', concept: 'CSS Animations' },
  { keyword: 'keyframe', worldId: 6, levelId: 5, title: 'Flag in the Wind: @keyframes', concept: 'CSS Keyframes' },
  { keyword: 'css', worldId: 1, levelId: 1, title: 'The Castle Gate: Element Selectors', concept: 'CSS Basics' },
  { keyword: 'style', worldId: 1, levelId: 1, title: 'The Castle Gate: Element Selectors', concept: 'CSS Styling' },
  { keyword: 'layout', worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex', concept: 'Layout' },
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
          const pdfParse = (await import('pdf-parse')).default;
          const data = await pdfParse(buffer);
          extractedText = data.text;
        } catch {
          return NextResponse.json(
            { error: 'The PDF could not be read. Please paste the text directly.' },
            { status: 422 }
          );
        }
      } else {
        extractedText = buffer.toString('utf-8');
      }
    } else {
      const body = await req.json();
      extractedText = body.text || '';
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No readable text could be extracted.' },
        { status: 400 }
      );
    }

    // Detect concepts from text
    const lower = extractedText.toLowerCase();
    const detectedConcepts: string[] = [];
    const recommendations: { worldId: number; levelId: number; title: string; concept: string }[] = [];

    for (const mapping of CSS_TOPIC_MAPPINGS) {
      if (lower.includes(mapping.keyword)) {
        if (!detectedConcepts.includes(mapping.concept)) {
          detectedConcepts.push(mapping.concept);
        }
        const key = `${mapping.worldId}-${mapping.levelId}`;
        if (!recommendations.some((r) => `${r.worldId}-${r.levelId}` === key)) {
          recommendations.push({
            worldId: mapping.worldId,
            levelId: mapping.levelId,
            title: mapping.title,
            concept: mapping.concept,
          });
        }
      }
    }

    // Default recommendations if nothing matched
    if (recommendations.length === 0) {
      recommendations.push(
        { worldId: 1, levelId: 1, title: 'The Castle Gate: Element Selectors', concept: 'CSS Basics' },
        { worldId: 2, levelId: 1, title: 'Royal Inscription: Font Family', concept: 'Typography' },
        { worldId: 3, levelId: 12, title: 'Drawbridge Mechanism: display: flex', concept: 'Flexbox' }
      );
      detectedConcepts.push('CSS Basics', 'Typography', 'Flexbox');
    }

    return NextResponse.json({
      success: true,
      extractedText: extractedText.slice(0, 5000),
      detectedConcepts,
      recommendations: recommendations.slice(0, 8),
    });
  } catch (error: any) {
    console.error('Analyze study error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error analyzing material.' },
      { status: 500 }
    );
  }
}
