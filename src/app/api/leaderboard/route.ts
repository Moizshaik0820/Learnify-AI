import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { calculateLevelAndProgress, getAvatarInitials } from '@/lib/levelSystem';

export const dynamic = 'force-dynamic';

export interface LeaderboardItem {
  id: string;
  rank: number;
  username: string;
  avatarInitials: string;
  totalXp: number;
  learnerLevel: number;
  levelTitle: string;
  xpProgressInLevel: number;
  quizzesTaken: number;
  completedLevelsCount: number;
  isCurrentUser: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') || '15', 10)));
    const currentUserId = searchParams.get('userId') || null;

    const offset = (page - 1) * limit;

    let entries: LeaderboardItem[] = [];
    let totalBuilders = 0;
    let currentUserEntry: LeaderboardItem | null = null;
    let currentUserRank: number | null = null;

    // 1. Attempt to query Supabase database
    const { data: allProfiles, error: fetchError, count } = await supabase
      .from('profiles')
      .select('id, username, total_xp, learner_level, quizzes_taken, completed_levels, updated_at', { count: 'exact' })
      .order('total_xp', { ascending: false })
      .order('updated_at', { ascending: true });

    if (!fetchError && allProfiles && allProfiles.length > 0) {
      totalBuilders = count || allProfiles.length;

      // Map all profiles with authoritative rank
      const allRanked = allProfiles.map((p, index) => {
        let cleanName = (p.username || '').trim();
        // Disallow emails from being displayed as usernames
        if (!cleanName || cleanName.includes('@')) {
          cleanName = cleanName ? cleanName.split('@')[0] : 'Novice Builder';
        }

        const safeXp = Math.max(0, p.total_xp || 0);
        const { learnerLevel, levelTitle, currentLevelXp } = calculateLevelAndProgress(safeXp);
        const completedCount = Array.isArray(p.completed_levels) ? p.completed_levels.length : 0;

        return {
          id: p.id,
          rank: index + 1,
          username: cleanName,
          avatarInitials: getAvatarInitials(cleanName),
          totalXp: safeXp,
          learnerLevel,
          levelTitle,
          xpProgressInLevel: currentLevelXp,
          quizzesTaken: p.quizzes_taken || 0,
          completedLevelsCount: completedCount,
          isCurrentUser: Boolean(currentUserId && p.id === currentUserId),
        };
      });

      // Find current user's entry across all database records
      if (currentUserId) {
        const found = allRanked.find((entry) => entry.id === currentUserId);
        if (found) {
          currentUserEntry = found;
          currentUserRank = found.rank;
        }
      }

      // Slice the requested page
      entries = allRanked.slice(offset, offset + limit);
    } else {
      // If no database records found yet or offline mode
      totalBuilders = entries.length;
    }

    const totalPages = Math.max(1, Math.ceil(totalBuilders / limit));

    return NextResponse.json({
      success: true,
      entries,
      totalBuilders,
      page,
      limit,
      totalPages,
      currentUserRank,
      currentUserEntry,
    });
  } catch (err: any) {
    console.error('Error in /api/leaderboard:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch global leaderboard',
        entries: [],
        totalBuilders: 0,
        page: 1,
        limit: 15,
        totalPages: 1,
      },
      { status: 500 }
    );
  }
}
