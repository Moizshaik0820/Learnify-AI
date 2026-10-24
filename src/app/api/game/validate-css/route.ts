import { NextRequest, NextResponse } from 'next/server';
import { worldsData } from '@/data/worldsData';
import { validateCssSolution } from '@/lib/cssValidator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { worldId, levelId, userCss } = await request.json();

    if (!worldId || !levelId || typeof userCss !== 'string') {
      return NextResponse.json(
        { isValid: false, message: 'Invalid validation request payload.' },
        { status: 400 }
      );
    }

    const world = worldsData.find((w) => w.id === parseInt(worldId, 10));
    if (!world) {
      return NextResponse.json(
        { isValid: false, message: 'Target world not found.' },
        { status: 404 }
      );
    }

    const level = world.levels.find((l) => l.id === parseInt(levelId, 10));
    if (!level) {
      return NextResponse.json(
        { isValid: false, message: 'Target level not found.' },
        { status: 404 }
      );
    }

    // Validate the student's CSS server-side
    const result = validateCssSolution(userCss, level.challenges);

    // Return only necessary validation feedback, never disclosing secret solution code
    return NextResponse.json({
      isValid: result.isValid,
      message: result.message,
      passedChallenges: result.passedChallenges,
    });
  } catch (err: any) {
    return NextResponse.json(
      { isValid: false, message: err.message || 'Validation error' },
      { status: 500 }
    );
  }
}
