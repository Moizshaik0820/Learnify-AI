import { CSSRuleChallenge } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  appliedCss: string;
  passedChallenges: boolean[];
}

/**
 * Normalizes CSS values for flexible comparison
 * (e.g. handles quotes, lowercase, whitespace, rgb vs hex)
 */
function normalizeVal(val: string): string {
  return val
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses simple CSS text into key-value pairs per selector
 */
export function parseCssDeclarations(cssText: string): Map<string, string> {
  const map = new Map<string, string>();
  // Match declarations inside or outside blocks: property: value;
  const declRegex = /([a-zA-Z\-]+)\s*:\s*([^;{}]+)(?:;|\})/g;
  let match;
  while ((match = declRegex.exec(cssText)) !== null) {
    const prop = match[1].trim().toLowerCase();
    const val = match[2].trim();
    map.set(prop, val);
  }
  return map;
}

/**
 * Validates the student's CSS against the level's challenges
 */
export function validateCssSolution(
  userCss: string,
  challenges: CSSRuleChallenge[]
): ValidationResult {
  if (!userCss.trim()) {
    return {
      isValid: false,
      message: 'Please write your CSS code to reinforce the castle.',
      appliedCss: '',
      passedChallenges: challenges.map(() => false),
    };
  }

  const declarations = parseCssDeclarations(userCss);
  const passedChallenges: boolean[] = [];

  for (const challenge of challenges) {
    const prop = challenge.property.toLowerCase();
    const userVal = declarations.get(prop);

    if (!userVal) {
      passedChallenges.push(false);
      continue;
    }

    const normUser = normalizeVal(userVal);
    let matched = false;

    if (Array.isArray(challenge.expectedValue)) {
      matched = challenge.expectedValue.some(
        (exp) => normalizeVal(exp) === normUser || normUser.includes(normalizeVal(exp))
      );
    } else {
      const normExp = normalizeVal(challenge.expectedValue);
      matched = normUser === normExp || normUser.includes(normExp);
    }

    passedChallenges.push(matched);
  }

  const allPassed = passedChallenges.length > 0 && passedChallenges.every(Boolean);

  let message = 'Your CSS has been applied to the castle!';
  if (!allPassed) {
    const firstFailedIdx = passedChallenges.findIndex((p) => !p);
    if (firstFailedIdx !== -1) {
      message = challenges[firstFailedIdx].hint || 'Check your CSS property and value.';
    }
  }

  return {
    isValid: allPassed,
    message,
    appliedCss: userCss,
    passedChallenges,
  };
}
