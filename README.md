# Learnify AI — Feel the impulse of smart learning 🏰✨

Learnify AI is a complete, responsive CSS learning game for absolute beginners. Players learn CSS by constructing, fortifying, and decorating an interactive anime fantasy castle. Every single code challenge produces a visible, animated change in the castle's architecture.

---

## 🌟 Key Features

1. **Pixel-Perfect Educational Dashboard**
   - Direct implementation of the official design reference with fixed/sticky sidebar, hero banner, CSS world cards, right-hand progress analytics, and quick action shortcuts.
   - Powered by the official Learnify AI pulse logo.

2. **6 CSS Worlds & 144 Sequential Levels**
   - **World 1: Basics and Syntax (24 Levels)** — Selectors (element, class, ID, universal), cascade, specificity, `!important`, inheritance, comments, box model (dimensions, padding, border, margin, border-box).
   - **World 2: Styling and Typography (24 Levels)** — Font family, sizes, weights, styles, line-height, text-align, text-decoration, text-shadow, border-radius, gradients (linear & radial), backgrounds, opacity.
   - **World 3: Layout and Positioning (24 Levels)** — Display (block, inline, inline-block, none), positioning (relative, absolute, fixed, sticky), z-index, Flexbox (direction, justify-content, align-items, wrap, gap, flex-grow), Grid (columns, rows, gap, span).
   - **World 4: Responsive Design (24 Levels)** — Viewport units (`vw`, `vh`, `dvh`), `clamp()`, `min()`, `max()`, media queries, auto-fit minmax grid, fluid typography.
   - **World 5: Visual Effects (24 Levels)** — Box shadows, inset shadows, CSS filters (`blur`, `brightness`, `contrast`, `hue-rotate`, `drop-shadow`), transforms (translate, rotate, scale, skew, transform-origin), `clip-path`, `backdrop-filter`.
   - **World 6: Motion (24 Levels)** — CSS transitions, timing functions, transition delays, `@keyframes` animations, iteration counts, animation direction, fill modes, hover states, living castle animations.

3. **Interactive Fantasy Castle Component**
   - Built with pure SVG, HTML, and CSS.
   - Responsive to student code in real time: changing stone colors, raising drawbridges, lighting lanterns, igniting magical runic halos, and expanding battlements.

4. **Timed Code-Typing Challenge**
   - Reinforces muscle memory after each level.
   - Tracks accuracy %, WPM, and attempts.
   - Enforces full-line rewriting on mistakes with an accessible practice mode toggle.

5. **Level Mastery Quizzes & History**
   - Multi-question concept quizzes with immediate, explanatory feedback.
   - Records quiz attempts, scores, and timestamps in quiz history.
   - Identifies weak concepts and tags them for revision.

6. **Interactive Concept Mind Map & Revision Center**
   - Data-driven visual node graph displaying mastered vs weak vs in-progress concepts.
   - Direct launch of revision side-missions to earn bonus XP and castle achievements.

7. **AI Study Material Analyzer**
   - Accepts PDF uploads (drag & drop) and pasted lecture notes.
   - Extracts CSS concepts, detects curriculum gaps, and recommends matching castle levels.
   - Graceful error handling for scanned or unreadable documents.

8. **Bilingual Support (English & Hinglish)**
   - Seamless toggle between English and conversational Hindi written in Latin characters (Hinglish).
   - Explanations and instructions are translated while CSS code syntax remains strictly standard.

9. **Supabase PostgreSQL & Safe Demo Mode**
   - Complete PostgreSQL schema with Row Level Security (RLS) policies.
   - Transparent Demo Mode active by default with resilient browser storage persistence.

---

## 🛠️ Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with custom design tokens
- **Icons:** Lucide React
- **State Management:** Zustand with localStorage synchronization
- **Database / Auth:** Supabase PostgreSQL + RLS (with automatic local fallback)
- **Document Parsing:** pdf-parse (server-side API route)
- **Visuals:** Canvas Confetti & SVG Castle Assets

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Type Check
```bash
npm run type-check
npm run build
```

---

## 🔒 Supabase Setup (Optional)

To connect your Supabase database:
1. Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.
2. In the app, navigate to **Settings** and enter your `Supabase URL` and `Anon Key`.
